import { Router } from "express";

import { analyzeController } from "./analyze.controller.js";

export const analyzeRouter = Router();

analyzeRouter.post("/", analyzeController);
