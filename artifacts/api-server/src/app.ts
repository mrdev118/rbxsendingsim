import express, { type Express } from "express";
import path from "node:path";
import fs from "node:fs";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Serve frontend static files when available (single-deploy mode)
try {
  const staticDir = process.env.STATIC_DIR || path.join(process.cwd(), "artifacts/roblox-homepage/dist");
  if (fs.existsSync(staticDir)) {
    app.use(express.static(staticDir, { index: false }));
    app.get("/*", (req, res) => {
      // if request starts with /api, let the API router handle it
      if (req.path.startsWith("/api")) return res.status(404).end();
      res.sendFile(path.join(staticDir, "index.html"));
    });
    logger.info({ staticDir }, "Serving frontend static files");
  }
} catch (err) {
  logger.warn({ err }, "Error while attempting to serve static files");
}

export default app;
