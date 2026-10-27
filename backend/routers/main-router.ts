import { DockgeServer } from "../dockge-server";
import { Router } from "../router";
import express, { Express, Router as ExpressRouter } from "express";
import { R } from "redbean-node";

export class MainRouter extends Router {
    create(app: Express, server: DockgeServer): ExpressRouter {
        const router = express.Router();

        router.get("/", (req, res) => {
            res.send(server.indexHTML);
        });

        // Robots.txt
        router.get("/robots.txt", async (_request, response) => {
            let txt = "User-agent: *\nDisallow: /";
            response.setHeader("Content-Type", "text/plain");
            response.send(txt);
        });

        // Health check: 200 when the server is up and the database answers, 503 otherwise
        router.get("/api/health", async (_request, response) => {
            response.setHeader("Cache-Control", "no-store");
            try {
                await R.getCell("SELECT 1");
                response.json({ status: "ok" });
            } catch (e) {
                response.status(503).json({ status: "error",
                    error: e instanceof Error ? e.message : String(e) });
            }
        });

        return router;
    }

}
