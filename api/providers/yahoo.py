import logging
from typing import Dict, Any, Optional
from providers.base import HistoryDataProvider
from clients.yahoo import YahooFinanceClient
from const import Provider
import config

logger = logging.getLogger("app")


class YahooFinanceHistoryProvider(HistoryDataProvider):
    """Yahoo Finance 历史数据提供者"""
    
    RESOLUTION_MAPPING = {
        "1": "1m", "5": "5m", "15": "15m", "30": "30m",
        "60": "1h", "240": "1h", "1D": "1d", "1W": "1wk", "1M": "1mo"
    }
    
    # 分辨率对应的 period 参数（用于获取足够的数据）
    RESOLUTION_PERIOD = {
        "1": "5d",      # 1分钟数据最多获取5天
        "5": "1mo",     # 5分钟数据最多获取1个月
        "15": "1mo",    # 15分钟数据最多获取1个月
        "30": "1mo",    # 30分钟数据最多获取1个月
        "60": "3mo",    # 1小时数据最多获取3个月
        "240": "6mo",   # 4小时数据最多获取6个月
        "1D": "1y",     # 日线数据获取1年
        "1W": "5y",     # 周线数据获取5年
        "1M": "10y",    # 月线数据获取10年
    }

    def __init__(self, cfg=None):
        self.cfg = cfg
        self.client = YahooFinanceClient()

    def get_name(self) -> str:
        return Provider.YAHOO.value

    def is_available(self) -> bool:
        return config.DATA_PROVIDER.get('yahoo', {}).get('is_available', False)

    def supports_symbol(self, symbol: str, exchange: str = None) -> bool:
        # Yahoo Finance 支持美股，代码通常没有后缀或者是 .US
        if symbol.endswith('.US'):
            return True
        # 纯字母代码（如 AAPL, GOOG）认为是美股
        if symbol.isalpha() and len(symbol) <= 5:
            return True
        # 检查 exchange
        if exchange and exchange.upper() in ['NYSE', 'NASDAQ', 'AMEX', 'US']:
            return True
        return False

    def get_history_data(self, symbol: str, resolution: str,
                         from_time: int, to_time: int,
                         countback: int = 0, exchange: str = None, **kwargs) -> Optional[Dict[str, Any]]:
        if not self.is_available():
            return {"s": "error", "errmsg": "Yahoo Finance provider not available"}
        
        try:
            # 转换 symbol 格式（去掉 .US 后缀）
            yahoo_symbol = symbol.replace('.US', '')
            
            # 获取对应的分辨率和 period
            yahoo_interval = self.RESOLUTION_MAPPING.get(resolution)
            if not yahoo_interval:
                return {"s": "error", "errmsg": f"Unsupported resolution: {resolution}"}
            
            period = self.RESOLUTION_PERIOD.get(resolution, '1y')
            
            # 获取历史数据
            klines = self.client.get_history(
                symbol=yahoo_symbol,
                period=period,
                interval=yahoo_interval
            )
            
            if not klines:
                return {"t":[],"o":[],"h":[],"l":[],"c":[],"v":[],"s":"no_data"}
            
            # 过滤时间范围
            if from_time or to_time:
                filtered_klines = []
                for k in klines:
                    ts = k['timestamp']
                    if from_time and ts < from_time:
                        continue
                    if to_time and ts > to_time:
                        continue
                    filtered_klines.append(k)
                klines = filtered_klines
            
            if not klines:
                return {"t":[],"o":[],"h":[],"l":[],"c":[],"v":[],"s":"no_data"}
            
            return self._convert_to_udf_format(klines, from_time or 0, to_time or 0, countback)
            
        except Exception as e:
            logger.exception(e)
            return {"s": "error", "errmsg": f"Yahoo Finance error: {str(e)}"}
