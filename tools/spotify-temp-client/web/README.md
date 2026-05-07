# Spotify Temp Web UI

Simple, temporary web UI to prepare and download Spotify playlists/albums/tracks using the RapidAPI "high-quality-spotify-downloader-api".

Quick start:

1. Change into the web folder and install deps:

```bash
cd tools/spotify-temp-client/web
npm install
```

2. (Optional) set your RapidAPI key as an env var:

```bash
export RAPIDAPI_KEY=your_key_here
```

3. Start the server:

```bash
npm start
# Server listens on http://localhost:5174
```

4. Open `http://localhost:5174` in your browser. Paste a Spotify URL/ID, click "Load songs" and then "Download All" to download the ZIP.

New: to prepare individual tracks from a playlist, paste one `track` URL or `track_id` per line into the textarea and click "Prepare Tracks (download & zip)". When ready, click "Download Tracks ZIP" to download all tracks in one archive.

Notes:

- The server downloads the upstream ZIP to a tmp folder and reads its entries to list filenames — the whole ZIP is downloaded during "Load songs".
- This is a temporary helper; remove `tools/spotify-temp-client` when you no longer need it.
