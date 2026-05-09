import { type NextRequest, NextResponse } from "next/server";

// 模拟 symbol 数据库 - 后续从 SQLite 获取
const ALL_SYMBOLS = [
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ", type: "stock" },
  { symbol: "GOOGL", name: "Alphabet Inc.", exchange: "NASDAQ", type: "stock" },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    exchange: "NASDAQ",
    type: "stock",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    exchange: "NASDAQ",
    type: "stock",
  },
  { symbol: "TSLA", name: "Tesla Inc.", exchange: "NASDAQ", type: "stock" },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    type: "stock",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    exchange: "NASDAQ",
    type: "stock",
  },
  {
    symbol: "BTCUSDT",
    name: "Bitcoin/USDT",
    exchange: "BINANCE",
    type: "crypto",
  },
  {
    symbol: "ETHUSDT",
    name: "Ethereum/USDT",
    exchange: "BINANCE",
    type: "crypto",
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = (searchParams.get("query") || "").trim().slice(0, 64);
  const limit = Math.min(
    Math.max(parseInt(searchParams.get("limit") || "10", 10) || 10, 1),
    25,
  );
  const type = searchParams.get("type");
  const exchange = searchParams.get("exchange");

  let results = ALL_SYMBOLS;

  // 按查询过滤
  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (s) =>
        s.symbol.toLowerCase().includes(lowerQuery) ||
        s.name.toLowerCase().includes(lowerQuery),
    );
  }

  // 按类型过滤
  if (type && /^[a-z_-]{1,24}$/i.test(type)) {
    results = results.filter((s) => s.type === type);
  }

  // 按交易所过滤
  if (exchange && /^[A-Z0-9:_-]{1,24}$/i.test(exchange)) {
    results = results.filter((s) => s.exchange === exchange.toUpperCase());
  }

  // 限制数量
  results = results.slice(0, limit);

  // 转换为 UDF 格式
  const udfResults = results.map((s) => ({
    symbol: s.symbol,
    full_name: `${s.exchange}:${s.symbol}`,
    description: s.name,
    exchange: s.exchange,
    type: s.type,
    ticker: s.symbol,
  }));

  return NextResponse.json(udfResults);
}
