import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

const marketRateLimit = rateLimit({ windowMs: 60_000, maxRequests: 60 });

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/market")) {
    const rateLimitResponse = marketRateLimit(request);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    return NextResponse.next();
  }

  const { clerkMiddleware } = await import("@clerk/nextjs/server");
  const handler = clerkMiddleware();
  return handler(request, {} as any);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
