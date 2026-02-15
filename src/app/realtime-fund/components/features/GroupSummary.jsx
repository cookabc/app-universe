import { useState, useMemo, useLayoutEffect, useRef, useEffect } from 'react';
import { CountUp } from '../ui';

export default function GroupSummary({ funds, holdings, groupName, getProfit }) {
  const [showPercent, setShowPercent] = useState(true);
  const rowRef = useRef(null);
  const [assetSize, setAssetSize] = useState(24);
  const [metricSize, setMetricSize] = useState(18);
  const [winW, setWinW] = useState(0);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWinW(window.innerWidth);
      const onR = () => setWinW(window.innerWidth);
      window.addEventListener('resize', onR);
      return () => window.removeEventListener('resize', onR);
    }
  }, []);

  const summary = useMemo(() => {
    let totalAsset = 0;
    let totalProfitToday = 0;
    let totalHoldingReturn = 0;
    let totalCost = 0;
    let hasHolding = false;

    funds.forEach(fund => {
      const holding = holdings[fund.code];
      const profit = getProfit(fund, holding);
      
      if (profit) {
        hasHolding = true;
        totalAsset += profit.amount;
        totalProfitToday += profit.profitToday;
        if (profit.profitTotal !== null) {
          totalHoldingReturn += profit.profitTotal;
          if (holding && typeof holding.cost === 'number' && typeof holding.share === 'number') {
            totalCost += holding.cost * holding.share;
          }
        }
      }
    });

    const returnRate = totalCost > 0 ? (totalHoldingReturn / totalCost) * 100 : 0;

    return { totalAsset, totalProfitToday, totalHoldingReturn, hasHolding, returnRate };
  }, [funds, holdings, getProfit]);

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const height = el.clientHeight;
    // 使用 80px 作为更严格的阈值，因为 margin/padding 可能导致实际占用更高
    const tooTall = height > 80;
    if (tooTall) {
      setAssetSize(s => Math.max(16, s - 1));
      setMetricSize(s => Math.max(12, s - 1));
    } else {
      // 如果高度正常，尝试适当恢复字体大小，但不要超过初始值
    }
  }, [winW, summary.totalAsset, summary.totalProfitToday, summary.totalHoldingReturn, summary.returnRate, showPercent, assetSize, metricSize]); 

  if (!summary.hasHolding) return null;

  return (
    <div className="glass card" style={{ marginBottom: 16, padding: '16px 20px', background: 'rgba(0,0,0,0.03)' }}>
      <div ref={rowRef} className="row" style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="muted" style={{ fontSize: '12px', marginBottom: 4 }}>{groupName}</div>
          <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            <span style={{ fontSize: '16px', marginRight: 2 }}>¥</span>
            <CountUp value={summary.totalAsset} style={{ fontSize: assetSize }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <div className="muted" style={{ fontSize: '12px', marginBottom: 4 }}>当日收益</div>
            <div 
              className={summary.totalProfitToday > 0 ? 'up' : summary.totalProfitToday < 0 ? 'down' : ''} 
              style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)' }}
            >
              <span style={{ marginRight: 1 }}>{summary.totalProfitToday > 0 ? '+' : summary.totalProfitToday < 0 ? '-' : ''}</span>
              <CountUp value={Math.abs(summary.totalProfitToday)} style={{ fontSize: metricSize }} />
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="muted" style={{ fontSize: '12px', marginBottom: 4 }}>持有收益{showPercent ? '(%)' : ''}</div>
            <div 
              className={summary.totalHoldingReturn > 0 ? 'up' : summary.totalHoldingReturn < 0 ? 'down' : ''} 
              style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', cursor: 'pointer' }}
              onClick={() => setShowPercent(!showPercent)}
              title="点击切换金额/百分比"
            >
              <span style={{ marginRight: 1 }}>{summary.totalHoldingReturn > 0 ? '+' : summary.totalHoldingReturn < 0 ? '-' : ''}</span>
              {showPercent ? (
                <CountUp value={Math.abs(summary.returnRate)} suffix="%" style={{ fontSize: metricSize }} />
              ) : (
                <>
                  <CountUp value={Math.abs(summary.totalHoldingReturn)} style={{ fontSize: metricSize }} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
