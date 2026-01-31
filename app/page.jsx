'use client';

import { useEffect, useRef, useState } from 'react';

function PlusIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 6l1-2h6l1 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 6l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 15a7.97 7.97 0 0 0 .1-2l2-1.5-2-3.5-2.3.5a8.02 8.02 0 0 0-1.7-1l-.4-2.3h-4l-.4 2.3a8.02 8.02 0 0 0-1.7 1l-2.3-.5-2 3.5 2 1.5a7.97 7.97 0 0 0 .1 2l-2 1.5 2 3.5 2.3-.5a8.02 8.02 0 0 0 1.7 1l.4 2.3h4l.4-2.3a8.02 8.02 0 0 0 1.7-1l2.3.5 2-3.5-2-1.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RefreshIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 0 1 12.5-6.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 5h3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12a8 8 0 0 1-12.5 6.9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 19H5v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stat({ label, value, delta }) {
  const dir = delta > 0 ? 'up' : delta < 0 ? 'down' : '';
  return (
    <div className="stat">
      <span className="label">{label}</span>
      <span className={`value ${dir}`}>{value}</span>
      {typeof delta === 'number' && (
        <span className={`badge ${dir}`}>
          {delta > 0 ? '↗' : delta < 0 ? '↘' : '—'} {Math.abs(delta).toFixed(2)}%
        </span>
      )}
    </div>
  );
}

export default function HomePage() {
  const [funds, setFunds] = useState([]);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef(null);
  const [refreshMs, setRefreshMs] = useState(30000);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempSeconds, setTempSeconds] = useState(30);
  const [manualRefreshing, setManualRefreshing] = useState(false);
  const [useJsonp, setUseJsonp] = useState(false);
  const [apiBase, setApiBase] = useState('/api');
  const [tempApiBase, setTempApiBase] = useState('/api');

  const buildUrl = (path) => {
    const base = (apiBase || '/api').replace(/\/$/, '');
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${base}${p}`;
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('funds') || '[]');
      if (Array.isArray(saved) && saved.length) {
        setFunds(saved);
        refreshAll(saved.map((f) => f.code));
      }
      const savedMs = parseInt(localStorage.getItem('refreshMs') || '30000', 10);
      if (Number.isFinite(savedMs) && savedMs > 0) {
        setRefreshMs(savedMs);
        setTempSeconds(Math.round(savedMs / 1000));
      }
      const savedApi = localStorage.getItem('apiBase');
      if (savedApi && typeof savedApi === 'string') {
        setApiBase(savedApi);
        setTempApiBase(savedApi);
      }
      const savedJsonp = localStorage.getItem('useJsonp');
      if (savedJsonp === 'true') setUseJsonp(true);
    } catch {}
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const codes = funds.map((f) => f.code);
      if (codes.length) refreshAll(codes);
    }, refreshMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [funds, refreshMs]);

  const loadScript = (src, timeoutMs = 8000) => {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      let done = false;
      const clear = () => {
        if (s.parentNode) s.parentNode.removeChild(s);
      };
      const timer = setTimeout(() => {
        if (done) return;
        done = true;
        clear();
        reject(new Error('JSONP 加载超时'));
      }, timeoutMs);
      s.onload = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        clear();
        resolve();
      };
      s.onerror = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        clear();
        reject(new Error('JSONP 加载失败'));
      };
      document.head.appendChild(s);
    });
  };

  const getFundGZByJsonp = async (c) => {
    return new Promise(async (resolve, reject) => {
      const prev = window.jsonpgz;
      try {
        window.jsonpgz = (json) => {
          try {
            const gszzlNum = Number(json.gszzl);
            const data = {
              code: json.fundcode,
              name: json.name,
              dwjz: json.dwjz,
              gsz: json.gsz,
              gztime: json.gztime,
              gszzl: Number.isFinite(gszzlNum) ? gszzlNum : json.gszzl
            };
            resolve(data);
          } catch (e) {
            reject(e);
          } finally {
            window.jsonpgz = prev;
          }
        };
        await loadScript(`https://fundgz.1234567.com.cn/js/${encodeURIComponent(c)}.js`);
        // 如果脚本未触发回调
        setTimeout(() => {
          reject(new Error('估值 JSONP 未返回'));
          window.jsonpgz = prev;
        }, 0);
      } catch (e) {
        window.jsonpgz = prev;
        reject(e);
      }
    });
  };

  const stripHtml = (s) => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const parseHoldingsHtml = (html) => {
    const list = [];
    const tableMatch = html.match(/<table[\s\S]*?<\/table>/i);
    const table = tableMatch ? tableMatch[0] : html;
    const rows = table.match(/<tr[\s\S]*?<\/tr>/gi) || [];
    for (const r of rows) {
      const cells = [...r.matchAll(/<td[\s\S]*?>([\s\S]*?)<\/td>/gi)].map((m) => stripHtml(m[1]));
      if (!cells.length) continue;
      const codeIdx = cells.findIndex((c) => /^\d{6}$/.test(c));
      const weightIdx = cells.findIndex((c) => /\d+(?:\.\d+)?\s*%/.test(c));
      const code = codeIdx >= 0 ? cells[codeIdx] : null;
      const name = codeIdx >= 0 && codeIdx + 1 < cells.length ? cells[codeIdx + 1] : null;
      const weight = weightIdx >= 0 ? cells[weightIdx].replace(/\s+/g, '') : null;
      if (code && (name || name === '') && weight) {
        list.push({ code, name, weight });
      } else {
        const anchorNameMatch = r.match(/<a[^>]*?>([^<]+)<\/a>/i);
        const altName = anchorNameMatch ? stripHtml(anchorNameMatch[1]) : null;
        const codeMatch = r.match(/(\d{6})/);
        const weightMatch = r.match(/(\d+(?:\.\d+)?)\s*%/);
        const fallbackCode = codeMatch ? codeMatch[1] : null;
        const fallbackWeight = weightMatch ? `${weightMatch[1]}%` : null;
        if ((code || fallbackCode) && (name || altName) && (weight || fallbackWeight)) {
          list.push({ code: code || fallbackCode, name: name || altName, weight: weight || fallbackWeight });
        }
      }
    }
    return list.slice(0, 10);
  };

  const getHoldingsByJsonp = async (c) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Eastmoney 返回形如 var apidata={content:'<table>...</table>'}
        // 先清理可能残留的变量
        delete window.apidata;
        await loadScript(`https://fundf10.eastmoney.com/FundArchivesDatas.aspx?type=jjcc&code=${encodeURIComponent(c)}&topline=10&year=&month=&rt=${Date.now()}`);
        const content = window.apidata?.content || '';
        const m = content.match(/<table[\s\S]*<\/table>/i) || content.match(/content:\s*'([\s\S]*?)'/i);
        const html = m ? (m[0].startsWith('<table') ? m[0] : m[1]) : content;
        const list = parseHoldingsHtml(html || '');
        resolve(list);
      } catch (e) {
        // 兜底：无法解析时返回空数组
        resolve([]);
      }
    });
  };

  const fetchFundData = async (c) => {
    if (useJsonp) {
      const gz = await getFundGZByJsonp(c);
      const holdings = await getHoldingsByJsonp(c);
      return { ...gz, holdings };
    }
    const res = await fetch(buildUrl(`/fund?code=${encodeURIComponent(c)}`), { cache: 'no-store' });
    if (!res.ok) throw new Error('网络错误');
    return await res.json();
  };

  const refreshAll = async (codes) => {
    try {
      const updated = await Promise.all(
        codes.map((c) => fetchFundData(c))
      );
      setFunds(updated);
      localStorage.setItem('funds', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const addFund = async (e) => {
    e.preventDefault();
    setError('');
    const clean = code.trim();
    if (!clean) {
      setError('请输入基金编号');
      return;
    }
    if (funds.some((f) => f.code === clean)) {
      setError('该基金已添加');
      return;
    }
    setLoading(true);
    try {
      const data = await fetchFundData(clean);
      const next = [data, ...funds];
      setFunds(next);
      localStorage.setItem('funds', JSON.stringify(next));
      setCode('');
    } catch (e) {
      setError(e.message || '添加失败');
    } finally {
      setLoading(false);
    }
  };

  const removeFund = (removeCode) => {
    const next = funds.filter((f) => f.code !== removeCode);
    setFunds(next);
    localStorage.setItem('funds', JSON.stringify(next));
  };

  const manualRefresh = async () => {
    if (manualRefreshing) return;
    const codes = funds.map((f) => f.code);
    if (!codes.length) return;
    setManualRefreshing(true);
    try {
      await refreshAll(codes);
    } finally {
      setManualRefreshing(false);
    }
  };

  const saveSettings = (e) => {
    e?.preventDefault?.();
    const ms = Math.max(5, Number(tempSeconds)) * 1000;
    setRefreshMs(ms);
    localStorage.setItem('refreshMs', String(ms));
    const nextApi = (tempApiBase || '/api').trim();
    setApiBase(nextApi);
    localStorage.setItem('apiBase', nextApi);
    localStorage.setItem('useJsonp', useJsonp ? 'true' : 'false');
    setSettingsOpen(false);
  };

  useEffect(() => {
    const onKey = (ev) => {
      if (ev.key === 'Escape' && settingsOpen) setSettingsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [settingsOpen]);

  return (
    <div className="container content">
      <div className="navbar glass">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="2" />
            <path d="M5 14c2-4 7-6 14-5" stroke="var(--primary)" strokeWidth="2" />
          </svg>
          <span>实时基金估值</span>
        </div>
        <div className="actions">
          <div className="badge" title="当前刷新频率">
            <span>刷新</span>
            <strong>{Math.round(refreshMs / 1000)}秒</strong>
          </div>
          <button
            className="icon-button"
            aria-label="立即刷新"
            onClick={manualRefresh}
            disabled={manualRefreshing || funds.length === 0}
            aria-busy={manualRefreshing}
            title="立即刷新"
          >
            <RefreshIcon className={manualRefreshing ? 'spin' : ''} width="18" height="18" />
          </button>
          <button
            className="icon-button"
            aria-label="打开设置"
            onClick={() => setSettingsOpen(true)}
            title="设置"
          >
            <SettingsIcon width="18" height="18" />
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="col-12 glass card" role="region" aria-label="添加基金">
          <div className="title" style={{ marginBottom: 12 }}>
            <PlusIcon width="20" height="20" />
            <span>添加基金</span>
            <span className="muted">输入基金编号（例如：110022）</span>
          </div>
          <form className="form" onSubmit={addFund}>
            <label htmlFor="fund-code" className="muted" style={{ position: 'absolute', left: -9999 }}>
              基金编号
            </label>
            <input
              id="fund-code"
              className="input"
              placeholder="基金编号"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              aria-invalid={!!error}
            />
            <button className="button" type="submit" disabled={loading} aria-busy={loading}>
              {loading ? '添加中…' : '添加'}
            </button>
          </form>
          {error && <div className="muted" role="alert" style={{ marginTop: 8, color: 'var(--danger)' }}>{error}</div>}
        </div>

        <div className="col-12">
          {funds.length === 0 ? (
            <div className="glass card empty">尚未添加基金</div>
          ) : (
            <div className="grid">
              {funds.map((f) => (
                <div key={f.code} className="col-6">
                  <div className="glass card" role="article" aria-label={`${f.name} 基金信息`}>
                    <div className="row" style={{ marginBottom: 10 }}>
                      <div className="title">
                        <span>{f.name}</span>
                        <span className="muted">#{f.code}</span>
                      </div>
                      <div className="actions">
                        <div className="badge">
                          <span>估值时间</span>
                          <strong>{f.gztime || f.time || '-'}</strong>
                        </div>
                        <button
                          className="icon-button danger"
                          aria-label={`删除基金 ${f.code}`}
                          onClick={() => removeFund(f.code)}
                          title="删除"
                        >
                          <TrashIcon width="18" height="18" />
                        </button>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: 12 }}>
                      <Stat label="单位净值" value={f.dwjz ?? '—'} />
                      <Stat label="估值净值" value={f.gsz ?? '—'} />
                      <Stat label="涨跌幅" value={typeof f.gszzl === 'number' ? `${f.gszzl.toFixed(2)}%` : f.gszzl ?? '—'} delta={Number(f.gszzl) || 0} />
                    </div>
                    <div style={{ marginBottom: 8 }} className="title">
                      <span>前10重仓股票</span>
                      <span className="muted">持仓占比</span>
                    </div>
                    {Array.isArray(f.holdings) && f.holdings.length ? (
                      <div className="list" role="list">
                        {f.holdings.map((h, idx) => (
                          <div className="item" role="listitem" key={idx}>
                            <span className="name">
                              {h.name ? h.name : h.code}
                              {h.code ? ` (${h.code})` : ''}
                            </span>
                            <span className="weight">{h.weight}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="muted">暂无重仓数据</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="footer">数据源：基金估值与重仓来自东方财富公开接口，可能存在延迟</div>
      {settingsOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="设置" onClick={() => setSettingsOpen(false)}>
          <div className="glass card modal" onClick={(e) => e.stopPropagation()}>
            <div className="title" style={{ marginBottom: 12 }}>
              <SettingsIcon width="20" height="20" />
              <span>设置</span>
              <span className="muted">数据源与刷新频率</span>
            </div>
            <div className="title" style={{ marginBottom: 8 }}>
              <span>数据源</span>
              <span className="muted">跨域环境推荐 JSONP 直连</span>
            </div>
            <div className="chips" style={{ marginBottom: 12 }}>
              {[
                { key: 'api', label: '后端 API（推荐）', active: !useJsonp },
                { key: 'jsonp', label: 'JSONP 直连', active: useJsonp }
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  className={`chip ${opt.active ? 'active' : ''}`}
                  onClick={() => setUseJsonp(opt.key === 'jsonp')}
                  aria-pressed={opt.active}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {!useJsonp && (
              <div className="form" style={{ marginBottom: 12 }}>
                <label htmlFor="api-base" className="muted" style={{ position: 'absolute', left: -9999 }}>
                  API 基础地址
                </label>
                <input
                  id="api-base"
                  className="input"
                  type="text"
                  value={tempApiBase}
                  onChange={(e) => setTempApiBase(e.target.value)}
                  placeholder="/api 或 https://你的域名/api"
                />
              </div>
            )}
            <div className="chips" style={{ marginBottom: 12 }}>
              {[10, 30, 60, 120, 300].map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip ${tempSeconds === s ? 'active' : ''}`}
                  onClick={() => setTempSeconds(s)}
                  aria-pressed={tempSeconds === s}
                >
                  {s} 秒
                </button>
              ))}
            </div>
            <form onSubmit={saveSettings}>
              <div className="form" style={{ marginBottom: 12 }}>
                <label htmlFor="refresh-seconds" className="muted" style={{ position: 'absolute', left: -9999 }}>
                  自定义刷新秒数
                </label>
                <input
                  id="refresh-seconds"
                  className="input"
                  type="number"
                  min="5"
                  step="5"
                  value={tempSeconds}
                  onChange={(e) => setTempSeconds(Number(e.target.value))}
                  placeholder="秒数（≥5）"
                />
                <button className="button" type="submit">保存</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
