'use client'

import { useEffect, useState } from 'react'
import { AddEvent } from './components/AddEvent'
import { Dashboard } from './components/Dashboard'
import { MOCK_EVENTS } from './constants'
import type { EventItem } from './types'

const STORAGE_KEY = 'duekeep_events'

function loadEvents(): EventItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            const parsed = JSON.parse(raw) as EventItem[]
            if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
    } catch {
        // Corrupted storage — fall back to mock data
    }
    return MOCK_EVENTS
}

function saveEvents(events: EventItem[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch {
        // Storage quota exceeded or unavailable — silently ignore
    }
}

export default function App() {
    const [events, setEvents] = useState<EventItem[]>([])
    const [view, setView] = useState<'dashboard' | 'add' | 'edit'>('dashboard')
    const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)

    // Load from localStorage on first render (client-side only)
    useEffect(() => {
        setEvents(loadEvents())
    }, [])

    const addEvent = (e: EventItem) => {
        setEvents((prev) => {
            const next = [e, ...prev]
            saveEvents(next)
            return next
        })
        setView('dashboard')
    }

    const updateEvent = (e: EventItem) => {
        setEvents((prev) => {
            const next = prev.map((ev) => (ev.id === e.id ? e : ev))
            saveEvents(next)
            return next
        })
        setView('dashboard')
    }

    const deleteEvent = (id: string) => {
        setEvents((prev) => {
            const next = prev.filter((e) => e.id !== id)
            saveEvents(next)
            return next
        })
    }

    if (view === 'add') {
        return <AddEvent events={events} addEvent={addEvent} />
    }

    if (view === 'edit') {
        return (
            <AddEvent
                events={events}
                addEvent={addEvent}
                updateEvent={updateEvent}
                isEditing
                initialEvent={editingEvent!}
            />
        )
    }

    return (
        <Dashboard
            events={events}
            onDelete={deleteEvent}
            onEdit={(e) => {
                setEditingEvent(e)
                setView('edit')
            }}
            onAdd={() => setView('add')}
        />
    )
}
