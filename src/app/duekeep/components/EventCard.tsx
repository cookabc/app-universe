import type React from 'react'
import { useMemo } from 'react'
import type { EventItem } from '../types'
import { calculateCountdown } from '../utils/dateUtils'

interface EventCardProps {
    event: EventItem
    onEdit?: () => void
    onDelete?: () => void
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
    const { diffValue, label } = useMemo(() => {
        return calculateCountdown(event.date)
    }, [event.date])

    const dateString = event.date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div
            className="rounded-[20px] p-5 flex items-center shadow-lg relative overflow-hidden group transition-transform hover:scale-[1.02] active:scale-[0.98] duration-200"
            style={{ backgroundColor: event.color, color: event.textColor }}
        >
            <div className="flex-1 pr-4 z-10">
                <h3 className="text-2xl font-bold mb-1">{event.name}</h3>
                <p className="text-sm font-bold opacity-70">{dateString}</p>
            </div>

            <div className="w-px h-12 bg-black/10 mx-2 z-10"></div>

            <div className="flex flex-col items-center justify-center w-24 text-center pl-2 z-10">
                <span className="text-4xl font-bold leading-none">{diffValue}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide opacity-70 mt-1">{label}</span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

            {(onEdit || onDelete) && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    {onEdit && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit()
                            }}
                            className="p-2 rounded-full bg-black/20 hover:bg-black/30 transition-colors"
                        >
                            <span className="material-icons-round text-white text-sm">edit</span>
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onDelete()
                            }}
                            className="p-2 rounded-full bg-black/20 hover:bg-red-500 transition-colors"
                        >
                            <span className="material-icons-round text-white text-sm">delete</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
