const inputEl = document.getElementById('input')
const apiKeyEl = document.getElementById('apikey')
const prepareBtn = document.getElementById('prepare')
const downloadAllBtn = document.getElementById('downloadAll')
const statusEl = document.getElementById('status')
const filesEl = document.getElementById('files')

let currentKey = null

const tracksArea = document.getElementById('tracks')
const prepareTracksBtn = document.getElementById('prepareTracks')
const downloadTracksAllBtn = document.getElementById('downloadTracksAll')

prepareBtn.onclick = async () => {
  const input = inputEl.value.trim()
  if (!input) return alert('Enter a Spotify URL or id')
  statusEl.textContent = 'Preparing — this may take a while (downloading ZIP from RapidAPI)...'
  filesEl.innerHTML = ''
  downloadAllBtn.disabled = true
  try {
    const resp = await fetch('/api/prepare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, apiKey: apiKeyEl.value.trim() || undefined, format: 'AAC', quality: '320' })
    })
    if (!resp.ok) throw new Error(await resp.text())
    const data = await resp.json()
    currentKey = data.key
    statusEl.textContent = `Loaded ${data.files.length} files.`
    for (const f of data.files) {
      const d = document.createElement('div')
      d.className = 'file'
      d.textContent = f
      filesEl.appendChild(d)
    }
    downloadAllBtn.disabled = false
  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message
  }
}

downloadAllBtn.onclick = () => {
  if (!currentKey) return
  window.location = `/api/download/${currentKey}`
}

prepareTracksBtn.onclick = async () => {
  const raw = tracksArea.value.trim()
  if (!raw) return alert('Paste track URLs or IDs (one per line)')
  statusEl.textContent = 'Preparing tracks — downloading individually and zipping...'
  filesEl.innerHTML = ''
  downloadTracksAllBtn.disabled = true
  try {
    const lines = raw.split(/\r?\n/).map(s => s.trim()).filter(Boolean)
    const resp = await fetch('/api/prepare-tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tracks: lines, apiKey: apiKeyEl.value.trim() || undefined, format: 'AAC', quality: '320' })
    })
    if (!resp.ok) throw new Error(await resp.text())
    const data = await resp.json()
    currentKey = data.key
    statusEl.textContent = `Prepared ${data.files.length} tracks.`
    for (const f of data.files) {
      const d = document.createElement('div')
      d.className = 'file'
      d.textContent = f
      filesEl.appendChild(d)
    }
    downloadTracksAllBtn.disabled = false
  } catch (err) {
    statusEl.textContent = 'Error: ' + err.message
  }
}

downloadTracksAllBtn.onclick = () => {
  if (!currentKey) return
  window.location = `/api/download/${currentKey}`
}
