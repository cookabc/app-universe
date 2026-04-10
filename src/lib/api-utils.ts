import { NextResponse } from "next/server";
import { formatErrorResponse } from "./error-handling";

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: unknown, status?: number) {
  const formatted = formatErrorResponse(error);
  const statusCode = status ?? (formatted.error?.statusCode ?? 500);
  return NextResponse.json(
    { success: false, error: formatted.error },
    { status: statusCode },
  );
}

export function validateFundCode(code: string | null): string | null {
  if (!code || !/^\d{6}$/.test(code)) {
    return "Invalid or missing fund code. Must be 6 digits.";
  }
  return null;
}

export function safeParseFloat(value: string | undefined, fallback = 0): number {
  if (!value) return fallback;
  const result = parseFloat(value);
  return Number.isNaN(result) ? fallback : result;
}
