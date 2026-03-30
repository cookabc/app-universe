import { NextResponse } from "next/server";

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
  if (!code || !/^\d{6}$/.test(code)) {
    return NextResponse.json(
      { error: "Invalid or missing fund code" },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=${code}&topline=10&year=&month=&rt=${Date.now()}`,
      { headers: { Referer: "https://fundf10.eastmoney.com" } },
    );
    const text = await res.text();

    // East Money returns a JS assignment: apidata = {...}
    const apiMatch = text.match(/apidata\s*=\s*(\{[\s\S]*\})/);
    if (!apiMatch) return NextResponse.json([]);

    const apiData: { content?: string } = JSON.parse(apiMatch[1] ?? "{}");
    const html = apiData?.content ?? "";

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

    // Enrich with today's change % from Tencent quotes
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
            if (parts.length > 5) h.change = parseFloat(parts[5] ?? "0");
          }
        }
      } catch {
        // Non-critical — proceed without change data
      }
    }

    return NextResponse.json(top10);
  } catch {
    return NextResponse.json({ error: "Upstream error" }, { status: 502 });
  }
}
