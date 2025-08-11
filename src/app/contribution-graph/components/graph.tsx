const colorLevels = ['bg-gray-200', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800']
const weekdays = [
    { label: '', key: 'Sun' },
    { label: 'Mon', key: 'Mon' },
    { label: '', key: 'Tue' },
    { label: 'Wed', key: 'Wed' },
    { label: '', key: 'Thu' },
    { label: 'Fri', key: 'Fri' },
    { label: '', key: 'Sat' },
]
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const GRID_ROWS = 7
const GRID_COLUMNS = 53

export function Graph({ gridData }: { gridData: number[][] }) {
    return (
        <>
            <div className="flex flex-col justify-between p-1 text-xs text-muted-foreground bg-card">
                {weekdays.map((day) => (
                    <div key={day.key} className="h-3 leading-3">
                        {day.label}
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-card p-2">
                <div className="flex">
                    {Array.from({ length: GRID_COLUMNS }).map((_, weekIndex) => (
                        <div key={`week-${weekIndex}`} className="flex flex-col">
                            {Array.from({ length: GRID_ROWS }).map((_, dayIndex) => {
                                const cellValue = gridData[dayIndex]?.[weekIndex] || 0
                                return (
                                    <div
                                        key={`cell-${weekIndex}-${dayIndex}`}
                                        className={`w-2.5 h-2.5 m-0.5 rounded-sm ${colorLevels[Math.min(cellValue, 4)]}`}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
                <div className="flex text-xs text-muted-foreground pt-1">
                    {months.map((month) => (
                        <div key={`month-${month}`} className="w-1/12 text-left">
                            {month}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
