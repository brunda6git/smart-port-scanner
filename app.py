from flask import Flask, request, jsonify, render_template, Response
import socket
import concurrent.futures
import re
import json

app = Flask(__name__)

# ── Well-known ports & their services ────────────────────────────────────────

WELL_KNOWN_PORTS = [
    21, 22, 23, 25, 53, 80, 110, 119, 123,
    143, 161, 194, 443, 445, 3306, 3389, 5900, 8080, 8443
]

SERVICE_MAP = {
    21:   "FTP",
    22:   "SSH",
    23:   "Telnet",
    25:   "SMTP",
    53:   "DNS",
    80:   "HTTP",
    110:  "POP3",
    119:  "NNTP",
    123:  "NTP",
    143:  "IMAP",
    161:  "SNMP",
    194:  "IRC",
    443:  "HTTPS",
    445:  "SMB",
    3306: "MySQL",
    3389: "RDP",
    5900: "VNC",
    8080: "HTTP-Alt",
    8443: "HTTPS-Alt",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def is_valid_ip(ip: str) -> bool:
    ipv4 = re.compile(r"^(\d{1,3}\.){3}\d{1,3}$")
    if ipv4.match(ip):
        parts = ip.split(".")
        return all(0 <= int(p) <= 255 for p in parts)
    hostname = re.compile(r"^[a-zA-Z0-9._-]+$")
    return bool(hostname.match(ip))

def get_service(port: int) -> str:
    if port in SERVICE_MAP:
        return SERVICE_MAP[port]
    try:
        return socket.getservbyport(port, "tcp")
    except OSError:
        return "Unknown"

def scan_port(target: str, port: int, timeout: float = 1.0):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((target, port))
            if result == 0:
                return (port, get_service(port))
            return None
    except (socket.error, OSError):
        return None

def validate_request(data):
    if not data:
        return None, None, None, "Invalid JSON body"

    target     = str(data.get("target", "")).strip()
    start_port = data.get("start_port")
    end_port   = data.get("end_port")

    if not target:
        return None, None, None, "Target IP / hostname is required"
    if not is_valid_ip(target):
        return None, None, None, "Invalid IP address or hostname"

    try:
        start_port = int(start_port)
        end_port   = int(end_port)
    except (TypeError, ValueError):
        return None, None, None, "Ports must be integers"

    if not (1 <= start_port <= 65535) or not (1 <= end_port <= 65535):
        return None, None, None, "Ports must be between 1 and 65535"
    if start_port > end_port:
        return None, None, None, "Start port must be <= end port"
    if (end_port - start_port + 1) > 10_000:
        return None, None, None, "Range too large — max 10 000 ports per scan"

    return target, start_port, end_port, None

# ── Routes ────────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/well-known-ports")
def well_known_ports():
    return jsonify({
        "ports":      WELL_KNOWN_PORTS,
        "start_port": min(WELL_KNOWN_PORTS),
        "end_port":   max(WELL_KNOWN_PORTS),
    })


@app.route("/scan/stream", methods=["POST"])
def scan_stream():
    data = request.get_json(silent=True)
    target, start_port, end_port, err = validate_request(data)

    def error_stream(msg):
        yield f"data: {json.dumps({'type': 'error', 'message': msg})}\n\n"

    if err:
        return Response(error_stream(err), mimetype="text/event-stream")

    try:
        resolved_ip = socket.gethostbyname(target)
    except socket.gaierror:
        return Response(
            error_stream(f"Cannot resolve host: {target}"),
            mimetype="text/event-stream"
        )

    ports   = list(range(start_port, end_port + 1))
    total   = len(ports)
    workers = min(200, total)

    def generate():
        scanned    = 0
        open_count = 0

        yield f"data: {json.dumps({'type': 'start', 'target': target, 'resolved_ip': resolved_ip, 'total': total})}\n\n"

        with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
            futures = {executor.submit(scan_port, resolved_ip, p): p for p in ports}

            for future in concurrent.futures.as_completed(futures):
                result   = future.result()
                scanned += 1

                yield f"data: {json.dumps({'type': 'progress', 'scanned': scanned, 'total': total})}\n\n"

                if result is not None:
                    port, service = result
                    open_count   += 1
                    yield f"data: {json.dumps({'type': 'open', 'port': port, 'service': service})}\n\n"

        yield f"data: {json.dumps({'type': 'done', 'total_scanned': total, 'open_count': open_count})}\n\n"

    return Response(generate(), mimetype="text/event-stream")


@app.route("/scan", methods=["POST"])
def scan():
    data = request.get_json(silent=True)
    target, start_port, end_port, err = validate_request(data)

    if err:
        return jsonify({"error": err}), 400

    try:
        resolved_ip = socket.gethostbyname(target)
    except socket.gaierror:
        return jsonify({"error": f"Cannot resolve host: {target}"}), 400

    ports      = range(start_port, end_port + 1)
    port_range = end_port - start_port + 1
    open_ports = []

    workers = min(200, port_range)
    with concurrent.futures.ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(scan_port, resolved_ip, p): p for p in ports}
        for future in concurrent.futures.as_completed(futures):
            result = future.result()
            if result is not None:
                open_ports.append(result)

    open_ports.sort(key=lambda x: x[0])

    return jsonify({
        "target":        target,
        "resolved_ip":   resolved_ip,
        "start_port":    start_port,
        "end_port":      end_port,
        "open_ports":    [{"port": p, "service": s} for p, s in open_ports],
        "total_scanned": port_range,
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)