/**
 * Request body validation using Zod. Use as middleware or inline in route handlers.
 */

import type { Request, Response, NextFunction } from "express";
import type { z } from "zod";
import { sendBadRequest } from "./apiError";

/**
 * Returns Express middleware that validates req.body against the given Zod schema.
 * On failure, sends 400 with error message and does not call next().
 */
export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (result.success) {
      (req as any).validatedBody = result.data;
      next();
      return;
    }
    const first = result.error.flatten();
    const message = first.formErrors?.[0] ?? result.error.message;
    const details = result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
    sendBadRequest(res, message, details);
  };
}
