import {
  apiSuccess,
  apiError,
  validateFundCode,
  safeParseFloat,
} from "@/lib/api-utils";
import { ValidationError } from "@/lib/error-handling";

function getTencentPrefix(code: string): string {
  if (code.startsWith("6") || code.startsWith("9")) return "sh";
  if (code.startsWith("0") || code.startsWith("3")) return "sz";
  if (code.startsWith("4") || code.startsWith("8")) return "bj";
  return "sz";
}

interface Holding {
  code: string;
  name: string;
  weight: string;
  change: number | null;
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
      `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=${code}&topline=10&year=&month=&rt=${Date.now()}`,
      { headers: { Referer: "https://fundf10.eastmoney.com" } },
    );
    const text = await res.text();

    // Match apidata = { content:"..." } - handles both JSON and JS object literal formats
    const apiMatch = text.match(/apidata\s*=\s*(\{[\s\S]*?\})\s*;?\s*$/m);
    if (!apiMatch) {
      console.log(`[fund-holdings] No apidata found for code ${code}`);
      return apiSuccess([]);
    }

    let content = "";
    try {
      // Try parsing as JSON first
      const apiData: { content?: string } = JSON.parse(apiMatch[1] ?? "{}");
      content = apiData?.content ?? "";
    } catch {
      // Fallback: extract content using regex for JS object literal format
      // Matches patterns like: { content:"<html>..." } or { content:'<html>...' }
      const contentMatch = apiMatch[1]?.match(/content\s*:\s*["']([\s\S]*?)["']/);
      if (contentMatch) {
        content = contentMatch[1] ?? "";
      } else {
        console.log(
          `[fund-holdings] Could not extract content for code ${code}`,
        );
        return apiSuccess([]);
      }
    }

    const html = content;

    const holdings: Holding[] = [];
    const rows = html.match(/<tr[\s\S]*?<\/tr>/gi) ?? [];

    for (const row of rows) {
      const cells = (row.match(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi) ?? []).map(
        (td: string) => td.replace(/<[^>]*>/g, "").trim(),
      );
      const codeIdx = cells.findIndex((txt) => /^\d{6}$/.test(txt));
      const weightIdx = cells.findIndex((txt) => /\d+(?:\.\d+)?\s*%/.test(txt));
      if (codeIdx >= 0 && weightIdx >= 0) {
        holdings.push({
          code: cells[codeIdx] ?? "",
          name: cells[codeIdx + 1] ?? "",
          weight: cells[weightIdx] ?? "",
          change: null,
        });
      }
    }

    const top10 = holdings.slice(0, 10);

    if (top10.length > 0) {
      const tencentCodes = top10
        .map((h) => `s_${getTencentPrefix(h.code)}${h.code}`)
        .join(",");
      try {
        const quoteRes = await fetch(`https://qt.gtimg.cn/q=${tencentCodes}`, {
          headers: { Referer: "https://finance.qq.com" },
        });
        const quoteText = await quoteRes.text();
        for (const h of top10) {
          const varName = `v_s_${getTencentPrefix(h.code)}${h.code}`;
          const match = quoteText.match(new RegExp(`${varName}="([^"]+)"`));
          if (match) {
            const parts = (match[1] ?? "").split("~");
            if (parts.length > 5) h.change = safeParseFloat(parts[5], 0);
          }
        }
      } catch {
        // Non-critical — proceed without change data
      }
    }

    return apiSuccess(top10);
  } catch (error) {
    console.error("[fund-holdings] Error:", error);
    return apiError(error, 502);
  }
}
