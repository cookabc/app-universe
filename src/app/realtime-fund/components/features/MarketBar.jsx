import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function MarketBar({ indices }) {
    if (!indices || indices.length === 0) return null

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {indices.map((idx, i) => (
                <div
                    key={i}
                    className="relative overflow-hidden rounded-xl bg-card border border-border/50 p-4 shadow-sm hover:shadow-md transition-all group"
                >
                    <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${idx.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {idx.change > 0 ? <TrendingUp className="w-12 h-12" /> : <TrendingDown className="w-12 h-12" />}
                    </div>

                    <div className="relative z-10">
                        <div className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-2">
                            <Activity className="w-3 h-3" />
                            {idx.name}
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold font-mono tracking-tight">{idx.price}</span>
                            <span
                                className={`text-sm font-bold flex items-center ${idx.change > 0 ? 'text-green-500' : idx.change < 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                            >
                                {idx.change > 0 ? '+' : ''}{idx.change}%
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
