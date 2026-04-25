import React, { useState } from 'react';
import { LabChallenge as LabChallengeType } from '../types';
import { Terminal, CheckCircle2, XCircle, Lightbulb, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import api from '../lib/axios';
import { cn } from '../lib/utils';

interface LabChallengeProps {
  challenge: LabChallengeType;
  userId: string;
  onSuccess: () => void;
}

export function LabChallenge({ challenge, userId, onSuccess }: LabChallengeProps) {
  const [checking, setChecking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ passed: boolean; message: string } | null>(null);

  const handleCheck = async () => {
    setChecking(true);
    setFeedback(null);
    try {
      const response = await api.post(`/api/labs/${challenge.id}/check`, { userId });
      const { passed, hints } = response.data;
      
      if (passed) {
        setFeedback({ passed: true, message: 'Excellent! Command verified successfully.' });
        setTimeout(onSuccess, 1500);
      } else {
        const nextAttempt = attempts + 1;
        setAttempts(nextAttempt);
        
        let hintMessage = 'The task is not yet complete. Check your syntax and try again.';
        if (nextAttempt <= hints.length) {
          hintMessage = hints[nextAttempt - 1];
        } else if (challenge.answer) {
          hintMessage = `Stuck? The command is: ${challenge.answer}`;
        }
        
        setFeedback({ passed: false, message: hintMessage });
      }
    } catch (err) {
      console.error('Check answer error:', err);
      setFeedback({ passed: false, message: 'Validation failed. Ensure your terminal is connected.' });
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-[var(--ink)] text-white flex items-center justify-center rounded-sm">
            <Terminal size={14} />
          </div>
          <span className="font-technical text-[10px] uppercase font-bold tracking-widest text-slate-400">Terminal Challenge</span>
        </div>
        <h4 className="font-technical text-sm font-bold uppercase mb-2">Instruction</h4>
        <p className="text-sm text-slate-600 leading-relaxed italic">
          "{challenge.instruction}"
        </p>
      </div>

      <div className="p-6 space-y-4">
        <AnimatePresence mode="wait">
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "p-4 flex items-start gap-3 rounded-sm text-sm",
                feedback.passed ? "bg-green-500/10 text-green-700 border border-green-500/20" : "bg-orange-500/10 text-orange-700 border border-orange-500/20"
              )}
            >
              <div className="shrink-0 mt-0.5">
                {feedback.passed ? <CheckCircle2 size={18} /> : <Lightbulb size={18} />}
              </div>
              <div>
                <span className="font-bold uppercase tracking-tight block mb-1">
                  {feedback.passed ? "Success" : `Hint #${Math.min(attempts, challenge.hints.length)}`}
                </span>
                <p className="leading-relaxed opacity-90">{feedback.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleCheck}
          disabled={checking || feedback?.passed}
          className={cn(
            "w-full py-4 flex items-center justify-center gap-3 font-technical uppercase text-xs font-bold tracking-widest transition-all",
            feedback?.passed 
              ? "bg-green-500 text-white cursor-default" 
              : "bg-[var(--ink)] text-white hover:bg-[var(--accent)] disabled:opacity-50"
          )}
        >
          {checking ? (
            <>Validating System State <Loader2 className="animate-spin" size={16} /></>
          ) : feedback?.passed ? (
            <>Verified <CheckCircle2 size={16} /></>
          ) : (
            <>Check my answer <ArrowRight size={16} /></>
          )}
        </button>
      </div>

      <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <span className="text-[10px] font-technical uppercase text-slate-400">Status:</span>
            <div className="flex gap-1">
               {[1, 2, 3].map(i => (
                 <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i <= attempts ? "bg-[var(--accent)]" : "bg-slate-200")} />
               ))}
            </div>
         </div>
         <span className="text-[10px] font-technical uppercase text-slate-400">{attempts} Failed Attempts</span>
      </div>
    </div>
  );
}
