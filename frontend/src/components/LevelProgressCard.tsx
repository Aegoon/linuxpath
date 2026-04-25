import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Lock, CheckCircle2, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LevelProgressCardProps {
  id: string;
  name: string;
  total: number;
  done: number;
  status: 'complete' | 'in-progress' | 'locked';
  lastLessonId: string | null;
}

export function LevelProgressCard({ id, name, total, done, status, lastLessonId }: LevelProgressCardProps) {
  const progress = (done / total) * 100;

  return (
    <div className={cn(
      "p-6 bg-white border border-slate-100 rounded-sm shadow-sm transition-all relative overflow-hidden",
      status === 'locked' ? "opacity-60 grayscale" : "hover:shadow-xl hover:border-slate-200"
    )}>
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <span className="font-technical text-[10px] uppercase font-bold tracking-widest text-[var(--accent)]">Level {id.toUpperCase()}</span>
             <StatusPill status={status} />
          </div>
          <h3 className="text-xl font-bold tracking-tight uppercase">{name}</h3>
        </div>
        <div className="w-10 h-10 bg-slate-50 flex items-center justify-center rounded-sm">
           {status === 'locked' ? <Lock size={16} className="text-slate-400" /> : <PlayCircle size={18} className="text-[var(--ink)]" />}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-technical uppercase text-slate-400">{done} of {total} Lessons</span>
          <span className="text-[10px] font-technical font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1 bg-slate-50 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-[var(--ink)]"
          />
        </div>
      </div>

      {status === 'in-progress' && (
        <Link 
          to="/course"
          className="w-full py-3 bg-[var(--ink)] text-white font-technical uppercase text-[10px] font-bold tracking-widest flex items-center justify-center gap-2 hover:bg-[var(--accent)] transition-colors"
        >
          Resume Learning <ChevronRight size={14} />
        </Link>
      )}

      {status === 'complete' && (
        <div className="w-full py-3 bg-green-500/5 text-green-600 font-technical uppercase text-[10px] font-bold tracking-widest flex items-center justify-center gap-2 border border-green-500/10">
          Curriculum Mastered <CheckCircle2 size={14} />
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: LevelProgressCardProps['status'] }) {
  const styles = {
    'complete': 'bg-green-500/10 text-green-600',
    'in-progress': 'bg-blue-500/10 text-blue-600',
    'locked': 'bg-slate-100 text-slate-400'
  };

  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter", styles[status])}>
      {status === 'in-progress' ? 'Active' : status}
    </span>
  );
}
