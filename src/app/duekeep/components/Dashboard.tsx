"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  Clock,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { EventItem } from "../types";
import { CalendarView } from "./CalendarView";
import { EventCard } from "./EventCard";

export const Dashboard: React.FC<{
  events: EventItem[];
  onDelete?: (id: string) => void;
  onEdit?: (event: EventItem) => void;
  onAdd?: () => void;
  initialTab?: "home" | "calendar";
}> = ({ events, onDelete, onEdit, onAdd, initialTab = "home" }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"home" | "calendar">(initialTab);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r-2 border-slate-800 bg-card p-6 hidden md:flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-[var(--radius)] bg-primary border-2 border-slate-800 shadow-[var(--box-shadow)] flex items-center justify-center">
            <Clock className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-black tracking-tight">
            {t("duekeep.appName")}
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          <NavButton
            active={activeTab === "home"}
            onClick={() => setActiveTab("home")}
            icon={LayoutDashboard}
            label={t("duekeep.nav.dashboard")}
          />
          <NavButton
            active={activeTab === "calendar"}
            onClick={() => setActiveTab("calendar")}
            icon={Calendar}
            label={t("duekeep.nav.calendar")}
          />
        </nav>

        <div className="p-4 rounded-[var(--radius)] border-2 border-slate-800 bg-primary/10 shadow-[var(--box-shadow)]">
          <p className="text-sm font-bold mb-3 text-primary">
            {t("duekeep.dashboard.needToTrack")}
          </p>
          <button
            onClick={() => onAdd?.()}
            className="w-full flex items-center justify-center gap-2 bg-primary border-2 border-slate-800 shadow-[var(--box-shadow)] hover:-translate-y-0.5 hover:-translate-x-0.5 active:translate-y-0 text-primary-foreground py-3 px-4 rounded-[var(--radius)] font-bold transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>{t("duekeep.dashboard.addNew")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t-2 border-slate-800 flex justify-around items-center z-50 px-4 pb-safe">
        <MobileNavButton
          active={activeTab === "home"}
          onClick={() => setActiveTab("home")}
          icon={LayoutDashboard}
        />
        <button
          onClick={() => onAdd?.()}
          className="p-3 bg-primary border-2 border-slate-800 shadow-[var(--box-shadow)] text-primary-foreground rounded-full -translate-y-4"
        >
          <Plus className="w-6 h-6" />
        </button>
        <MobileNavButton
          active={activeTab === "calendar"}
          onClick={() => setActiveTab("calendar")}
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
            {activeTab === "home" && (
              <HomeContent
                events={events}
                onEdit={onEdit!}
                onDelete={onDelete!}
              />
            )}
            {activeTab === "calendar" && <CalendarView events={events} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 group ${
      active
        ? "bg-primary/10 text-primary font-semibold"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    <Icon
      className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`}
    />
    <span>{label}</span>
    {active && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
  </button>
);

const MobileNavButton = ({ active, onClick, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
  >
    <Icon className="w-6 h-6" />
  </button>
);

const HomeContent: React.FC<{
  events: EventItem[];
  onEdit?: (event: EventItem) => void;
  onDelete?: (id: string) => void;
}> = ({ events, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<"all" | "past" | "future">("all");
  const now = new Date();

  const filteredEvents = events.filter((event) => {
    if (filter === "all") return true;
    if (event.type) {
      return event.type === filter;
    }
    const isPast = event.date.getTime() < now.getTime();
    return filter === "past" ? isPast : !isPast;
  });

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col h-full bg-muted/5">
      <header className="p-8 pb-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {todayStr}
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              {t("duekeep.dashboard.greeting")}
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
          {["all", "future", "past"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                filter === f
                  ? "bg-foreground text-background shadow-md"
                  : "bg-background border border-border text-muted-foreground hover:border-foreground/20"
              }`}
            >
              {t(`duekeep.dashboard.filters.${f}`)}
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
            <p className="text-lg font-medium">
              {t("duekeep.dashboard.empty.title")}
            </p>
            <p className="text-sm">{t("duekeep.dashboard.empty.message")}</p>
          </div>
        )}
      </div>
    </div>
  );
};
