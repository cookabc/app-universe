#!/usr/bin/env python3
"""
初始化 Portfolio 树形结构
创建类似截图中的文件夹和股票结构
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import db, Inode, Dentry, DataStock
from app import app


def create_folder(name, parent_id=None, sort=0):
    """创建文件夹节点"""
    inode = Inode(type=Inode.TYPE_FOLDER)
    db.session.add(inode)
    db.session.flush()  # 获取 id
    
    dentry = Dentry(
        parent_id=parent_id,
        child_id=inode.id,
        name=name,
        sort=sort
    )
    db.session.add(dentry)
    db.session.flush()
    
    return inode.id


def create_stock(symbol, name, parent_id=None, sort=0):
    """创建股票节点"""
    # 检查 symbol 是否已存在
    existing = DataStock.query.filter_by(symbol=symbol).first()
    if existing:
        print(f"股票 {symbol} 已存在，跳过")
        return None
    
    inode = Inode(type=Inode.TYPE_STOCK)
    db.session.add(inode)
    db.session.flush()
    
    # 创建股票数据
    stock_data = DataStock(inode_id=inode.id, symbol=symbol)
    db.session.add(stock_data)
    
    # 创建 dentry
    dentry = Dentry(
        parent_id=parent_id,
        child_id=inode.id,
        name=name,
        sort=sort
    )
    db.session.add(dentry)
    db.session.flush()
    
    return inode.id


def init_portfolio():
    """初始化完整的 Portfolio 结构"""
    with app.app_context():
        db.create_all()
        
        # 检查是否已有数据
        root_count = Dentry.query.filter_by(parent_id=None).count()
        if root_count > 0:
            print("Portfolio 已有数据，是否清空后重建？(y/n)")
            # 这里直接继续，实际使用可以添加交互
        
        print("开始创建 Portfolio 结构...")
        
        # 创建根文件夹
        root_id = create_folder("📁 我的投资组合", parent_id=None, sort=0)
        print(f"✅ 创建根文件夹: 我的投资组合 (id={root_id})")
        
        # 1. ETF 文件夹
        etf_id = create_folder("📊 ETF", parent_id=root_id, sort=0)
        create_stock("SPY", "SPY - S&P 500 ETF", parent_id=etf_id, sort=0)
        create_stock("QQQ", "QQQ - NASDAQ-100 ETF", parent_id=etf_id, sort=1)
        create_stock("IWM", "IWM - Russell 2000 ETF", parent_id=etf_id, sort=2)
        print("✅ 创建 ETF 文件夹及股票")
        
        # 2. 数据中心（截图中的重点）
        dc_id = create_folder("🏢 数据中心", parent_id=root_id, sort=1)
        create_stock("IREN", "IREN - Iris Energy", parent_id=dc_id, sort=0)
        create_stock("CORZ", "CORZ - CoreWeave", parent_id=dc_id, sort=1)
        create_stock("WULF", "WULF - TeraWulf", parent_id=dc_id, sort=2)
        create_stock("BTBT", "BTBT - Bit Digital", parent_id=dc_id, sort=3)
        print("✅ 创建数据中心文件夹及股票")
        
        # 3. AI 产业链
        ai_id = create_folder("🤖 AI 产业链", parent_id=root_id, sort=2)
        create_stock("NVDA", "NVDA - NVIDIA", parent_id=ai_id, sort=0)
        create_stock("AMD", "AMD - AMD", parent_id=ai_id, sort=1)
        create_stock("TSLA", "TSLA - Tesla", parent_id=ai_id, sort=2)
        create_stock("PLTR", "PLTR - Palantir", parent_id=ai_id, sort=3)
        print("✅ 创建 AI 产业链文件夹及股票")
        
        # 4. 存储
        storage_id = create_folder("💾 存储", parent_id=root_id, sort=3)
        create_stock("STX", "STX - Seagate", parent_id=storage_id, sort=0)
        create_stock("WDC", "WDC - Western Digital", parent_id=storage_id, sort=1)
        print("✅ 创建存储文件夹及股票")
        
        # 5. 半导体设备
        semi_id = create_folder("🔧 半导体设备", parent_id=root_id, sort=4)
        create_stock("AMAT", "AMAT - Applied Materials", parent_id=semi_id, sort=0)
        create_stock("LRCX", "LRCX - Lam Research", parent_id=semi_id, sort=1)
        create_stock("KLAC", "KLAC - KLA Corp", parent_id=semi_id, sort=2)
        print("✅ 创建半导体设备文件夹及股票")
        
        # 6. 加密货币挖矿
        crypto_id = create_folder("⛏️ 加密货币挖矿", parent_id=root_id, sort=5)
        create_stock("MARA", "MARA - Marathon Digital", parent_id=crypto_id, sort=0)
        create_stock("RIOT", "RIOT - Riot Platforms", parent_id=crypto_id, sort=1)
        create_stock("CLSK", "CLSK - CleanSpark", parent_id=crypto_id, sort=2)
        print("✅ 创建加密货币挖矿文件夹及股票")
        
        # 7. 科技巨头
        tech_id = create_folder("🍎 科技巨头", parent_id=root_id, sort=6)
        create_stock("AAPL", "AAPL - Apple", parent_id=tech_id, sort=0)
        create_stock("MSFT", "MSFT - Microsoft", parent_id=tech_id, sort=1)
        create_stock("GOOGL", "GOOGL - Alphabet", parent_id=tech_id, sort=2)
        create_stock("AMZN", "AMZN - Amazon", parent_id=tech_id, sort=3)
        create_stock("META", "META - Meta", parent_id=tech_id, sort=4)
        print("✅ 创建科技巨头文件夹及股票")
        
        # 8. 加密货币
        crypto_folder_id = create_folder("₿ 加密货币", parent_id=root_id, sort=7)
        create_stock("BTCUSDT", "BTC - Bitcoin", parent_id=crypto_folder_id, sort=0)
        create_stock("ETHUSDT", "ETH - Ethereum", parent_id=crypto_folder_id, sort=1)
        create_stock("SOLUSDT", "SOL - Solana", parent_id=crypto_folder_id, sort=2)
        print("✅ 创建加密货币文件夹")
        
        db.session.commit()
        print("\n🎉 Portfolio 结构创建完成！")
        print("\n创建的结构：")
        print("📁 我的投资组合")
        print("  📊 ETF (SPY, QQQ, IWM)")
        print("  🏢 数据中心 (IREN, CORZ, WULF, BTBT)")
        print("  🤖 AI 产业链 (NVDA, AMD, TSLA, PLTR)")
        print("  💾 存储 (STX, WDC)")
        print("  🔧 半导体设备 (AMAT, LRCX, KLAC)")
        print("  ⛏️ 加密货币挖矿 (MARA, RIOT, CLSK)")
        print("  🍎 科技巨头 (AAPL, MSFT, GOOGL, AMZN, META)")
        print("  ₿ 加密货币 (BTCUSDT, ETHUSDT, SOLUSDT)")


if __name__ == '__main__':
    init_portfolio()
