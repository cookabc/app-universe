export function calculateCountdown(targetDate: Date): {
    diffValue: number
    diffUnit: string
    label: string
} {
    const now = new Date()
    const diffMs = targetDate.getTime() - now.getTime()
    const absDiff = Math.abs(diffMs)
    const isPast = diffMs < 0

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(absDiff / (1000 * 60 * 60))

    let value = 0
    let unit = ''

    if (days > 0) {
        value = days
        unit = 'days'
    } else {
        value = hours
        unit = 'hours'
    }

    const label = isPast ? `${unit} ago` : `${unit} to go`

    return { diffValue: value, diffUnit: unit, label }
}
