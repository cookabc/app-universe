import yfinance as yf
import logging
import pandas as pd

logger = logging.getLogger("app")


class YahooFinanceClient:
    """Yahoo Finance 客户端"""

    def __init__(self):
        pass

    def get_ticker_info(self, symbol):
        """获取股票基本信息"""
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            return {
                'symbol': symbol,
                'name': info.get('shortName', info.get('longName', symbol)),
                'description': info.get('longBusinessSummary', ''),
                'exchange': info.get('exchange', ''),
                'type': 'stocks-us',
                'currency': info.get('currency', 'USD'),
            }
        except Exception as e:
            logger.exception(f"Error fetching ticker info for {symbol}: {e}")
            return None

    def get_history(self, symbol, period='1y', interval='1d'):
        """
        获取历史K线数据
        
        Args:
            symbol: 股票代码（如 AAPL, MSFT）
            period: 时间范围 (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
            interval: 时间间隔 (1m, 2m, 5m, 15m, 30m, 60m, 90m, 1h, 1d, 5d, 1wk, 1mo, 3mo)
        
        Returns:
            DataFrame with columns: Open, High, Low, Close, Volume
        """
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period, interval=interval)
            
            if hist.empty:
                logger.warning(f"No data returned for {symbol}")
                return None
            
            # 重置索引，将日期变为列
            hist = hist.reset_index()
            
            # 转换为标准格式
            result = []
            for _, row in hist.iterrows():
                result.append({
                    'timestamp': int(row['Date'].timestamp()),
                    'open_price': float(row['Open']),
                    'high_price': float(row['High']),
                    'low_price': float(row['Low']),
                    'close_price': float(row['Close']),
                    'volume': float(row['Volume']),
                })
            
            return result
        except Exception as e:
            logger.exception(f"Error fetching history for {symbol}: {e}")
            return None

    def search_symbols(self, query):
        """搜索股票代码"""
        try:
            # yfinance 没有直接搜索功能，这里返回空列表
            # 实际使用时可以通过其他方式实现搜索
            return []
        except Exception as e:
            logger.exception(e)
            return []
