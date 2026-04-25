import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface StreakTrackerProps {
  activityDays: string[];
}

export function StreakTracker({ activityDays }: StreakTrackerProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
  const normalizedToday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0 is Mon, 6 is Sun

  const getStatus = (index: number) => {
    // This is a naive implementation mapping just current week
    // In a real app, you'd calculate dates for the specific week
    const date = new Date();
    date.setDate(date.getDate() - (normalizedToday - index));
    const dateStr = date.toISOString().split('T')[0];
    
    if (activityDays.includes(dateStr)) return 'completed';
    if (index === normalizedToday) return 'today';
    return 'missed';
  };

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-sm shadow-sm">
      <h3 className="font-technical text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-6">Weekly Activity</h3>
      <div className="flex items-center justify-between">
        {days.map((day, idx) => {
          const status = getStatus(idx);
          return (
            <div key={day} className="flex flex-col items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                status === 'completed' && "bg-green-500 text-white shadow-lg shadow-green-500/20",
                status === 'today' && "bg-[var(--accent)] text-white shadow-lg shadow-orange-500/20 animate-pulse",
                status === 'missed' && "bg-slate-50 text-slate-300 border border-slate-100"
              )}>
                {status === 'completed' ? <CheckCircle2 size={18} /> : (
                  <span className="font-technical text-[10px] font-bold">{day[0]}</span>
                )}
              </div>
              <span className={cn(
                "font-technical text-[9px] uppercase tracking-tighter",
                status === 'today' ? "text-[var(--accent)] font-bold" : "text-slate-400"
              )}>
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
