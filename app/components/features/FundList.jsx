import { motion, AnimatePresence } from 'framer-motion';
import { ExitIcon, StarIcon, TrashIcon, SettingsIcon, ChevronIcon } from '../icons';
import { Stat, Sparkline } from '../ui';
import HoldingsContribution from './HoldingsContribution';

export default function FundList({
  viewMode,
  funds,
  currentTab,
  favorites,
  onToggleFavorite,
  onRemoveFromGroup,
  onRemoveFund,
  todayStr,
  isTradingDay,
  navHistory,
  holdings,
  getHoldingProfit,
  onOpenHoldingModal,
  onOpenActionModal,
  percentModes,
  onTogglePercentMode,
  collapsedCodes,
  onToggleCollapse
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={viewMode === 'card' ? 'grid' : 'table-container glass'}
      >
        <div className={viewMode === 'card' ? 'grid col-12' : ''} style={viewMode === 'card' ? { gridColumn: 'span 12', gap: 16 } : {}}>
          <AnimatePresence mode="popLayout">
            {funds.map((f) => (
              <motion.div
                layout="position"
                key={f.code}
                className={viewMode === 'card' ? 'col-6' : 'table-row-wrapper'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
              <div className={viewMode === 'card' ? 'glass card' : 'table-row'}>
                {viewMode === 'list' ? (
                  <>
                    <div className="table-cell name-cell">
                      {currentTab !== 'all' && currentTab !== 'fav' ? (
                        <button
                          className="icon-button fav-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromGroup(f.code);
                          }}
                          title="从当前分组移除"
                        >
                          <ExitIcon width="18" height="18" style={{ transform: 'rotate(180deg)' }} />
                        </button>
                      ) : (
                        <button
                          className={`icon-button fav-button ${favorites.has(f.code) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(f.code);
                          }}
                          title={favorites.has(f.code) ? "取消自选" : "添加自选"}
                        >
                          <StarIcon width="18" height="18" filled={favorites.has(f.code)} />
                        </button>
                      )}
                      <div className="title-text">
                        <span className="name-text">{f.name}</span>
                        <span className="muted code-text">#{f.code}</span>
                      </div>
                    </div>
                    {(() => {
                      const now = new Date();
                      const isAfter9 = now.getHours() >= 9;
                      const hasTodayData = f.jzrq === todayStr;
                      const shouldHideChange = isTradingDay && isAfter9 && !hasTodayData;
                      
                      if (!shouldHideChange) {
                        // 如果涨跌幅列显示（即非交易时段或今日净值已更新），则显示单位净值和真实涨跌幅
                        return (
                          <>
                            <div className="table-cell text-right value-cell">
                              <span style={{ fontWeight: 700 }}>{f.dwjz ?? '—'}</span>
                            </div>
                            <div className="table-cell text-right change-cell">
                              <span className={f.zzl > 0 ? 'up' : f.zzl < 0 ? 'down' : ''} style={{ fontWeight: 700 }}>
                                {f.zzl !== undefined ? `${f.zzl > 0 ? '+' : ''}${Number(f.zzl).toFixed(2)}%` : '--'}
                              </span>
                            </div>
                          </>
                        );
                      } else {
                        // 否则显示估值净值和估值涨跌幅
                        return (
                          <>
                            <div className="table-cell text-right value-cell">
                              <span style={{ fontWeight: 700 }}>{f.estPricedCoverage > 0.05 ? f.estGsz.toFixed(4) : (f.gsz ?? '—')}</span>
                            </div>
                            <div className="table-cell text-right change-cell">
                              <span className={f.estPricedCoverage > 0.05 ? (f.estGszzl > 0 ? 'up' : f.estGszzl < 0 ? 'down' : '') : (Number(f.gszzl) > 0 ? 'up' : Number(f.gszzl) < 0 ? 'down' : '')} style={{ fontWeight: 700 }}>
                                {f.estPricedCoverage > 0.05 ? `${f.estGszzl > 0 ? '+' : ''}${f.estGszzl.toFixed(2)}%` : (typeof f.gszzl === 'number' ? `${f.gszzl > 0 ? '+' : ''}${f.gszzl.toFixed(2)}%` : f.gszzl ?? '—')}
                              </span>
                            </div>
                          </>
                        );
                      }
                    })()}
                    <div className="table-cell text-right time-cell">
                      <span className="muted" style={{ fontSize: '12px' }}>{f.gztime || f.time || '-'}</span>
                    </div>
                    <div className="table-cell text-center action-cell" style={{ gap: 4 }}>
                      <button
                        className="icon-button danger"
                        onClick={() => onRemoveFund(f.code)}
                        title="删除"
                        style={{ width: '28px', height: '28px' }}
                      >
                        <TrashIcon width="14" height="14" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                  <div className="row" style={{ marginBottom: 10 }}>
                    <div className="title">
                      {currentTab !== 'all' && currentTab !== 'fav' ? (
                        <button
                          className="icon-button fav-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromGroup(f.code);
                          }}
                          title="从当前分组移除"
                        >
                          <ExitIcon width="18" height="18" style={{ transform: 'rotate(180deg)' }} />
                        </button>
                      ) : (
                        <button
                          className={`icon-button fav-button ${favorites.has(f.code) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(f.code);
                          }}
                          title={favorites.has(f.code) ? "取消自选" : "添加自选"}
                        >
                          <StarIcon width="18" height="18" filled={favorites.has(f.code)} />
                        </button>
                      )}
                      <div className="title-text">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {f.name}
                          {f.jzrq === todayStr && (
                            <span 
                              title="今日净值已更新" 
                              style={{ 
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 16, 
                                height: 16, 
                                borderRadius: '50%', 
                                background: 'rgba(34, 197, 94, 0.2)', 
                                color: '#22c55e',
                                fontSize: '10px'
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </span>
                        <span className="muted">#{f.code}</span>
                      </div>
                    </div>

                    <div className="actions">
                      <div className="badge-v">
                        <span>估值时间</span>
                        <strong>{f.gztime || f.time || '-'}</strong>
                      </div>
                      <div className="row" style={{ gap: 4 }}>
                        <button
                          className="icon-button danger"
                          onClick={() => onRemoveFund(f.code)}
                          title="删除"
                          style={{ width: '28px', height: '28px' }}
                        >
                          <TrashIcon width="14" height="14" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="row" style={{ marginBottom: 12 }}>
                    <Stat label="单位净值" value={f.dwjz ?? '—'} />
                    {(() => {
                      const now = new Date();
                      const isAfter9 = now.getHours() >= 9;
                      const hasTodayData = f.jzrq === todayStr;
                      const shouldHideChange = isTradingDay && isAfter9 && !hasTodayData;
                      
                      if (shouldHideChange) return null;
                      
                      return (
                        <Stat 
                          label="涨跌幅" 
                          value={f.zzl !== undefined ? `${f.zzl > 0 ? '+' : ''}${Number(f.zzl).toFixed(2)}%` : '--'} 
                          delta={f.zzl} 
                        />
                      );
                    })()}
                    <Stat label="估值净值" value={f.estPricedCoverage > 0.05 ? f.estGsz.toFixed(4) : (f.gsz ?? '—')} />
                    <Stat
                      label="估值涨跌幅"
                      value={f.estPricedCoverage > 0.05 ? `${f.estGszzl > 0 ? '+' : ''}${f.estGszzl.toFixed(2)}%` : (typeof f.gszzl === 'number' ? `${f.gszzl > 0 ? '+' : ''}${f.gszzl.toFixed(2)}%` : f.gszzl ?? '—')}
                      delta={f.estPricedCoverage > 0.05 ? f.estGszzl : (Number(f.gszzl) || 0)}
                    />
                  </div>

                  {navHistory[f.code] && (
                    <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="muted" style={{ fontSize: '11px', flexShrink: 0 }}>30日走势</span>
                      <Sparkline data={navHistory[f.code]} width={140} height={24} />
                    </div>
                  )}
                  
                  <div className="row" style={{ marginBottom: 12 }}>
                    {(() => {
                      const holding = holdings[f.code];
                      const profit = getHoldingProfit(f, holding);
                      
                      if (!profit) {
                        return (
                          <div className="stat" style={{ flexDirection: 'column', gap: 4 }}>
                            <span className="label">持仓金额</span>
                            <div 
                              className="value muted" 
                              style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                              onClick={() => onOpenHoldingModal(f)}
                            >
                              未设置 <SettingsIcon width="12" height="12" />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <>
                          <div 
                            className="stat" 
                            style={{ cursor: 'pointer', flexDirection: 'column', gap: 4 }}
                            onClick={() => onOpenActionModal(f)}
                          >
                            <span className="label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              持仓金额 <SettingsIcon width="12" height="12" style={{ opacity: 0.7 }} />
                            </span>
                            <span className="value">¥{profit.amount.toFixed(2)}</span>
                          </div>
                          <div className="stat" style={{ flexDirection: 'column', gap: 4 }}>
                            <span className="label">当日盈亏</span>
                            <span className={`value ${profit.profitToday > 0 ? 'up' : profit.profitToday < 0 ? 'down' : ''}`}>
                              {profit.profitToday > 0 ? '+' : profit.profitToday < 0 ? '-' : ''}¥{Math.abs(profit.profitToday).toFixed(2)}
                            </span>
                          </div>
                          {profit.profitTotal !== null && (
                            <div 
                              className="stat"
                              onClick={(e) => {
                                e.stopPropagation();
                                onTogglePercentMode(f.code);
                              }}
                              style={{ cursor: 'pointer', flexDirection: 'column', gap: 4 }}
                              title="点击切换金额/百分比"
                            >
                              <span className="label">持有收益{percentModes[f.code] ? '(%)' : ''}</span>
                              <span className={`value ${profit.profitTotal > 0 ? 'up' : profit.profitTotal < 0 ? 'down' : ''}`}>
                                {profit.profitTotal > 0 ? '+' : profit.profitTotal < 0 ? '-' : ''}
                                {percentModes[f.code] 
                                  ? `${Math.abs((holding.cost * holding.share) ? (profit.profitTotal / (holding.cost * holding.share)) * 100 : 0).toFixed(2)}%`
                                  : `¥${Math.abs(profit.profitTotal).toFixed(2)}`
                                }
                              </span>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {f.estPricedCoverage > 0.05 && (
                    <div style={{ fontSize: '10px', color: 'var(--muted)', marginTop: -8, marginBottom: 10, textAlign: 'right' }}>
                      基于 {Math.round(f.estPricedCoverage * 100)}% 持仓估算
                    </div>
                  )}
                  <div
                    style={{ marginBottom: 8, cursor: 'pointer', userSelect: 'none' }}
                    className="title"
                    onClick={() => onToggleCollapse(f.code)}
                  >
                    <div className="row" style={{ width: '100%', flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span>前10重仓股票</span>
                        <ChevronIcon
                          width="16"
                          height="16"
                          className="muted"
                          style={{
                            transform: collapsedCodes.has(f.code) ? 'rotate(-90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}
                        />
                      </div>
                      <span className="muted">涨跌幅 / 占比</span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {!collapsedCodes.has(f.code) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        {Array.isArray(f.holdings) && f.holdings.length ? (
                          <div className="list">
                            {f.holdings.map((h, idx) => (
                              <div className="item" key={idx}>
                                <span className="name">{h.name}</span>
                                <div className="values">
                                  {typeof h.change === 'number' && (
                                    <span className={`badge ${h.change > 0 ? 'up' : h.change < 0 ? 'down' : ''}`} style={{ marginRight: 8 }}>
                                      {h.change > 0 ? '+' : ''}{h.change.toFixed(2)}%
                                    </span>
                                  )}
                                  <span className="weight">{h.weight}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="muted" style={{ padding: '8px 0' }}>暂无重仓数据</div>
                        )}
                        <HoldingsContribution holdings={f.holdings} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
