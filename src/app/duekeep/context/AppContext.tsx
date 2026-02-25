import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { MOCK_EVENTS } from '../constants'
import { type EventItem } from '../types'
import { parseEvents } from '../utils/eventParser'

interface AppContextType {
    events: EventItem[]
    setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>
    addEvent: (e: EventItem) => void
    updateEvent: (e: EventItem) => void
    deleteEvent: (id: string) => void
}

const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) throw new Error('useAppContext must be used within AppProvider')
    return context
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS)
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        try {
            const raw = localStorage.getItem('events')
            const restored = parseEvents(raw)
            if (restored.length > 0) {
                setEvents(restored)
            }
        } catch (error) {
            console.error('Failed to load events from localStorage:', error)
        }
        setIsLoaded(true)
    }, [])

    useEffect(() => {
        if (!isLoaded) return
        const serializable = events.map((e) => ({ ...e, date: e.date.toISOString() }))
        localStorage.setItem('events', JSON.stringify(serializable))
    }, [events, isLoaded])

    const addEvent = (e: EventItem) => {
        setEvents((prev) => [e, ...prev])
    }

    const updateEvent = (e: EventItem) => {
        setEvents((prev) => prev.map((ev) => (ev.id === e.id ? e : ev)))
    }

    const deleteEvent = (id: string) => {
        setEvents((prev) => prev.filter((e) => e.id !== id))
    }

    return (
        <AppContext.Provider value={{ events, setEvents, addEvent, updateEvent, deleteEvent }}>
            {children}
        </AppContext.Provider>
    )
}
