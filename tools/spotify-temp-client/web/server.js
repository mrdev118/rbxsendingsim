const express = require('express')
const fetch = global.fetch || require('node-fetch')
const fs = require('fs')
const path = require('path')
const os = require('os')
const AdmZip = require('adm-zip')
const cors = require('cors')

const app = express()
app.use(express.json({ limit: '200mb' }))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

const HOST = 'high-quality-spotify-downloader-api.p.rapidapi.com'
const DEFAULT_API_KEY = process.env.RAPIDAPI_KEY || '3e8c32280amshfe3d788eb207b51p10b48fjsnccdeeb6fce2a'

// Simple in-memory map of prepared downloads
const downloads = new Map()

function parseSpotify(input) {
  let type = 'playlists'
  let id = input
  const urlMatch = input.match(/spotify:([a-z]+):([A-Za-z0-9]+)/)
  if (urlMatch) {
    type = urlMatch[1]
    id = urlMatch[2]
  } else {
    const webMatch = input.match(/open.spotify.com\/([a-z]+)\/([A-Za-z0-9]+)/)
    if (webMatch) {
      type = webMatch[1]
      id = webMatch[2]
    }
  }
  if (type === 'album' || type === 'albums') type = 'albums'
  if (type === 'track' || type === 'tracks') type = 'tracks'
  if (type === 'playlist' || type === 'playlists') type = 'playlists'
  return { type, id }
}

app.post('/api/prepare', async (req, res) => {
  try {
    const { input, apiKey, format = 'AAC', quality = '320' } = req.body
    if (!input) return res.status(400).json({ error: 'input required' })
    const { type, id } = parseSpotify(input)

    const query = `format=${encodeURIComponent(format)}&quality=${encodeURIComponent(quality)}`
    const url = `https://${HOST}/v2/${type}/${id}/download?${query}`

    const key = `${type}_${id}_${Date.now()}`
    const tmpDir = path.join(os.tmpdir(), 'spotify-temp-client')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    const tmpPath = path.join(tmpDir, `${key}.zip`)

    const headers = {
      'Content-Type': 'application/json',
      'x-rapidapi-host': HOST,
      'x-rapidapi-key': apiKey || DEFAULT_API_KEY,
    }

    const resp = await fetch(url, { method: 'GET', headers })
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '')
      return res.status(502).json({ error: 'Upstream error', status: resp.status, body: txt })
    }

    const buffer = Buffer.from(await resp.arrayBuffer())
    fs.writeFileSync(tmpPath, buffer)

    // Read zip entries to get filenames
    const zip = new AdmZip(buffer)
    const entries = zip.getEntries().map(e => e.entryName)

    downloads.set(key, { path: tmpPath, type, id, entries })

    res.json({ key, type, id, files: entries })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
})

app.post('/api/prepare-tracks', async (req, res) => {
  try {
    const { tracks: tracksInput, apiKey, format = 'AAC', quality = '320' } = req.body
    if (!tracksInput) return res.status(400).json({ error: 'tracks required' })

    const trackList = Array.isArray(tracksInput)
      ? tracksInput
      : String(tracksInput).split(/\r?\n/).map(s => s.trim()).filter(Boolean)

    if (trackList.length === 0) return res.status(400).json({ error: 'no tracks provided' })

    const key = `multi_${Date.now()}`
    const tmpDir = path.join(os.tmpdir(), 'spotify-temp-client')
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
    const files = []

    for (let i = 0; i < trackList.length; i++) {
      const input = trackList[i]
      const { type, id } = parseSpotify(input)
      if (type !== 'tracks') {
        // skip non-track entries
        continue
      }

      const url = `https://${HOST}/v2/tracks/${id}/download?format=${encodeURIComponent(format)}&quality=${encodeURIComponent(quality)}`
      const headers = {
        'Content-Type': 'application/json',
        'x-rapidapi-host': HOST,
        'x-rapidapi-key': apiKey || DEFAULT_API_KEY,
      }

      const resp = await fetch(url, { method: 'GET', headers })
      if (!resp.ok) {
        const txt = await resp.text().catch(() => '')
        return res.status(502).json({ error: 'Upstream error', status: resp.status, body: txt })
      }

      const buf = Buffer.from(await resp.arrayBuffer())

      // Determine filename: try content-disposition; fallback to id.format
      let filename = `${id}.${format.toLowerCase()}`
      const cd = resp.headers.get('content-disposition')
      if (cd) {
        const m = cd.match(/filename\*=UTF-8''([^;\n]+)/) || cd.match(/filename="?([^";\n]+)"?/) 
        if (m) filename = decodeURIComponent(m[1])
      }

      const filePath = path.join(tmpDir, `${key}_${i}_${filename}`)
      fs.writeFileSync(filePath, buf)
      files.push({ path: filePath, name: filename })
    }

    if (files.length === 0) return res.status(400).json({ error: 'no valid track entries found' })

    // Create a combined zip
    const zip = new AdmZip()
    for (const f of files) {
      zip.addLocalFile(f.path, '', f.name)
    }
    const zipPath = path.join(tmpDir, `${key}.zip`)
    zip.writeZip(zipPath)

    downloads.set(key, { path: zipPath, type: 'multi', id: key, entries: files.map(f => f.name) })

    res.json({ key, files: files.map(f => f.name) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: String(err) })
  }
})

app.get('/api/download/:key', (req, res) => {
  const { key } = req.params
  const info = downloads.get(key)
  if (!info) return res.status(404).send('Not found')
  const filename = `${info.type}_${info.id}.zip`
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  const stream = fs.createReadStream(info.path)
  stream.pipe(res)
})

app.get('/api/list/:key', (req, res) => {
  const { key } = req.params
  const info = downloads.get(key)
  if (!info) return res.status(404).json({ error: 'Not found' })
  res.json({ key, files: info.entries })
})

app.listen(5174, () => console.log('Spotify temp web UI listening on http://localhost:5174'))
