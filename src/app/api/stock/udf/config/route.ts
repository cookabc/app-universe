import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    supports_search: true,
    supports_group_request: false,
    supports_marks: false,
    supports_timescale_marks: false,
    supports_time: true,
    exchanges: [
      { value: "NASDAQ", name: "NASDAQ", desc: "NASDAQ" },
      { value: "NYSE", name: "NYSE", desc: "NYSE" },
      { value: "BINANCE", name: "Binance", desc: "Binance" },
    ],
    symbols_types: [
      { name: "股票", value: "stock" },
      { name: "加密货币", value: "crypto" },
    ],
    supported_resolutions: [
      "1",
      "5",
      "15",
      "30",
      "60",
      "240",
      "1D",
      "1W",
      "1M",
    ],
  });
}
