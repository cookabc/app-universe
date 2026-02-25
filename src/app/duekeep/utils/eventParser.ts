import { EVENT_CATEGORIES, type EventCategory, type EventItem } from '../types'

export const parseEvents = (raw: string | null): EventItem[] => {
    if (!raw) return []

    try {
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return []

        return parsed
            .map((e: unknown) => {
                if (typeof e !== 'object' || e === null) return null
                const item = e as Record<string, unknown>

                let cat: EventCategory = 'General'
                if (
                    typeof item.category === 'string' &&
                    (EVENT_CATEGORIES as ReadonlyArray<string>).includes(item.category)
                ) {
                    cat = item.category as EventCategory
                }

                const dateStr = typeof item.date === 'string' ? item.date : ''
                const dateObj = new Date(dateStr)
                const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj

                return {
                    ...item,
                    id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
                    name: typeof item.name === 'string' ? item.name : 'Untitled Event',
                    date: validDate,
                    isAllDay: typeof item.isAllDay === 'boolean' ? item.isAllDay : false,
                    alertEnabled: typeof item.alertEnabled === 'boolean' ? item.alertEnabled : true,
                    repeatOption: typeof item.repeatOption === 'string' ? item.repeatOption : 'Never',
                    category: cat,
                    color: typeof item.color === 'string' ? item.color : '#007AFF',
                    textColor: typeof item.textColor === 'string' ? item.textColor : '#FFFFFF',
                    type: item.type === 'past' || item.type === 'future' ? item.type : 'future',
                } as EventItem
            })
            .filter((e): e is EventItem => e !== null)
    } catch (error) {
        console.error('Failed to parse events:', error)
        return []
    }
}
