import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { StreakTracker } from '../components/StreakTracker';
import { LevelProgressCard } from '../components/LevelProgressCard';
import { CertificateCard } from '../components/CertificateCard';
import { 
  Trophy, 
  Flame, 
  Target, 
  Medal, 
  Calendar, 
  ExternalLink, 
  Zap, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  PlayCircle,
  CheckCircle2,
  Award,
  Rocket
} from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { cn } from '../lib/utils';

interface DashboardData {
  user: {
    name: string;
    avatarInitials: string;
    levelLabel: string;
    memberSince: string;
    isPro: boolean;
  };
  stats: {
    lessonsCompleted: number;
    streakDays: number;
    avgQuizScore: number;
    certificatesCount: number;
  };
  weeklyActivity: string[];
  levels: Array<{
    id: string;
    name: string;
    total: number;
    done: number;
    status: 'complete' | 'in-progress' | 'locked';
    lastLessonId: string | null;
  }>;
  certificates: Array<{
    levelId: string;
    levelName: string;
    isEarned: boolean;
    issueDate: string | null;
  }>;
}

export function DashboardPage({ user: authUser }: { user: User }) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/api/dashboard');
        setData(response.data);
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
        {/* Header Skeleton */}
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-200 rounded-sm" />
            <div className="space-y-3">
              <div className="h-8 w-48 bg-slate-200 rounded-sm" />
              <div className="h-4 w-64 bg-slate-100 rounded-sm" />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-32 h-12 bg-slate-100 rounded-sm" />
            <div className="w-32 h-12 bg-slate-50 rounded-sm" />
          </div>
        </section>

        {/* Stats Skeleton */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white border border-slate-100 p-6 rounded-sm space-y-4">
              <div className="h-4 w-20 bg-slate-100 rounded-sm" />
              <div className="h-8 w-24 bg-slate-200 rounded-sm" />
              <div className="h-3 w-16 bg-slate-100 rounded-sm" />
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            {/* Levels Skeleton */}
            <section>
              <div className="h-6 w-48 bg-slate-100 rounded-sm mb-8" />
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-64 bg-white border border-slate-100 rounded-sm p-6 space-y-6">
                    <div className="flex justify-between">
                      <div className="space-y-2">
                        <div className="h-3 w-16 bg-slate-100 rounded-sm" />
                        <div className="h-6 w-32 bg-slate-200 rounded-sm" />
                      </div>
                      <div className="w-10 h-10 bg-slate-50 rounded-sm" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-3 w-20 bg-slate-100 rounded-sm" />
                        <div className="h-3 w-10 bg-slate-100 rounded-sm" />
                      </div>
                      <div className="h-1 w-full bg-slate-50 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-12">
            <div className="h-48 bg-white border border-slate-100 rounded-sm" />
            <div className="h-64 bg-slate-900 rounded-sm" />
            <div className="h-48 bg-white border border-slate-100 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-24">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-[var(--ink)] text-white flex items-center justify-center text-2xl font-bold rounded-sm shadow-xl shadow-slate-200">
            {data.user.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tighter uppercase">{data.user.name}</h1>
              {data.user.isPro && (
                <span className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest">
                  <Zap size={8} fill="currentColor" /> Pro
                </span>
              )}
            </div>
            <p className="text-slate-400 font-technical text-xs uppercase tracking-widest">
              {data.user.levelLabel} • Member since {data.user.memberSince}
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
           <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 font-technical text-[10px] uppercase font-bold tracking-widest hover:border-slate-400 transition-all">
              <Settings size={14} /> Settings
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-400 font-technical text-[10px] uppercase font-bold tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all">
              <LogOut size={14} /> Exit
           </button>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <StatCard 
          icon={<Trophy size={20} className="text-blue-500" />} 
          label="Lessons Done" 
          value={data.stats.lessonsCompleted} 
          sub="Across all levels"
        />
        <StatCard 
          icon={<Flame size={20} className="text-orange-500" />} 
          label="System Streak" 
          value={`${data.stats.streakDays} Days`} 
          sub="Consistent learning"
        />
        <StatCard 
          icon={<Target size={20} className="text-emerald-500" />} 
          label="Quiz Score" 
          value={`${data.stats.avgQuizScore}%`} 
          sub="Proficiency index"
        />
        <StatCard 
          icon={<Medal size={20} className="text-purple-500" />} 
          label="Certificates" 
          value={data.stats.certificatesCount} 
          sub="Verified milestones"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-16">
          {/* Level Progress */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-technical text-xs uppercase font-bold tracking-[0.2em] text-slate-400">Curriculum Path</h2>
              {data.stats.lessonsCompleted > 0 && (
                <div className="flex items-center gap-2 text-slate-400">
                   <span className="text-[10px] font-technical uppercase">Overall mastery</span>
                   <span className="text-[10px] font-technical font-bold text-[var(--ink)]">
                     {Math.round((data.levels.reduce((acc, l) => acc + l.done, 0) / data.levels.reduce((acc, l) => acc + l.total, 0)) * 100)}%
                   </span>
                </div>
              )}
            </div>
            
            {data.stats.lessonsCompleted === 0 ? (
              <div className="bg-white border border-slate-100 p-12 rounded-sm text-center">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-sm mx-auto mb-6">
                  <Rocket size={32} className="text-slate-300" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight uppercase mb-4 text-[var(--ink)]">Welcome to the Kernel, Rookie.</h3>
                <p className="text-slate-500 font-editorial italic text-lg max-w-md mx-auto mb-10 leading-relaxed">
                  You haven't started your journey yet. We recommend taking the placement test to determine your current proficiency level.
                </p>
                <Link 
                  to="/placement"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-[var(--ink)] text-white font-technical uppercase text-xs font-bold tracking-[0.2em] hover:bg-[var(--accent)] transition-all"
                >
                  Initialize Placement Test <ChevronRight size={18} />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {data.levels.map(level => (
                  <LevelProgressCard 
                    key={level.id}
                    id={level.id}
                    name={level.name}
                    total={level.total}
                    done={level.done}
                    status={level.status}
                    lastLessonId={level.lastLessonId}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Certificates */}
          <section>
            <h2 className="font-technical text-xs uppercase font-bold tracking-[0.2em] text-slate-400 mb-8">Certification Vault</h2>
            <div className="grid gap-4">
              {data.certificates.map(cert => (
                <CertificateCard 
                  key={cert.levelId}
                  levelId={cert.levelId}
                  levelName={cert.levelName}
                  isEarned={cert.isEarned}
                  issueDate={cert.issueDate}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-12">
           <StreakTracker activityDays={data.weeklyActivity} />

           <div className="bg-[var(--ink)] text-white p-8 rounded-sm shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                 <Zap size={140} className="rotate-12 translate-x-12 -translate-y-8" />
              </div>
              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-white/10 text-[9px] font-bold uppercase tracking-widest mb-6 border border-white/10">Upgrade Plan</span>
                <h3 className="text-2xl font-bold tracking-tight mb-4">Unlock the full kernel.</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-8">
                  Get absolute access to Levels L2-L5, cloud sandboxes, and verified industry certificates.
                </p>
                <Link to="/pricing" className="group flex items-center justify-between w-full p-4 bg-[var(--accent)] text-white font-technical uppercase text-[10px] font-bold tracking-widest hover:brightness-110 transition-all">
                  Go Pro Today <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
           </div>

           <div className="p-8 border border-slate-100 rounded-sm">
              <h4 className="font-technical text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                 <TrendingUp size={12} /> Recent Activity
              </h4>
              <div className="space-y-6">
                 <ActivityItem icon={<PlayCircle size={14} />} text="Started 'File Permissions'" time="2h ago" />
                 <ActivityItem icon={<CheckCircle2 size={14} />} text="Completed 'Navigation Basics'" time="1d ago" />
                 <ActivityItem icon={<Award size={14} />} text="Earned L1 Certificate" time="5d ago" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string | number, sub: string }) {
  return (
    <div className="bg-white border border-slate-100 p-6 rounded-sm shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <span className="font-technical text-[9px] uppercase font-bold tracking-widest text-slate-400">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-tighter mb-1">{value}</div>
      <p className="text-[10px] text-slate-400">{sub}</p>
    </div>
  );
}

function ActivityItem({ icon, text, time }: { icon: React.ReactNode, text: string, time: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-slate-600">
         <div className="text-slate-300">{icon}</div>
         <span className="text-xs font-medium truncate max-w-[140px]">{text}</span>
      </div>
      <span className="text-[9px] font-technical uppercase text-slate-300 whitespace-nowrap">{time}</span>
    </div>
  );
}
