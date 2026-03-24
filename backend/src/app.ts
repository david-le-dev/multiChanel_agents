import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { analyzeRouter } from "./modules/analyze/analyze.routes.js";
import { errorHandler, notFoundHandler } from "./shared/http.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL,
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      service: "ai-multi-channel-content-orchestrator-api",
      environment: env.NODE_ENV,
    });
  });

  app.use("/api/analyze", analyzeRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
