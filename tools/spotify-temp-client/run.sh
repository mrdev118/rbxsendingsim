
#!/usr/bin/env bash
set -euo pipefail

# Temporary script to call the RapidAPI Spotify downloader endpoint.
# Usage: ./run.sh <spotify_url_or_id> [FORMAT] [QUALITY]
# Provide your RapidAPI key via RAPIDAPI_KEY env var to avoid embedding secrets.

API_KEY="${RAPIDAPI_KEY:-3e8c32280amshfe3d788eb207b51p10b48fjsnccdeeb6fce2a}"
HOST='high-quality-spotify-downloader-api.p.rapidapi.com'

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <spotify_playlist_or_album_or_track_url_or_id> [FORMAT] [QUALITY]"
  echo "Example: $0 https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M AAC 320"
  exit 1
fi

INPUT="$1"
FORMAT="${2:-AAC}"
QUALITY="${3:-320}"

# Determine resource type and id from common Spotify URL formats
TYPE="playlists"
ID=""

if [[ "$INPUT" =~ spotify:([a-z]+):([A-Za-z0-9]+) ]]; then
  TYPE="${BASH_REMATCH[1]}"
  ID="${BASH_REMATCH[2]}"
elif [[ "$INPUT" =~ open.spotify.com/([a-z]+)/([A-Za-z0-9]+) ]]; then
  TYPE="${BASH_REMATCH[1]}"
  ID="${BASH_REMATCH[2]}"
else
  # If user provided a raw id, assume playlist unless they prefixed type:id
  ID="$INPUT"
fi

# Normalize type to the API expected path (albums, playlists, tracks)
case "$TYPE" in
  album|albums) PATH_TYPE="albums" ;;
  track|tracks) PATH_TYPE="tracks" ;;
  playlist|playlists) PATH_TYPE="playlists" ;;
  *) PATH_TYPE="playlists" ;;
esac

if [ -z "$ID" ]; then
  echo "Could not extract an ID from input: $INPUT"
  exit 1
fi

OUTFILE="${PATH_TYPE}_${ID}.${FORMAT,,}_${QUALITY}.zip"

echo "Requesting ${PATH_TYPE} ${ID} as ${FORMAT} @ ${QUALITY}kbps..."

# Build query string. The API historically supports `format`, add `quality` as best-effort.
QUERY="format=${FORMAT}"
QUERY+="&quality=${QUALITY}"

curl --fail --show-error --location --request GET \
  --url "https://${HOST}/v2/${PATH_TYPE}/${ID}/download?${QUERY}" \
  --header 'Content-Type: application/json' \
  --header "x-rapidapi-host: ${HOST}" \
  --header "x-rapidapi-key: ${API_KEY}" \
  --output "${OUTFILE}"

echo "Saved response to ${OUTFILE}"
