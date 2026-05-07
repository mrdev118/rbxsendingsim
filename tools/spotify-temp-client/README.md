# Temporary Spotify downloader client

This is a small, temporary helper to call the RapidAPI endpoint shown by the user. It's meant to be used and removed later.

Usage:

1. (Optional) set your RapidAPI key as an environment variable to avoid embedding secrets:

```
export RAPIDAPI_KEY=your_key_here
```


2. Run the script with a Spotify playlist/album/track URL or raw id. Format defaults to `AAC` and quality defaults to `320` kbps:

```
./run.sh https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M AAC 320
```

The script will save the API response to a file named `<type>_<id>.<format>_<quality>.zip` in the current folder.

Files:

- [tools/spotify-temp-client/run.sh](tools/spotify-temp-client/run.sh#L1)

Notes:

- This folder is intentionally standalone and can be deleted after use.
- Do not commit any real API keys to the repo; prefer `RAPIDAPI_KEY` env var.
