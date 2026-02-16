import type React from 'react'
import { useState } from 'react'
import type { EventItem } from '../types'
import { CalendarView } from './CalendarView'
import { EventCard } from './EventCard'
import { SettingsView } from './SettingsView'

export const Dashboard: React.FC<{
    events: EventItem[]
    onDelete?: (id: string) => void
    onEdit?: (event: EventItem) => void
    onAdd?: () => void
    initialTab?: 'home' | 'calendar' | 'settings'
}> = ({ events, onDelete, onEdit, onAdd, initialTab = 'home' }) => {
    const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'settings'>(initialTab)

    return (
        <div className="flex min-h-[600px] bg-card border border-border rounded-xl overflow-hidden">
            <aside className="w-48 bg-muted/30 border-r border-border p-4 flex flex-col">
                <h2 className="text-lg font-bold mb-6 text-foreground">DueKeep</h2>
                <nav className="flex-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                            activeTab === 'home'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        <span className="material-icons-round">dashboard</span>
                        <span className="font-medium">Home</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                            activeTab === 'calendar'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        <span className="material-icons-round">calendar_month</span>
                        <span className="font-medium">Calendar</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                            activeTab === 'settings'
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                        <span className="material-icons-round">settings</span>
                        <span className="font-medium">Settings</span>
                    </button>
                </nav>
                <button
                    onClick={() => onAdd?.()}
                    className="mt-4 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 px-4 rounded-lg font-medium transition-colors"
                >
                    <span className="material-icons-round">add</span>
                    <span>Add Event</span>
                </button>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden">
                {activeTab === 'home' && <HomeContent events={events} onEdit={onEdit!} onDelete={onDelete!} />}
                {activeTab === 'calendar' && <CalendarView events={events} />}
                {activeTab === 'settings' && <SettingsView />}
            </main>
        </div>
    )
}

const HomeContent: React.FC<{
    events: EventItem[]
    onEdit?: (event: EventItem) => void
    onDelete?: (id: string) => void
}> = ({ events, onEdit, onDelete }) => {
    const [filter, setFilter] = useState<'all' | 'past' | 'future'>('all')
    const now = new Date()

    const filteredEvents = events.filter((event) => {
        if (filter === 'all') return true
        if (event.type) {
            return event.type === filter
        }
        const isPast = event.date.getTime() < now.getTime()
        return filter === 'past' ? isPast : !isPast
    })

    const todayStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    })

    return (
        <div className="flex flex-col h-full">
            <header className="p-6 pb-4 border-b border-border bg-card">
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    {todayStr}
                </div>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Countdown</h1>
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border border-border">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                            alt="Profile"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </header>

            <div className="px-6 py-4 border-b border-border bg-card">
                <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            filter === 'all'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            filter === 'past'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Past
                    </button>
                    <button
                        onClick={() => setFilter('future')}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            filter === 'future'
                                ? 'bg-background text-foreground shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        Future
                    </button>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto p-6 space-y-4">
                {filteredEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        event={event}
                        onEdit={onEdit ? () => onEdit(event) : undefined!}
                        onDelete={onDelete ? () => onDelete(event.id) : undefined!}
                    />
                ))}
                {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <span className="material-icons-round text-6xl mb-4 opacity-50">event_busy</span>
                        <p className="font-medium">No events found</p>
                    </div>
                )}
            </main>
        </div>
    )
}
