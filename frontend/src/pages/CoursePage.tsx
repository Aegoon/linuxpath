import React, { useState, useEffect } from 'react';
import { Lesson, User } from '../types';
import { LessonSidebar } from '../components/lessons/LessonSidebar';
import { VideoLesson } from '../components/lessons/VideoLesson';
import { TextLesson } from '../components/lessons/TextLesson';
import { Terminal } from '../components/Terminal';
import { LabChallenge } from '../components/LabChallenge';
import { CheckCircle2, AlertCircle, ChevronRight, MessageSquare, BookOpen, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import api from '../lib/axios';

interface CoursePageProps {
  user: User;
}

export function CoursePage({ user }: CoursePageProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonsRes, progressRes] = await Promise.all([
          api.get(`/api/lessons/${user.level}`),
          api.get('/api/lessons/progress')
        ]);
        setLessons(lessonsRes.data);
        setCompletedIds(progressRes.data);
        if (lessonsRes.data.length > 0) {
          setCurrentLesson(lessonsRes.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch course data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.level]);

  const handleLessonComplete = async () => {
    if (!currentLesson || completing) return;
    
    setCompleting(true);
    try {
      await api.post(`/api/lessons/${currentLesson.id}/complete`);
      setCompletedIds([...completedIds, currentLesson.id]);
      
      // Auto-advance to next lesson
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      }
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-[var(--bg)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-[var(--ink)] border-t-[var(--accent)] animate-spin rounded-full" />
          <span className="font-technical text-[10px] uppercase tracking-widest font-bold">Booting Kernel...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-[280px] shrink-0">
        <LessonSidebar 
          lessons={lessons}
          currentLessonId={currentLesson?.id}
          completedIds={completedIds}
          onSelectLesson={setCurrentLesson}
          userLevel={user.level}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {currentLesson ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Center Panel (Lesson Content) */}
            <div className="flex-1 overflow-y-auto p-12 scrollbar-thin scrollbar-thumb-slate-200">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentLesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentLesson.type === 'video' ? (
                    <VideoLesson 
                      url={currentLesson.content} 
                      title={currentLesson.title} 
                      description={currentLesson.description} 
                    />
                  ) : (
                    <TextLesson 
                      title={currentLesson.title} 
                      markdown={currentLesson.content} 
                      description={currentLesson.description} 
                    />
                  )}

                  <hr className="my-12 border-slate-100" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-[10px] items-center font-technical uppercase tracking-wider text-slate-400 hover:text-[var(--ink)] transition-colors">
                        <MessageSquare size={14} /> Discussions
                      </button>
                      <button className="flex items-center gap-2 text-[10px] items-center font-technical uppercase tracking-wider text-slate-400 hover:text-[var(--ink)] transition-colors">
                        <BookOpen size={14} /> Documentation
                      </button>
                    </div>

                    <button
                      onClick={handleLessonComplete}
                      disabled={completedIds.includes(currentLesson.id) || completing}
                      className={cn(
                        "flex items-center gap-2 px-8 py-4 font-technical uppercase text-xs font-bold tracking-widest transition-all",
                        completedIds.includes(currentLesson.id)
                          ? "bg-green-500/10 text-green-600 border border-green-500/20 cursor-default"
                          : "bg-[var(--ink)] text-white hover:bg-[var(--accent)] hover:shadow-xl hover:shadow-orange-500/20"
                      )}
                    >
                      {completedIds.includes(currentLesson.id) ? (
                        <>Completed <CheckCircle2 size={16} /></>
                      ) : completing ? (
                        "Saving..."
                      ) : (
                        <>Mark Complete <ChevronRight size={16} /></>
                      )}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Panel (Tooling/Terminal) */}
            <div className="w-[360px] shrink-0 border-l border-slate-100 bg-slate-50 flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-white flex items-center justify-between">
                <span className="text-[10px] font-technical uppercase tracking-widest font-bold text-slate-400">Environment</span>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                   <span className="text-[9px] font-technical uppercase text-green-600">Active</span>
                </div>
              </div>

              <div className="flex-1 min-h-0 bg-black">
                <Terminal userId={user.id} className="h-full border-none shadow-none" />
              </div>

              {currentLesson.type === 'lab' && currentLesson.challenge && (
                <div className="p-6 border-t border-slate-100">
                  <LabChallenge 
                    challenge={currentLesson.challenge} 
                    userId={user.id} 
                    onSuccess={handleLessonComplete} 
                  />
                </div>
              )}

              <div className="p-6 space-y-4">
                 <h5 className="font-technical text-[10px] uppercase font-bold text-slate-400 tracking-widest">Rewards</h5>
                 <div className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-sm">
                    <div className="w-10 h-10 flex items-center justify-center bg-yellow-500/10 text-yellow-600">
                       <Star size={20} />
                    </div>
                    <div>
                       <span className="block text-[10px] font-technical uppercase font-bold leading-none mb-1">+50 XP</span>
                       <span className="block text-[9px] text-slate-400">Chapter completion bonus</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <AlertCircle className="text-slate-200 mb-6" size={64} />
            <h2 className="text-2xl font-bold tracking-tight uppercase">Module Not Found</h2>
            <p className="text-slate-500 mt-2">The requested lesson doesn't exist or hasn't been initialized yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
