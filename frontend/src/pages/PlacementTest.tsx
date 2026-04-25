import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, Terminal as TerminalIcon, Loader2, Award, Zap } from 'lucide-react';
import api from '../lib/axios';

interface Question {
  id: number;
  text: string;
  options: string[];
  difficulty: string;
}

interface PlacementResult {
  score: number;
  level: number;
  message: string;
  nextSteps: string;
}

interface PlacementTestProps {
  user: User;
}

export function PlacementTest({ user }: PlacementTestProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/api/placement-test');
        setQuestions(response.data);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSelect = async (answer: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: answer };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setSubmitting(true);
      try {
        const response = await api.post('/api/placement/submit', {
          userId: user.id,
          answers: newAnswers
        });
        setResult(response.data);
      } catch (error) {
        console.error('Failed to submit test:', error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-[var(--accent)]" size={48} />
      </div>
    );
  }

  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 min-h-[calc(100vh-64px)] flex flex-col">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="test"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex-1 flex flex-col"
          >
            {/* Header & Progress */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[var(--ink)] flex items-center justify-center rounded-sm">
                      <Zap size={20} className="text-[var(--accent)]" />
                   </div>
                   <div>
                     <h3 className="font-technical text-xs uppercase tracking-widest font-bold">Linux Proficiency Test</h3>
                     <p className="text-[10px] uppercase opacity-40">Step {currentStep + 1} of {questions.length}</p>
                   </div>
                </div>
                <div className="text-right">
                  <span className="font-technical text-xl font-bold">{Math.round((currentStep / questions.length) * 100)}%</span>
                </div>
              </div>
              <div className="w-full h-1 bg-[var(--line)] rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[var(--accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: 'spring', stiffness: 50 }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="flex-1">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <span className="inline-block px-3 py-1 bg-[var(--ink)] text-[10px] font-technical text-[var(--bg)] uppercase tracking-widest mb-6">
                  {questions[currentStep].difficulty} CHALLENGE
                </span>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase leading-tight mb-12 max-w-2xl">
                  {questions[currentStep].text}
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {questions[currentStep].options.map((option, idx) => (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => handleSelect(option)}
                      disabled={submitting}
                      className="group flex items-center justify-between p-6 bg-white border border-[var(--line)] hover:border-[var(--ink)] hover:shadow-2xl hover:-translate-y-1 transition-all text-left relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <span className="block text-[10px] font-technical opacity-30 mb-1 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                        <span className="font-technical uppercase text-sm tracking-widest font-bold">{option}</span>
                      </div>
                      <ChevronRight size={20} className="relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0" />
                      <div className="absolute top-0 left-0 w-1 h-0 bg-[var(--accent)] group-hover:h-full transition-all duration-300" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>

            {submitting && (
              <div className="fixed inset-0 bg-[var(--bg)]/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
                <Loader2 className="animate-spin text-[var(--accent)] mb-4" size={48} />
                <p className="font-technical uppercase text-xs tracking-widest font-bold">Calculating System Rank...</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center max-w-2xl mx-auto"
          >
            <div className="bg-white border border-[var(--line)] p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                 <Award size={120} className="text-[var(--line)] rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-[var(--accent)] text-white flex items-center justify-center rounded-sm mb-8">
                  <Check size={32} />
                </div>
                
                <h1 className="text-5xl font-bold tracking-tighter uppercase mb-2">Rank Assigned.</h1>
                <p className="font-editorial text-2xl italic opacity-60 mb-12">{result.message}</p>
                
                <div className="grid grid-cols-2 gap-12 border-y border-[var(--line)] py-10 mb-12">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest opacity-40 mb-3">Your level</span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-technical text-7xl font-bold text-[var(--ink)]">L{result.level}</span>
                      <span className="font-technical text-xs uppercase opacity-30">/ L5</span>
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest opacity-40 mb-3">Score</span>
                    <div className="flex items-baseline gap-2">
                       <span className="font-technical text-7xl font-bold text-[var(--ink)]">{result.score}</span>
                       <span className="font-technical text-xs uppercase opacity-30">/ 10</span>
                    </div>
                  </div>
                </div>

                <div className="mb-12">
                   <h4 className="font-technical text-xs font-bold uppercase tracking-widest mb-4">What's Next?</h4>
                   <p className="font-serif italic text-lg opacity-80 leading-relaxed">
                     "{result.nextSteps}"
                   </p>
                </div>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-[var(--ink)] text-[var(--bg)] py-6 font-technical uppercase tracking-[0.2em] text-xs font-bold hover:bg-[var(--accent)] transition-colors flex items-center justify-center gap-3 shadow-xl hover:shadow-[var(--accent)]/20"
                >
                  Initialize Learning Path <TerminalIcon size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
