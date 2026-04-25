import React from 'react';
import { Award, Lock, Download, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';
import api from '../lib/axios';

interface CertificateCardProps {
  levelId: string;
  levelName: string;
  isEarned: boolean;
  issueDate: string | null;
}

export function CertificateCard({ levelId, levelName, isEarned, issueDate }: CertificateCardProps) {
  const handleDownload = async () => {
    try {
      const response = await api.get(`/api/certificates/${levelId}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${levelId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Failed to download certificate:', err);
    }
  };

  return (
    <div className={cn(
      "p-6 border rounded-sm flex items-center justify-between transition-all",
      isEarned ? "bg-white border-slate-200 shadow-sm" : "bg-slate-50/50 border-slate-100 border-dashed opacity-70"
    )}>
      <div className="flex items-center gap-6">
        <div className={cn(
          "w-12 h-12 flex items-center justify-center rounded-sm",
          isEarned ? "bg-yellow-500/10 text-yellow-600" : "bg-slate-100 text-slate-400"
        )}>
          {isEarned ? <Award size={24} /> : <Lock size={20} />}
        </div>
        
        <div>
          <h4 className="font-bold tracking-tight text-slate-900">{levelName} Certificate</h4>
          {isEarned ? (
            <div className="flex items-center gap-2 text-slate-400 text-[10px] uppercase font-technical mt-1">
              <Calendar size={12} /> Issued on {issueDate}
            </div>
          ) : (
            <span className="text-[10px] font-technical uppercase text-slate-400 mt-1">Complete Level {levelId.toUpperCase()} to unlock</span>
          )}
        </div>
      </div>

      {isEarned && (
        <button 
          onClick={handleDownload}
          className="p-3 text-slate-400 hover:text-[var(--ink)] hover:bg-slate-50 transition-all rounded-sm group"
          title="Download PDF"
        >
          <Download size={18} className="group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
}
