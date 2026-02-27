import type React from 'react'
import { useState } from 'react'
import type { EventItem } from '../types'
import { CalendarView } from './CalendarView'
import { EventCard } from './EventCard'
import { SettingsView } from './SettingsView'
import { LayoutDashboard, Calendar, Settings, Plus, Clock, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export const Dashboard: React.FC<{
    events: EventItem[]
    onDelete?: (id: string) => void
    onEdit?: (event: EventItem) => void
    onAdd?: () => void
    initialTab?: 'home' | 'calendar' | 'settings'
}> = ({ events, onDelete, onEdit, onAdd, initialTab = 'home' }) => {
    const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'settings'>(initialTab)

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl p-6 hidden md:flex flex-col gap-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <Clock className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h2 className="text-xl font-bold tracking-tight">DueKeep</h2>
                </div>

                <nav className="flex-1 space-y-2">
                    <NavButton
                        active={activeTab === 'home'}
                        onClick={() => setActiveTab('home')}
                        icon={LayoutDashboard}
                        label="Dashboard"
                    />
                    <NavButton
                        active={activeTab === 'calendar'}
                        onClick={() => setActiveTab('calendar')}
                        icon={Calendar}
                        label="Calendar"
                    />
                    <NavButton
                        active={activeTab === 'settings'}
                        onClick={() => setActiveTab('settings')}
                        icon={Settings}
                        label="Settings"
                    />
                </nav>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
                    <p className="text-sm font-medium mb-3 text-primary">Need to track something?</p>
                    <button
                        onClick={() => onAdd?.()}
                        className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-xl font-medium transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Event</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Bottom Nav (Visible only on small screens) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-lg border-t border-border flex justify-around items-center z-50 px-4 pb-safe">
                <MobileNavButton
                    active={activeTab === 'home'}
                    onClick={() => setActiveTab('home')}
                    icon={LayoutDashboard}
                />
                <button
                    onClick={() => onAdd?.()}
                    className="p-3 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 -translate-y-4"
                >
                    <Plus className="w-6 h-6" />
                </button>
                <MobileNavButton
                    active={activeTab === 'calendar'}
                    onClick={() => setActiveTab('calendar')}
                    icon={Calendar}
                />
            </div>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="h-full"
                    >
                        {activeTab === 'home' && <HomeContent events={events} onEdit={onEdit!} onDelete={onDelete!} />}
                        {activeTab === 'calendar' && <CalendarView events={events} />}
                        {activeTab === 'settings' && <SettingsView />}
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
            active
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
    >
        <Icon className={`w-5 h-5 transition-colors ${active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
        <span>{label}</span>
        {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
    </button>
)

const MobileNavButton = ({ active, onClick, icon: Icon }: any) => (
    <button
        onClick={onClick}
        className={`p-2 rounded-lg transition-colors ${
            active ? 'text-primary' : 'text-muted-foreground'
        }`}
    >
        <Icon className="w-6 h-6" />
    </button>
)

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
        <div className="flex flex-col h-full bg-muted/5">
            <header className="p-8 pb-6">
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            {todayStr}
                        </p>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground">
                            Good Morning, <br/>
                            <span className="text-primary">Creator</span>
                        </h1>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-purple-500 p-0.5 shadow-lg">
                        <div className="w-full h-full rounded-full bg-background p-0.5 overflow-hidden">
                            <img
                                src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                    {['all', 'future', 'past'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                filter === f
                                    ? 'bg-foreground text-background shadow-md'
                                    : 'bg-background border border-border text-muted-foreground hover:border-foreground/20'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex-1 overflow-y-auto px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onEdit={onEdit ? () => onEdit(event) : undefined!}
                            onDelete={onDelete ? () => onDelete(event.id) : undefined!}
                        />
                    ))}
                </div>

                {filteredEvents.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-60">
                        <Calendar className="w-16 h-16 mb-4 stroke-1" />
                        <p className="text-lg font-medium">No events found</p>
                        <p className="text-sm">Try adding a new event to get started</p>
                    </div>
                )}
            </div>
        </div>
    )
}
