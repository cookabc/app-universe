'use client'

import React, { useState } from 'react'
import { Dashboard } from './components/Dashboard'
import { AddEvent } from './components/AddEvent'
import { EventItem } from './types'
import { MOCK_EVENTS } from './constants'

export default function App() {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS)
  const [view, setView] = useState<'dashboard' | 'add' | 'edit'>('dashboard')
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)

  const addEvent = (e: EventItem) => {
    setEvents(prev => [e, ...prev])
    setView('dashboard')
  }

  const updateEvent = (e: EventItem) => {
    setEvents(prev => prev.map(ev => ev.id === e.id ? e : ev))
    setView('dashboard')
  }

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  if (view === 'add') {
    return (
      <AddEvent 
        events={events} 
        addEvent={addEvent} 
      />
    )
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
