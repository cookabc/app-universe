'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    EVENT_CATEGORIES,
    EVENT_COLORS,
    type EventCategory,
    type EventColor,
    type EventItem,
    REPEAT_OPTIONS,
    type RepeatOption,
} from '../types'
import { CalendarPicker } from './CalendarPicker'
import { TimePicker } from './TimePicker'

interface AddEventProps {
    events: EventItem[]
    addEvent: (e: EventItem) => void
    updateEvent?: (e: EventItem) => void
    isEditing?: boolean
    initialEvent?: EventItem
}

export function AddEvent({ events, addEvent, updateEvent, isEditing, initialEvent }: AddEventProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const [eventName, setEventName] = useState(initialEvent?.name || '')
    const [eventType, setEventType] = useState<'past' | 'future'>(initialEvent?.type || 'future')
    const [allDay, setAllDay] = useState(initialEvent?.isAllDay || false)
    const [selectedDate, setSelectedDate] = useState<Date>(initialEvent?.date || new Date())
    const [category, setCategory] = useState<EventCategory>(initialEvent?.category || 'General')
    const [alertEnabled, setAlertEnabled] = useState(initialEvent?.alertEnabled ?? true)
    const [repeatOption, setRepeatOption] = useState<RepeatOption>(initialEvent?.repeatOption || 'Never')
    const [selectedColor, setSelectedColor] = useState<EventColor>(() => {
        const found = EVENT_COLORS.find((c) => c.bg === initialEvent?.color)
        return (found as EventColor) ?? EVENT_COLORS[0]
    })

    const [expandedSection, setExpandedSection] = useState<'category' | 'repeat' | null>(null)
    const [errors, setErrors] = useState<{ name?: string }>({})

    void events

    const canSave = eventName.trim().length > 0

    const validate = (): boolean => {
        const newErrors: { name?: string } = {}
        if (!eventName.trim()) {
            newErrors.name = t('duekeep.addEvent.errors.required')
        } else if (eventName.trim().length < 2) {
            newErrors.name = t('duekeep.addEvent.errors.minLength')
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSave = () => {
        if (!validate()) {
            return
        }
        const eventDate = new Date(selectedDate)
        if (allDay) {
            eventDate.setHours(0, 0, 0, 0)
        }

        const eventData: EventItem = {
            id:
                initialEvent?.id ||
                (typeof crypto !== 'undefined' && 'randomUUID' in crypto
                    ? crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
            name: eventName.trim(),
            date: eventDate,
            isAllDay: allDay,
            type: eventType,
            category,
            alertEnabled,
            repeatOption,
            color: selectedColor.bg,
            textColor: selectedColor.text,
        }

        if (isEditing && updateEvent) {
            updateEvent(eventData)
        } else {
            addEvent(eventData)
        }
        router.push('/duekeep')
    }

    return (
        <div className="flex min-h-[600px] bg-card border border-border rounded-xl p-6">
            <div className="w-full max-w-2xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.push('/duekeep')}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t('duekeep.addEvent.cancel')}
                    </button>
                    <h1 className="text-xl font-semibold text-foreground">
                        {isEditing ? t('duekeep.addEvent.editTitle') : t('duekeep.addEvent.title')}
                    </h1>
                    <button
                        onClick={handleSave}
                        disabled={!canSave}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            canSave
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
                        }`}
                    >
                        {t('duekeep.addEvent.save')}
                    </button>
                </header>

                <main className="space-y-6">
                    <section>
                        <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {t('duekeep.addEvent.eventName')}
                        </h2>
                        <div className="relative">
                            <input
                                className={`w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${
                                    errors.name ? 'ring-2 ring-red-500 border-red-500' : ''
                                }`}
                                placeholder={t('duekeep.addEvent.eventNamePlaceholder')}
                                type="text"
                                value={eventName}
                                onChange={(e) => {
                                    setEventName(e.target.value)
                                    if (errors.name) setErrors({})
                                }}
                            />
                        </div>
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </section>

                    <section>
                        <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {t('duekeep.addEvent.eventType')}
                        </h2>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setEventType('past')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                                    eventType === 'past'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                                <span className="material-icons-round">history</span>
                                <span>{t('duekeep.addEvent.pastEvent')}</span>
                            </button>
                            <button
                                onClick={() => setEventType('future')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                                    eventType === 'future'
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border text-muted-foreground hover:border-primary/50'
                                }`}
                            >
                                <span className="material-icons-round">schedule</span>
                                <span>{t('duekeep.addEvent.futureEvent')}</span>
                            </button>
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {t('duekeep.addEvent.date')}
                        </h2>
                        <CalendarPicker selectedDate={selectedDate} onChange={setSelectedDate} />
                    </section>

                    <section>
                        <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {t('duekeep.addEvent.time')}
                        </h2>
                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                            <span className="text-foreground">{t('duekeep.addEvent.allDay')}</span>
                            <button
                                onClick={() => setAllDay(!allDay)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${
                                    allDay ? 'bg-primary' : 'bg-muted'
                                }`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                        allDay ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                        {!allDay && <TimePicker value={selectedDate} onChange={setSelectedDate} />}
                    </section>

                    <section>
                        <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {t('duekeep.addEvent.color')}
                        </h2>
                        <div className="flex gap-3 p-4 bg-muted/30 rounded-lg border border-border">
                            {EVENT_COLORS.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => setSelectedColor(c)}
                                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                                        selectedColor.name === c.name
                                            ? 'scale-110 border-foreground'
                                            : 'border-transparent hover:scale-105'
                                    }`}
                                    style={{ backgroundColor: c.bg }}
                                    aria-label={c.name}
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="mb-2 text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            {t('duekeep.addEvent.options')}
                        </h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => setExpandedSection(expandedSection === 'category' ? null : 'category')}
                                className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-muted-foreground">category</span>
                                    <span className="text-foreground">{t('duekeep.addEvent.category')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">{category}</span>
                                    <span className="material-icons-round text-muted-foreground">chevron_right</span>
                                </div>
                            </button>
                            {expandedSection === 'category' && (
                                <div className="grid grid-cols-2 gap-2 p-2 bg-muted/30 rounded-lg">
                                    {EVENT_CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setCategory(cat)
                                                setExpandedSection(null)
                                            }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                                                category === cat
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-background text-foreground hover:bg-muted'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setExpandedSection(expandedSection === 'repeat' ? null : 'repeat')}
                                className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-muted-foreground">cached</span>
                                    <span className="text-foreground">{t('duekeep.addEvent.repeat')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">{repeatOption}</span>
                                    <span className="material-icons-round text-muted-foreground">chevron_right</span>
                                </div>
                            </button>
                            {expandedSection === 'repeat' && (
                                <div className="grid grid-cols-2 gap-2 p-2 bg-muted/30 rounded-lg">
                                    {REPEAT_OPTIONS.map((opt) => (
                                        <button
                                            key={opt}
                                            onClick={() => {
                                                setRepeatOption(opt)
                                                setExpandedSection(null)
                                            }}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors ${
                                                repeatOption === opt
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-background text-foreground hover:bg-muted'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={() => setAlertEnabled(!alertEnabled)}
                                className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border hover:border-primary/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="material-icons-round text-muted-foreground">
                                        {alertEnabled ? 'notifications' : 'notifications_off'}
                                    </span>
                                    <span className="text-foreground">{t('duekeep.addEvent.alert')}</span>
                                </div>
                                <span
                                    className={`px-2 py-1 rounded text-xs font-medium ${
                                        alertEnabled ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {alertEnabled ? t('duekeep.addEvent.on') : t('duekeep.addEvent.off')}
                                </span>
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}
