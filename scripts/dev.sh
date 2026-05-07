#!/usr/bin/env sh
set -e

# Single-command dev starter for the Roblox homepage and API only.
# Stable defaults:
# - Homepage: 5173
# - API: 4000

ROBLOX_PORT=${ROBLOX_PORT:-5173}
API_PORT=${API_PORT:-4000}

cleanup() {
	kill "$homepage_pid" "$api_pid" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

echo "Starting roblox-homepage on port $ROBLOX_PORT"
PORT="$ROBLOX_PORT" BASE_PATH="/" API_PORT="$API_PORT" pnpm --filter ./artifacts/roblox-homepage dev &
homepage_pid=$!

echo "Building api-server"
(cd artifacts/api-server && node ./build.mjs)

echo "Starting api-server on port $API_PORT"
PORT="$API_PORT" node --enable-source-maps ./artifacts/api-server/dist/index.mjs &
api_pid=$!

wait