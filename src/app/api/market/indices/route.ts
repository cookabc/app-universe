import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `https://qt.gtimg.cn/q=s_sh000001,s_sz399001,s_sz399006&_t=${Date.now()}`,
      {
        headers: { Referer: "https://finance.qq.com" },
        next: { revalidate: 30 },
      },
    );
    const text = await res.text();

    const mapping = [
      { key: "v_s_sh000001", name: "上证" },
      { key: "v_s_sz399001", name: "深证" },
      { key: "v_s_sz399006", name: "创业板" },
    ];

    const indices = mapping.flatMap(({ key, name }) => {
      const match = text.match(new RegExp(`${key}="([^"]+)"`));
      if (!match || !match[1]) return [];
      const parts = match[1].split("~");
      if (parts.length <= 5) return [];
      return [
        { name, price: parts[3] ?? "", change: parseFloat(parts[5] ?? "0") },
      ];
    });

    return NextResponse.json(indices);
  } catch {
    return NextResponse.json([]);
  }
}
