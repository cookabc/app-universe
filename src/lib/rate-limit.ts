import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
  windowMs: 60_000,
  maxRequests: 60,
};

export function rateLimit(options: Partial<RateLimitOptions> = {}) {
  const { windowMs, maxRequests } = { ...DEFAULT_OPTIONS, ...options };

  return function checkRateLimit(request: NextRequest): NextResponse | null {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return null;
    }

    entry.count++;

    if (entry.count > maxRequests) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Too many requests, please try again later",
            code: "RATE_LIMIT_EXCEEDED",
            statusCode: 429,
          },
        },
        { status: 429 },
      );
    }

    return null;
  };
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 60_000);
