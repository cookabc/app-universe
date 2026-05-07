import { apiError, apiSuccess, validateFundCode } from "@/lib/api-utils";
import { ValidationError } from "@/lib/error-handling";

interface NetWorthPoint {
  x: number;
  y: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const validationError = validateFundCode(code);
  if (validationError) {
    return apiError(new ValidationError(validationError), 400);
  }

  try {
    const res = await fetch(
      `https://fund.eastmoney.com/pingzhongdata/${code}.js?v=${Date.now()}`,
      {
        headers: { Referer: "https://fund.eastmoney.com" },
        next: { revalidate: 3600 },
      },
    );
    const text = await res.text();
    const match = text.match(/var\s+Data_netWorthTrend\s*=\s*(\[[\s\S]*?\]);/);
    if (match && match[1]) {
      const raw: NetWorthPoint[] = JSON.parse(match[1]);
      const trend = raw.slice(-30).map((item) => ({
        date: new Date(item.x).toISOString().slice(0, 10),
        value: item.y,
      }));
      return apiSuccess(trend);
    }
    return apiSuccess([]);
  } catch (error) {
    console.error("[fund-history] Error:", error);
    return apiError(error, 502);
  }
}
