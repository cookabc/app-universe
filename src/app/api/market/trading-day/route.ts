import { apiSuccess, apiError } from "@/lib/api-utils";

export async function GET() {
  const now = new Date();
  const isWeekend = now.getDay() === 0 || now.getDay() === 6;

  if (isWeekend) {
    return apiSuccess({ isTradingDay: false });
  }

  try {
    const res = await fetch(`https://qt.gtimg.cn/q=sh000001&_t=${Date.now()}`, {
      headers: { Referer: "https://finance.qq.com" },
      next: { revalidate: 60 },
    });
    const text = await res.text();
    const match = text.match(/v_sh000001="([^"]+)"/);
    if (match && match[1]) {
      const parts = match[1].split("~");
      const dateStr = parts[30]?.slice(0, 8) ?? "";
      const todayStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
      const isTradingDay = dateStr === todayStr;
      return apiSuccess({ isTradingDay });
    }
  } catch (error) {
    console.error("[trading-day] Error:", error);
  }

  return apiSuccess({ isTradingDay: !isWeekend });
}
