// ── Status helpers ────────────────────────────────────────────────────────────

function setStatus(mode) {
    const dot   = document.querySelector('.status-dot');
    const label = document.getElementById('statusLabel');
    const btn   = document.getElementById('scanBtn');

    if (mode === 'scanning') {
        dot.classList.add('scanning');
        label.textContent = 'SCANNING';
        btn.classList.add('scanning');
        document.getElementById('scanBtnText').textContent = 'SCANNING...';
    } else {
        dot.classList.remove('scanning');
        label.textContent = mode === 'done' ? 'DONE' : 'READY';
        btn.classList.remove('scanning');
        document.getElementById('scanBtnText').textContent = 'SCAN PORTS';
    }
}

// ── Well-Known Ports ──────────────────────────────────────────────────────────

async function useWellKnownPorts() {
    try {
        const res  = await fetch('/well-known-ports');
        const data = await res.json();

        document.getElementById('startPort').value = data.start_port;
        document.getElementById('endPort').value   = data.end_port;

        const result = document.getElementById('result');
        result.innerHTML = `
            <div class="scan-summary">
                ⚡ Well-known ports loaded &nbsp;
                <b>${data.start_port} → ${data.end_port}</b>
                &nbsp;|&nbsp; ${data.ports.length} key ports
            </div>
            <div style="font-family:var(--mono);font-size:11px;color:var(--text-dim);line-height:2;letter-spacing:1px;">
                ${data.ports.map(p => `<span style="display:inline-block;margin:2px 6px 2px 0;padding:2px 8px;border:1px solid var(--border);border-radius:2px;color:var(--green)">${p}</span>`).join('')}
            </div>`;
        document.getElementById('openCount').textContent = '—';
    } catch (e) {
        showError('Failed to load well-known ports.');
    }
}

// ── Progress helpers ──────────────────────────────────────────────────────────

function showProgress() {
    document.getElementById('progressContainer').classList.remove('hidden');
    updateProgress(0, 0);
}

function hideProgress() {
    document.getElementById('progressContainer').classList.add('hidden');
}

function updateProgress(scanned, total) {
    const pct = total > 0 ? Math.round((scanned / total) * 100) : 0;
    document.getElementById('progressBar').style.width    = pct + '%';
    document.getElementById('progressPercent').textContent = pct + '%';
    document.getElementById('scannedCount').textContent   = scanned;
    document.getElementById('totalCount').textContent     = total;
}

// ── Error display ─────────────────────────────────────────────────────────────

function showError(msg) {
    hideProgress();
    setStatus('ready');
    document.getElementById('result').innerHTML =
        `<div class="error-line">✕ &nbsp;${msg}</div>`;
    document.getElementById('openCount').textContent = '—';
}

// ── Main scan ─────────────────────────────────────────────────────────────────

async function scanPorts() {
    const target    = document.getElementById('target').value.trim();
    const startPort = document.getElementById('startPort').value;
    const endPort   = document.getElementById('endPort').value;
    const resultDiv = document.getElementById('result');

    if (!target || startPort === '' || endPort === '') {
        showError('Please fill in all fields before scanning.');
        return;
    }

    // Reset UI
    resultDiv.innerHTML = '';
    document.getElementById('openCount').textContent = '—';
    setStatus('scanning');
    showProgress();

    const openPorts = [];

    try {
        const response = await fetch('/scan/stream', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ target, start_port: startPort, end_port: endPort })
        });

        const reader  = response.body.getReader();
        const decoder = new TextDecoder();
        let   buffer  = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                try {
                    const event = JSON.parse(line.slice(6));
                    handleEvent(event, resultDiv, openPorts);
                } catch (_) {}
            }
        }
    } catch (err) {
        showError('Connection error. Is the Flask server running?');
        console.error(err);
    }
}

// ── SSE event handler ─────────────────────────────────────────────────────────

function handleEvent(event, resultDiv, openPorts) {
    if (event.type === 'error') {
        showError(event.message);
        return;
    }

    if (event.type === 'start') {
        const resolvedNote = event.resolved_ip !== event.target
            ? ` &nbsp;<span style="color:var(--text-dim)">(${event.resolved_ip})</span>` : '';
        resultDiv.innerHTML = `
            <div class="scan-summary">
                TARGET &nbsp;<b>${event.target}</b>${resolvedNote}
                &nbsp;|&nbsp; ${event.total} PORTS
            </div>`;
        updateProgress(0, event.total);
        return;
    }

    if (event.type === 'progress') {
        updateProgress(event.scanned, event.total);
        return;
    }

    if (event.type === 'open') {
        openPorts.push({ port: event.port, service: event.service });
        openPorts.sort((a, b) => a.port - b.port);
        renderResults(resultDiv, openPorts, null);
        document.getElementById('openCount').textContent =
            openPorts.length + ' OPEN';
        return;
    }

    if (event.type === 'done') {
        hideProgress();
        setStatus('done');
        renderResults(resultDiv, openPorts, event.total_scanned);
        document.getElementById('openCount').textContent =
            openPorts.length + ' OPEN';
        return;
    }
}

// ── Render results ────────────────────────────────────────────────────────────

function renderResults(resultDiv, openPorts, totalScanned) {
    const summary = resultDiv.querySelector('.scan-summary');
    const summaryHTML = summary ? summary.outerHTML : '';

    if (openPorts.length === 0) {
        const msg = totalScanned !== null
            ? `All ${totalScanned} ports are closed or filtered.`
            : 'Scanning — no open ports found yet...';
        resultDiv.innerHTML = summaryHTML +
            `<div class="no-ports">◌ &nbsp;${msg}</div>`;
        return;
    }

    let html = summaryHTML +
        `<div class="result-section-title">OPEN PORTS</div>`;

    for (const { port, service } of openPorts) {
        html += `
            <div class="port-row">
                <span class="port-num">${port}</span>
                <span class="port-service-tag">${service}</span>
                <span class="port-status-open">OPEN</span>
            </div>`;
    }

    resultDiv.innerHTML = html;
}