#!/usr/bin/env python3
"""
从 Finnhub 导入美股代码到本地数据库
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import db, Symbol
from app import app
from const import SymbolType

# 常用美股列表
POPULAR_US_STOCKS = [
    # 科技巨头
    ('AAPL', 'AAPL', 'Apple Inc', 'Apple', 'NASDAQ', 'stocks-us'),
    ('GOOGL', 'GOOGL', 'Alphabet Inc', 'Google', 'NASDAQ', 'stocks-us'),
    ('GOOG', 'GOOG', 'Alphabet Inc', 'Google Class C', 'NASDAQ', 'stocks-us'),
    ('MSFT', 'MSFT', 'Microsoft Corporation', 'Microsoft', 'NASDAQ', 'stocks-us'),
    ('AMZN', 'AMZN', 'Amazon.com Inc', 'Amazon', 'NASDAQ', 'stocks-us'),
    ('META', 'META', 'Meta Platforms Inc', 'Meta', 'NASDAQ', 'stocks-us'),
    ('TSLA', 'TSLA', 'Tesla Inc', 'Tesla', 'NASDAQ', 'stocks-us'),
    ('NVDA', 'NVDA', 'NVIDIA Corporation', 'NVIDIA', 'NASDAQ', 'stocks-us'),
    ('NFLX', 'NFLX', 'Netflix Inc', 'Netflix', 'NASDAQ', 'stocks-us'),
    ('AMD', 'AMD', 'Advanced Micro Devices', 'AMD', 'NASDAQ', 'stocks-us'),
    ('INTC', 'INTC', 'Intel Corporation', 'Intel', 'NASDAQ', 'stocks-us'),
    ('CRM', 'CRM', 'Salesforce Inc', 'Salesforce', 'NYSE', 'stocks-us'),
    ('ADBE', 'ADBE', 'Adobe Inc', 'Adobe', 'NASDAQ', 'stocks-us'),
    ('ORCL', 'ORCL', 'Oracle Corporation', 'Oracle', 'NYSE', 'stocks-us'),
    ('IBM', 'IBM', 'IBM Corporation', 'IBM', 'NYSE', 'stocks-us'),
    
    # 金融
    ('JPM', 'JPM', 'JPMorgan Chase', 'JPMorgan', 'NYSE', 'stocks-us'),
    ('BAC', 'BAC', 'Bank of America', 'Bank of America', 'NYSE', 'stocks-us'),
    ('WFC', 'WFC', 'Wells Fargo', 'Wells Fargo', 'NYSE', 'stocks-us'),
    ('GS', 'GS', 'Goldman Sachs', 'Goldman Sachs', 'NYSE', 'stocks-us'),
    ('V', 'V', 'Visa Inc', 'Visa', 'NYSE', 'stocks-us'),
    ('MA', 'MA', 'Mastercard Inc', 'Mastercard', 'NYSE', 'stocks-us'),
    
    # 消费
    ('WMT', 'WMT', 'Walmart Inc', 'Walmart', 'NYSE', 'stocks-us'),
    ('COST', 'COST', 'Costco Wholesale', 'Costco', 'NASDAQ', 'stocks-us'),
    ('KO', 'KO', 'Coca-Cola Company', 'Coca-Cola', 'NYSE', 'stocks-us'),
    ('PEP', 'PEP', 'PepsiCo Inc', 'PepsiCo', 'NASDAQ', 'stocks-us'),
    ('MCD', 'MCD', "McDonald's Corporation", "McDonald's", 'NYSE', 'stocks-us'),
    ('SBUX', 'SBUX', 'Starbucks Corporation', 'Starbucks', 'NASDAQ', 'stocks-us'),
    ('NKE', 'NKE', 'Nike Inc', 'Nike', 'NYSE', 'stocks-us'),
    
    # 医药
    ('JNJ', 'JNJ', 'Johnson & Johnson', 'J&J', 'NYSE', 'stocks-us'),
    ('PFE', 'PFE', 'Pfizer Inc', 'Pfizer', 'NYSE', 'stocks-us'),
    ('UNH', 'UNH', 'UnitedHealth Group', 'UnitedHealth', 'NYSE', 'stocks-us'),
    ('ABBV', 'ABBV', 'AbbVie Inc', 'AbbVie', 'NYSE', 'stocks-us'),
    ('MRK', 'MRK', 'Merck & Co', 'Merck', 'NYSE', 'stocks-us'),
    
    # ETF
    ('SPY', 'SPY', 'SPDR S&P 500 ETF', 'S&P 500 ETF', 'NYSE', 'stocks-us'),
    ('QQQ', 'QQQ', 'Invesco QQQ ETF', 'NASDAQ-100 ETF', 'NASDAQ', 'stocks-us'),
    ('IWM', 'IWM', 'iShares Russell 2000 ETF', 'Russell 2000 ETF', 'NYSE', 'stocks-us'),
    ('VTI', 'VTI', 'Vanguard Total Stock Market ETF', 'Total Market ETF', 'NYSE', 'stocks-us'),
    ('VOO', 'VOO', 'Vanguard S&P 500 ETF', 'Vanguard S&P 500', 'NYSE', 'stocks-us'),
    
    # 其他
    ('DIS', 'DIS', 'Walt Disney Company', 'Disney', 'NYSE', 'stocks-us'),
    ('BA', 'BA', 'Boeing Company', 'Boeing', 'NYSE', 'stocks-us'),
    ('GE', 'GE', 'General Electric', 'GE', 'NYSE', 'stocks-us'),
    ('F', 'F', 'Ford Motor Company', 'Ford', 'NYSE', 'stocks-us'),
    ('GM', 'GM', 'General Motors', 'GM', 'NYSE', 'stocks-us'),
    ('UBER', 'UBER', 'Uber Technologies', 'Uber', 'NYSE', 'stocks-us'),
    ('LYFT', 'LYFT', 'Lyft Inc', 'Lyft', 'NASDAQ', 'stocks-us'),
    ('ABNB', 'ABNB', 'Airbnb Inc', 'Airbnb', 'NASDAQ', 'stocks-us'),
    ('COIN', 'COIN', 'Coinbase Global', 'Coinbase', 'NASDAQ', 'stocks-us'),
    
    # 加密货币 (Binance)
    ('BTCUSDT', 'BTC', 'Bitcoin', 'Bitcoin', 'BINANCE', 'crypto'),
    ('ETHUSDT', 'ETH', 'Ethereum', 'Ethereum', 'BINANCE', 'crypto'),
    ('SOLUSDT', 'SOL', 'Solana', 'Solana', 'BINANCE', 'crypto'),
    ('BNBUSDT', 'BNB', 'Binance Coin', 'BNB', 'BINANCE', 'crypto'),
    ('ADAUSDT', 'ADA', 'Cardano', 'Cardano', 'BINANCE', 'crypto'),
    ('DOGEUSDT', 'DOGE', 'Dogecoin', 'Dogecoin', 'BINANCE', 'crypto'),
    ('XRPUSDT', 'XRP', 'Ripple', 'XRP', 'BINANCE', 'crypto'),
    ('DOTUSDT', 'DOT', 'Polkadot', 'Polkadot', 'BINANCE', 'crypto'),
    ('AVAXUSDT', 'AVAX', 'Avalanche', 'Avalanche', 'BINANCE', 'crypto'),
    ('LINKUSDT', 'LINK', 'Chainlink', 'Chainlink', 'BINANCE', 'crypto'),
    ('MATICUSDT', 'MATIC', 'Polygon', 'Polygon', 'BINANCE', 'crypto'),
    ('LTCUSDT', 'LTC', 'Litecoin', 'Litecoin', 'BINANCE', 'crypto'),
    ('UNIUSDT', 'UNI', 'Uniswap', 'Uniswap', 'BINANCE', 'crypto'),
    ('ATOMUSDT', 'ATOM', 'Cosmos', 'Cosmos', 'BINANCE', 'crypto'),
    ('ETCUSDT', 'ETC', 'Ethereum Classic', 'Ethereum Classic', 'BINANCE', 'crypto'),
    
    # 数据中心 & 加密货币挖矿
    ('IREN', 'IREN', 'Iris Energy Limited', 'Iris Energy', 'NASDAQ', 'stocks-us'),
    ('CORZ', 'CORZ', 'CoreWeave Inc', 'CoreWeave', 'NASDAQ', 'stocks-us'),
    ('WULF', 'WULF', 'TeraWulf Inc', 'TeraWulf', 'NASDAQ', 'stocks-us'),
    ('BTBT', 'BTBT', 'Bit Digital Inc', 'Bit Digital', 'NASDAQ', 'stocks-us'),
    ('MARA', 'MARA', 'Marathon Digital Holdings', 'Marathon Digital', 'NASDAQ', 'stocks-us'),
    ('RIOT', 'RIOT', 'Riot Platforms Inc', 'Riot Platforms', 'NASDAQ', 'stocks-us'),
    ('CLSK', 'CLSK', 'CleanSpark Inc', 'CleanSpark', 'NASDAQ', 'stocks-us'),
    
    # AI & 科技
    ('PLTR', 'PLTR', 'Palantir Technologies Inc', 'Palantir', 'NYSE', 'stocks-us'),
    
    # 存储
    ('STX', 'STX', 'Seagate Technology Holdings', 'Seagate', 'NASDAQ', 'stocks-us'),
    ('WDC', 'WDC', 'Western Digital Corporation', 'Western Digital', 'NASDAQ', 'stocks-us'),
    
    # 半导体设备
    ('AMAT', 'AMAT', 'Applied Materials Inc', 'Applied Materials', 'NASDAQ', 'stocks-us'),
    ('LRCX', 'LRCX', 'Lam Research Corporation', 'Lam Research', 'NASDAQ', 'stocks-us'),
    ('KLAC', 'KLAC', 'KLA Corporation', 'KLA Corp', 'NASDAQ', 'stocks-us'),
    
    # ETF
    ('SPY', 'SPY', 'SPDR S&P 500 ETF Trust', 'S&P 500 ETF', 'NYSE', 'stocks-us'),
    ('QQQ', 'QQQ', 'Invesco QQQ Trust', 'NASDAQ-100 ETF', 'NASDAQ', 'stocks-us'),
    ('IWM', 'IWM', 'iShares Russell 2000 ETF', 'Russell 2000 ETF', 'NYSE', 'stocks-us'),
]


def import_symbols():
    with app.app_context():
        db.create_all()
        
        count = 0
        for symbol, ticker, full_name, description, exchange, symbol_type in POPULAR_US_STOCKS:
            existing = Symbol.query.filter_by(symbol=symbol).first()
            if existing:
                print(f"跳过已存在的: {symbol}")
                continue
            
            symbol_obj = Symbol(
                symbol=symbol,
                ticker=ticker,
                full_name=full_name,
                description=description,
                exchange=exchange,
                type=symbol_type,
                is_visible=True
            )
            db.session.add(symbol_obj)
            count += 1
            print(f"添加: {symbol} - {description}")
        
        db.session.commit()
        print(f"\n成功导入 {count} 个股票代码")


if __name__ == '__main__':
    import_symbols()
