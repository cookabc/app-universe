import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, CloseIcon } from '../icons';

export default function AddFundSection({
  onAddFund,
  selectedFunds,
  onToggleSelectFund,
  searchTerm,
  onSearchInput,
  isSearching,
  showDropdown,
  setShowDropdown,
  searchResults,
  loading,
  error,
  existingFunds
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  return (
    <div className="glass card add-fund-section" role="region" aria-label="添加基金">
      <div className="title" style={{ marginBottom: 12 }}>
        <PlusIcon width="20" height="20" />
        <span>添加基金</span>
        <span className="muted">搜索并选择基金（支持名称或代码）</span>
      </div>
      
      <div className="search-container" ref={dropdownRef}>
        <form className="form" onSubmit={onAddFund}>
          <div className="search-input-wrapper" style={{ flex: 1, gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {selectedFunds.length > 0 && (
              <div className="selected-inline-chips">
                {selectedFunds.map(fund => (
                  <div key={fund.CODE} className="fund-chip">
                    <span>{fund.NAME}</span>
                    <button type="button" onClick={() => onToggleSelectFund(fund)} className="remove-chip">
                      <CloseIcon width="14" height="14" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              className="input"
              placeholder="搜索基金名称或代码..."
              value={searchTerm}
              onChange={onSearchInput}
              onFocus={() => setShowDropdown(true)}
            />
            {isSearching && <div className="search-spinner" />}
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? '添加中…' : '添加'}
          </button>
        </form>

        <AnimatePresence>
          {showDropdown && (searchTerm.trim() || searchResults.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="search-dropdown glass"
            >
              {searchResults.length > 0 ? (
                <div className="search-results">
                  {searchResults.map((fund) => {
                    const isSelected = selectedFunds.some(f => f.CODE === fund.CODE);
                    const isAlreadyAdded = existingFunds.some(f => f.code === fund.CODE);
                    return (
                      <div
                        key={fund.CODE}
                        className={`search-item ${isSelected ? 'selected' : ''} ${isAlreadyAdded ? 'added' : ''}`}
                        onClick={() => {
                          if (isAlreadyAdded) return;
                          onToggleSelectFund(fund);
                        }}
                      >
                        <div className="fund-info">
                          <span className="fund-name">{fund.NAME}</span>
                          <span className="fund-code muted">#{fund.CODE} | {fund.TYPE}</span>
                        </div>
                        {isAlreadyAdded ? (
                          <span className="added-label">已添加</span>
                        ) : (
                          <div className="checkbox">
                            {isSelected && <div className="checked-mark" />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : searchTerm.trim() && !isSearching ? (
                <div className="no-results muted">未找到相关基金</div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <div className="muted" style={{ marginTop: 8, color: 'var(--danger)' }}>{error}</div>}
    </div>
  );
}
