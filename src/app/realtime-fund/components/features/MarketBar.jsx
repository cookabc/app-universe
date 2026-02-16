export default function MarketBar({ indices }) {
    if (!indices || indices.length === 0) return null
    return (
        <div
            className="glass"
            style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '8px 16px',
                borderRadius: 12,
                marginBottom: 16,
                fontSize: '13px',
            }}
        >
            {indices.map((idx, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                    <span
                        className="muted"
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                        {idx.name}
                    </span>
                    <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
                        {idx.price}
                    </span>
                    <span
                        className={idx.change > 0 ? 'up' : idx.change < 0 ? 'down' : ''}
                        style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}
                    >
                        {idx.change > 0 ? '+' : ''}
                        {idx.change}%
                    </span>
                </div>
            ))}
        </div>
    )
}
