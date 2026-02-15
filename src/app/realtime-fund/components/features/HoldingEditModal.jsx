import { useState } from 'react';
import { motion } from 'framer-motion';
import { SettingsIcon, CloseIcon } from '../icons';

export default function HoldingEditModal({ fund, holding, onClose, onSave }) {
  const [share, setShare] = useState(holding?.share || '');
  const [cost, setCost] = useState(holding?.cost || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!share || !cost) return; // 简单校验
    onSave({
      share: Number(share),
      cost: Number(cost)
    });
    onClose();
  };

  const isValid = share && cost && !isNaN(share) && !isNaN(cost);

  return (
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="编辑持仓"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass card modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '400px' }}
      >
        <div className="title" style={{ marginBottom: 20, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <SettingsIcon width="20" height="20" />
            <span>设置持仓</span>
          </div>
          <button className="icon-button" onClick={onClose} style={{ border: 'none', background: 'transparent' }}>
            <CloseIcon width="20" height="20" />
          </button>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <div className="fund-name" style={{ fontWeight: 600, fontSize: '16px', marginBottom: 4 }}>{fund?.name}</div>
          <div className="muted" style={{ fontSize: '12px' }}>#{fund?.code}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="muted" style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}>
              持有份额 <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="number"
              step="any"
              className={`input ${!share ? 'error' : ''}`}
              value={share}
              onChange={(e) => setShare(e.target.value)}
              placeholder="请输入持有份额"
              style={{ 
                width: '100%',
                border: !share ? '1px solid var(--danger)' : undefined
              }}
              autoFocus
            />
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="muted" style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}>
              持仓成本价 <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <input
              type="number"
              step="any"
              className={`input ${!cost ? 'error' : ''}`}
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="请输入持仓成本价"
              style={{ 
                width: '100%',
                border: !cost ? '1px solid var(--danger)' : undefined
              }}
            />
          </div>

          <div className="row" style={{ gap: 12 }}>
            <button type="button" className="button secondary" onClick={onClose} style={{ flex: 1, background: 'rgba(0,0,0,0.04)', color: 'var(--text)' }}>取消</button>
            <button 
              type="submit" 
              className="button" 
              disabled={!isValid}
              style={{ flex: 1, opacity: isValid ? 1 : 0.6 }}
            >
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
