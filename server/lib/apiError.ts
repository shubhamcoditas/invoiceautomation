/**
 * Centralised API error handling. Use in catch blocks to send a consistent JSON shape.
 */

import type { Response } from "express";

export interface ApiErrorBody {
  error: string;
  code?: string;
  details?: string;
}

/**
 * Send a standard error response and optionally log.
 * Maps known patterns to status codes; defaults to 500.
 */
export function handleApiError(
  error: unknown,
  res: Response,
  options?: {
    defaultMessage?: string;
    defaultStatus?: number;
    log?: boolean;
  }
): void {
  const defaultMessage = options?.defaultMessage ?? "An unexpected error occurred";
  const defaultStatus = options?.defaultStatus ?? 500;
  const shouldLog = options?.log !== false;

  if (shouldLog && error instanceof Error) {
    console.error("[API Error]", error.message, error.stack);
  }

  const message = error instanceof Error ? error.message : String(error);
  const status = defaultStatus;
  const body: ApiErrorBody = {
    error: message || defaultMessage,
  };

  // Optional: add code for client handling (e.g. "NOT_FOUND", "VALIDATION_ERROR")
  if (status === 404) body.code = "NOT_FOUND";
  if (status === 400) body.code = "VALIDATION_ERROR";

  res.status(status).json(body);
}

/**
 * Send 404 with a message.
 */
export function sendNotFound(res: Response, message: string = "Resource not found"): void {
  res.status(404).json({ error: message, code: "NOT_FOUND" });
}

/**
 * Send 400 with a message (e.g. validation).
 */
export function sendBadRequest(res: Response, message: string, details?: string): void {
  res.status(400).json({
    error: message,
    code: "VALIDATION_ERROR",
    ...(details && { details }),
  });
}
