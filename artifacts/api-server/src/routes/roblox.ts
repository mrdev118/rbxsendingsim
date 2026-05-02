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
      `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(q)}&limit=10`,
      { headers: { "Accept": "application/json" } }
    );
    const json = await r.json() as { data?: unknown[] };
    res.json({ data: json.data ?? [] });
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

export default router;
