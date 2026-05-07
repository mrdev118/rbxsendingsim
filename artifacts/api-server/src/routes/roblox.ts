import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/roblox/search", async (req, res) => {
  const q = String(req.query["q"] ?? "").trim();
  if (!q) {
    res.json({ data: [] });
    return;
  }
  try {
    const r = await fetch(
      // Roblox API requires limit to be one of [10,25,50,100]. Request 10 and trim locally.
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(q)}&limit=10`,
      { headers: { "Accept": "application/json" } }
    );
    const json = await r.json() as { data?: unknown[] };
    // upstream returns up to 10; return first 3 to the client for the UI
    const data = (json.data ?? []).slice(0, 3);
    res.json({ data });
  } catch {
    res.status(502).json({ data: [], error: "upstream_error" });
  }
});

router.get("/roblox/avatars", async (req, res) => {
  const ids = String(req.query["userIds"] ?? "").trim();
  if (!ids) {
    res.json({ data: [] });
    return;
  }
  try {
    const r = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${encodeURIComponent(ids)}&size=48x48&format=Png&isCircular=true`,
      { headers: { "Accept": "application/json" } }
    );
    const json = await r.json() as { data?: unknown[] };
    res.json({ data: json.data ?? [] });
  } catch {
    res.status(502).json({ data: [], error: "upstream_error" });
  }
});

router.get("/roblox/user", async (req, res) => {
  const id = String(req.query["id"] ?? "").trim();
  if (!id) {
    res.json({ data: null });
    return;
  }
  try {
    const r = await fetch(`https://users.roblox.com/v1/users/${encodeURIComponent(id)}`, { headers: { "Accept": "application/json" } });
    if (!r.ok) {
      res.status(502).json({ data: null, error: "upstream_error" });
      return;
    }
    const json = await r.json() as Record<string, unknown>;
    // return the raw user object (includes created date when available)
    res.json({ data: json });
  } catch {
    res.status(502).json({ data: null, error: "upstream_error" });
  }
});

export default router;

