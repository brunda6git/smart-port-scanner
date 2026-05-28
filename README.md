

███████╗███╗   ███╗ █████╗ ██████╗ ████████╗    ██████╗  ██████╗ ██████╗ ████████╗    ███████╗ ██████╗ █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗
██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██╔════╝██╔════╝██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
███████╗██╔████╔██║███████║██████╔╝   ██║       ██████╔╝██║   ██║██████╔╝   ██║       ███████╗██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
╚════██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║       ██╔═══╝ ██║   ██║██╔══██╗   ██║       ╚════██║██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
███████║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║       ██║     ╚██████╔╝██║  ██║   ██║       ███████║╚██████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝


<div align="center">

```
███████╗███╗   ███╗ █████╗ ██████╗ ████████╗    ██████╗  ██████╗ ██████╗ ████████╗    ███████╗ ██████╗ █████╗ ███╗   ██╗███╗   ██╗███████╗██████╗
██╔════╝████╗ ████║██╔══██╗██╔══██╗╚══██╔══╝    ██╔══██╗██╔═══██╗██╔══██╗╚══██╔══╝    ██╔════╝██╔════╝██╔══██╗████╗  ██║████╗  ██║██╔════╝██╔══██╗
███████╗██╔████╔██║███████║██████╔╝   ██║       ██████╔╝██║   ██║██████╔╝   ██║       ███████╗██║     ███████║██╔██╗ ██║██╔██╗ ██║█████╗  ██████╔╝
╚════██║██║╚██╔╝██║██╔══██║██╔══██╗   ██║       ██╔═══╝ ██║   ██║██╔══██╗   ██║       ╚════██║██║     ██╔══██║██║╚██╗██║██║╚██╗██║██╔══╝  ██╔══██╗
███████║██║ ╚═╝ ██║██║  ██║██║  ██║   ██║       ██║     ╚██████╔╝██║  ██║   ██║       ███████║╚██████╗██║  ██║██║ ╚████║██║ ╚████║███████╗██║  ██║
╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝      ╚═════╝ ╚═╝  ╚═╝   ╚═╝       ╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
```

# 🔍 Smart Port Scanner

**A web-based network port scanner built with Python & Flask**

![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0+-000000?style=for-the-badge&logo=flask&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## 📌 About

**Smart Port Scanner** is a mini project that lets you scan open TCP ports on any IP address or hostname — right from your browser. It uses Python's socket library for scanning and Flask for the web backend, with a cyberpunk-themed UI that shows results in real time.

Built as a semester mini project to demonstrate concepts in **network security**, **backend web development**, and **concurrent programming**.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🔴 **Live Progress Bar** | Real-time scan progress using Server-Sent Events (SSE) — no page refresh needed |
| ⚡ **Well-Known Ports Shortcut** | One-click preset that loads 19 well-known ports (FTP, SSH, HTTP, HTTPS, MySQL...) |
| 🏷️ **Service Detection** | Identifies the service running on each open port (SSH, HTTP, FTP, RDP, etc.) |
| ⚙️ **Multithreaded Scanning** | Up to 200 concurrent threads for fast scanning |
| ✅ **Input Validation** | Validates IP address, hostname, port range on both frontend and backend |
| 🌐 **Hostname Support** | Accepts domain names like `google.com` and resolves them automatically |
| 🎨 **Cyberpunk UI** | Animated grid background, glowing effects, terminal-style fonts |

---

## 🖥️ Screenshots

> *(Add screenshots here after running the project)*

---

## 🛠️ Tech Stack

**Backend**
- Python 3.8+
- Flask 3.0
- `socket` — TCP connect scanning
- `concurrent.futures` — multithreaded port scanning

**Frontend**
- Vanilla HTML / CSS / JavaScript
- Server-Sent Events (SSE) for live streaming
- Google Fonts — Orbitron + Share Tech Mono

---

## 📁 Project Structure

```
smart-port-scanner/
│
├── app.py                  ← Flask backend (main file)
├── requirements.txt        ← Python dependencies
├── README.md
│
├── templates/
│   └── index.html          ← Frontend HTML
│
└── static/
    ├── style.css           ← Cyberpunk UI styles
    └── script.js           ← Frontend logic + SSE handling
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- pip

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/smart-port-scanner.git
cd smart-port-scanner
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Run the app**
```bash
python app.py
```

**4. Open in browser**
```
http://localhost:5000
```

---

## 🧪 How to Use

1. Enter an **IP address** (e.g. `192.168.1.1`) or a **hostname** (e.g. `google.com`)
2. Set the **Start Port** and **End Port** for your scan range
3. Or click **⚡ Well-Known Ports** to auto-fill common ports
4. Click **INITIATE SCAN**
5. Watch the live progress bar fill up as ports are scanned
6. Open ports appear in real-time with their service name

---

## 🔌 API Reference

### `POST /scan/stream`
Streams scan results as Server-Sent Events.

**Request Body:**
```json
{
  "target": "192.168.1.1",
  "start_port": 1,
  "end_port": 1000
}
```

**SSE Event Types:**

| Event | Payload | Description |
|-------|---------|-------------|
| `start` | `{ target, resolved_ip, total }` | Scan started |
| `progress` | `{ scanned, total }` | Port scanned |
| `open` | `{ port, service }` | Open port found |
| `done` | `{ total_scanned, open_count }` | Scan complete |
| `error` | `{ message }` | Validation error |

### `GET /well-known-ports`
Returns the list of well-known ports.

**Response:**
```json
{
  "ports": [21, 22, 23, 25, 53, 80, ...],
  "start_port": 21,
  "end_port": 8443
}
```

---

## ⚠️ Limits & Validation

- Ports must be between **1 and 65535**
- Maximum **10,000 ports** per scan
- Accepts **IPv4 addresses** and **hostnames**
- Uses **TCP connect scan** — no root/admin privileges required

---

## 🔒 Disclaimer

This tool is built for **educational purposes only** as part of a college mini project. Only scan systems and networks you have **explicit permission** to test. Unauthorized port scanning may be illegal in your jurisdiction.

---

## 👨‍💻 Author

Made with ❤️ for a network security mini project.

---

<div align="center">

⭐ **If you found this useful, give it a star!** ⭐

</div>


