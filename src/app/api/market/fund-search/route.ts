import { apiSuccess, apiError } from "@/lib/api-utils";
import { ValidationError } from "@/lib/error-handling";

interface EastMoneyFundEntry {
  CATEGORY: number | string;
  CATEGORYDESC: string;
  CODE: string;
  NAME: string;
}

interface EastMoneySearchResponse {
  Datas?: EastMoneyFundEntry[];
}

const MAX_KEY_LENGTH = 50;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key?.trim()) {
    return apiError(new ValidationError("Search key is required"), 400);
  }

  if (key.length > MAX_KEY_LENGTH) {
    return apiError(new ValidationError(`Search key must be at most ${MAX_KEY_LENGTH} characters`), 400);
  }

  try {
    const res = await fetch(
      `https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${encodeURIComponent(key)}&_=${Date.now()}`,
      { headers: { Referer: "https://fund.eastmoney.com" } },
    );
    const text = await res.text();

    let data: EastMoneySearchResponse | null = null;
    try {
      data = JSON.parse(text) as EastMoneySearchResponse;
    } catch {
      const match = text.match(/\w+\((\{[\s\S]*\})\)/);
      if (match && match[1])
        data = JSON.parse(match[1]) as EastMoneySearchResponse;
    }

    if (!data?.Datas) return apiSuccess([]);

    const fundsOnly = data.Datas.filter(
      (d) =>
        d.CATEGORY === 700 || d.CATEGORY === "700" || d.CATEGORYDESC === "基金",
    );

    return apiSuccess(fundsOnly.map((d) => ({ code: d.CODE, name: d.NAME })));
  } catch (error) {
    console.error("[fund-search] Error:", error);
    return apiError(error, 502);
  }
}
