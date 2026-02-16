import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CloseIcon } from '../icons'
import { DatePicker, NumericInput } from '../ui'

export default function TradeModal({ type, fund, onClose, onConfirm }) {
    const isBuy = type === 'buy'
    const [share, setShare] = useState('')
    const [amount, setAmount] = useState('')
    const [feeRate, setFeeRate] = useState('0')
    const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
    const [isAfter3pm, setIsAfter3pm] = useState(new Date().getHours() >= 15)
    const [calcShare, setCalcShare] = useState(null)
    const price =
        fund?.estPricedCoverage > 0.05 ? fund?.estGsz : typeof fund?.gsz === 'number' ? fund?.gsz : Number(fund?.dwjz)

    useEffect(() => {
        if (!isBuy) return
        const a = parseFloat(amount)
        const f = parseFloat(feeRate)
        const p = parseFloat(price)
        if (a > 0 && p > 0 && !isNaN(f)) {
            const netAmount = a / (1 + f / 100)
            const s = netAmount / p
            setCalcShare(s)
        } else {
            setCalcShare(null)
        }
    }, [isBuy, amount, feeRate, price])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isBuy) {
            if (!amount || !feeRate || !date || calcShare === null || !price) return
            onConfirm({ share: calcShare, price: Number(price), totalCost: Number(amount), date, isAfter3pm })
        } else {
            if (!share || !price) return
            onConfirm({ share: Number(share), price: Number(price) })
        }
    }

    const isValid = isBuy ? !!amount && !!feeRate && !!date && calcShare !== null : !!share && !!price

    return (
        <motion.div
            className="modal-overlay"
            role="dialog"
            aria-modal="true"
            aria-label={isBuy ? '加仓' : '减仓'}
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
                style={{ maxWidth: '420px' }}
            >
                <div className="title" style={{ marginBottom: 20, justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '20px' }}>{isBuy ? '📥' : '📤'}</span>
                        <span>{isBuy ? '加仓' : '减仓'}</span>
                    </div>
                    <button
                        className="icon-button"
                        onClick={onClose}
                        style={{ border: 'none', background: 'transparent' }}
                    >
                        <CloseIcon width="20" height="20" />
                    </button>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <div className="fund-name" style={{ fontWeight: 600, fontSize: '16px', marginBottom: 4 }}>
                        {fund?.name}
                    </div>
                    <div className="muted" style={{ fontSize: '12px' }}>
                        #{fund?.code}
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {isBuy ? (
                        <>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label
                                    className="muted"
                                    style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}
                                >
                                    加仓金额 (¥) <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <div
                                    style={{
                                        border: !amount ? '1px solid var(--danger)' : '1px solid var(--border)',
                                        borderRadius: 12,
                                    }}
                                >
                                    <NumericInput
                                        value={amount}
                                        onChange={setAmount}
                                        step={100}
                                        min={0}
                                        placeholder="请输入加仓金额"
                                    />
                                </div>
                            </div>

                            <div className="row" style={{ gap: 12, marginBottom: 16 }}>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label
                                        className="muted"
                                        style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}
                                    >
                                        买入费率 (%) <span style={{ color: 'var(--danger)' }}>*</span>
                                    </label>
                                    <div
                                        style={{
                                            border: !feeRate ? '1px solid var(--danger)' : '1px solid var(--border)',
                                            borderRadius: 12,
                                        }}
                                    >
                                        <NumericInput
                                            value={feeRate}
                                            onChange={setFeeRate}
                                            step={0.01}
                                            min={0}
                                            placeholder="0.12"
                                        />
                                    </div>
                                </div>
                                <div className="form-group" style={{ flex: 1 }}>
                                    <label
                                        className="muted"
                                        style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}
                                    >
                                        加仓日期 <span style={{ color: 'var(--danger)' }}>*</span>
                                    </label>
                                    <DatePicker value={date} onChange={setDate} />
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: 12 }}>
                                <label
                                    className="muted"
                                    style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}
                                >
                                    交易时段
                                </label>
                                <div
                                    className="row"
                                    style={{
                                        gap: 8,
                                        background: 'rgba(0,0,0,0.2)',
                                        borderRadius: '8px',
                                        padding: '4px',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setIsAfter3pm(false)}
                                        style={{
                                            flex: 1,
                                            border: 'none',
                                            background: !isAfter3pm ? 'var(--primary)' : 'transparent',
                                            color: !isAfter3pm ? '#ffffff' : 'var(--muted)',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            padding: '6px 8px',
                                        }}
                                    >
                                        15:00前
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsAfter3pm(true)}
                                        style={{
                                            flex: 1,
                                            border: 'none',
                                            background: isAfter3pm ? 'var(--primary)' : 'transparent',
                                            color: isAfter3pm ? '#ffffff' : 'var(--muted)',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            padding: '6px 8px',
                                        }}
                                    >
                                        15:00后
                                    </button>
                                </div>
                                <div className="muted" style={{ fontSize: '12px', marginTop: 6 }}>
                                    {isAfter3pm ? '将在下一个交易日确认份额' : '将在当日确认份额'}
                                </div>
                            </div>

                            {price && calcShare !== null && (
                                <div
                                    className="glass"
                                    style={{
                                        padding: '12px',
                                        borderRadius: '8px',
                                        background: 'rgba(255,136,0,0.05)',
                                        border: '1px solid rgba(255,136,0,0.2)',
                                        marginBottom: 8,
                                    }}
                                >
                                    <div className="row" style={{ justifyContent: 'space-between', marginBottom: 4 }}>
                                        <span className="muted" style={{ fontSize: '12px' }}>
                                            预计确认份额
                                        </span>
                                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                                            {calcShare.toFixed(2)} 份
                                        </span>
                                    </div>
                                    <div className="muted" style={{ fontSize: '12px' }}>
                                        计算基于当前净值/估值：¥{Number(price).toFixed(4)}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label
                                    className="muted"
                                    style={{ display: 'block', marginBottom: 8, fontSize: '14px' }}
                                >
                                    卖出份额 <span style={{ color: 'var(--danger)' }}>*</span>
                                </label>
                                <div
                                    style={{
                                        border: !share ? '1px solid var(--danger)' : '1px solid var(--border)',
                                        borderRadius: 12,
                                    }}
                                >
                                    <NumericInput
                                        value={share}
                                        onChange={setShare}
                                        step={1}
                                        min={0}
                                        placeholder="请输入卖出份额"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="row" style={{ gap: 12, marginTop: 12 }}>
                        <button
                            type="button"
                            className="button secondary"
                            onClick={onClose}
                            style={{ flex: 1, background: 'rgba(0,0,0,0.04)', color: 'var(--text)' }}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="button"
                            disabled={!isValid}
                            style={{ flex: 1, opacity: isValid ? 1 : 0.6 }}
                        >
                            确定
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}
