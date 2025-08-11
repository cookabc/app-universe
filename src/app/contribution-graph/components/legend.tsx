const colorLevels = ['bg-gray-200', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800']

export function Legend() {
    return (
        <div className="flex items-center justify-end mt-1 text-xs text-muted-foreground">
            <span>Less</span>
            {colorLevels.map((color, index) => (
                <div key={`legend-${index}`} className={`w-2.5 h-2.5 mx-0.5 rounded-sm ${color}`} />
            ))}
            <span>More</span>
        </div>
    )
}
