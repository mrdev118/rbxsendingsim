Render deployment notes

This repo is now ready to deploy as a single Render Web Service that serves both the API and the built frontend static site from one process.

Single-service Render setup (recommended)
- Service type: Web Service (Node)
- Build Command: `pnpm --filter @workspace/api-server build`
  - This builds the frontend first and then bundles the API into `artifacts/api-server/dist`.
- Start Command: `pnpm --filter @workspace/api-server start`
  - Starts the bundled Node server which serves API routes under `/api/*` and the frontend from `artifacts/roblox-homepage/dist`.

Render environment notes
- `PORT` will be provided by Render and is respected by the server.
- The server looks for static files at `artifacts/roblox-homepage/dist` by default. If you need a different path, set the `STATIC_DIR` env var to the absolute or repo-relative path.
- If you deploy both API and frontend under the same origin, you do not need to set `VITE_API_BASE`; the frontend will use relative `/api/*` paths and work automatically.

Quick deploy checklist
1. On Render, create a new "Web Service" using this repository.
2. Set the Build Command to:

```bash
pnpm --filter @workspace/api-server build
```

3. Set the Start Command to:

```bash
pnpm --filter @workspace/api-server start
```

4. (Optional) Set `STATIC_DIR` env var if you want a different static output location.

Local test commands
```bash
# Install dependencies
pnpm install

# Build full single-service bundle (frontend + server)
pnpm --filter @workspace/api-server build

# Run the bundled server locally
pnpm --filter @workspace/api-server start

# Then visit http://localhost:4000/ (or the PORT you set)
```

Notes
- The API routes remain available at `/api/*` and the frontend is served for all other paths (SPA routing).
- I can add a `render.yaml` that defines the single service and its build/start commands if you want to commit deployment config directly to the repo.

Next steps I can take
- Add `render.yaml` for one-service deployment.
- Add a Dockerfile for the bundled server so you can deploy a container image.
- Run a local build and start the server here to verify everything works.

Which would you like me to do next?