import type { NextFunction, Request, Response } from "express";

import { AppError } from "../../shared/errors.js";
import { analyzeInputSchema, analyzeResponseSchema } from "./analyze.schema.js";
import { analyzeService } from "./analyze.service.js";

export const analyzeController = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const parsedInput = analyzeInputSchema.safeParse(request.body);
    if (!parsedInput.success) {
      throw new AppError("Invalid request payload", 400, parsedInput.error.flatten());
    }

    const input = parsedInput.data;
    const result = await analyzeService.run(input);
    const parsedResponse = analyzeResponseSchema.safeParse(result);
    if (!parsedResponse.success) {
      throw new AppError("Analyze workflow returned an invalid response shape", 502, parsedResponse.error.flatten());
    }

    response.status(200).json(parsedResponse.data);
  } catch (error) {
    next(error);
  }
};
