import type React from "react";
import { useMemo } from "react";
import type { EventItem } from "../types";
import { calculateCountdown } from "../utils/dateUtils";
import { motion } from "framer-motion";
import { Edit2, Trash2, Clock, CalendarDays } from "lucide-react";

interface EventCardProps {
  event: EventItem;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onDelete,
}) => {
  const { diffValue, label } = useMemo(() => {
    return calculateCountdown(event.date);
  }, [event.date]);

  const dateString = event.date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const progress = Math.min(100, Math.max(0, 100 - (diffValue / 30) * 100)); // Mock progress for visual

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-[24px] p-6 shadow-xl transition-all hover:shadow-2xl group"
      style={{
        backgroundColor: event.color,
        color: event.textColor,
        boxShadow: `0 10px 30px -10px ${event.color}66`,
      }}
    >
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 pointer-events-none" />
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-4 flex-1">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium opacity-80 mb-1">
              <CalendarDays className="w-4 h-4" />
              <span>{dateString}</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight leading-tight mb-2 pr-4">
              {event.name}
            </h3>
          </div>

          {/* Progress Bar Mockup */}
          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden max-w-[140px]">
            <div
              className="h-full bg-current opacity-80 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black tracking-tighter leading-none">
              {diffValue}
            </span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest opacity-70 mt-1">
            {label}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {(onEdit || onDelete) && (
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors shadow-sm"
              aria-label="Edit event"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-red-500/80 hover:text-white transition-colors shadow-sm"
              aria-label="Delete event"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};
