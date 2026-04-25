import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonFormModalProps {
  isOpen: boolean;
  levelId?: string;
  initialData?: any;
  onClose: () => void;
  onSuccess: () => void;
}

export const LessonFormModal: React.FC<LessonFormModalProps> = ({ 
  isOpen, 
  levelId, 
  initialData, 
  onClose, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    videoUrl: '',
    markdownContent: '',
    order: 1,
    duration: 5,
    levelId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        type: 'video',
        videoUrl: '',
        markdownContent: '',
        order: 1,
        duration: 5,
        levelId: levelId || ''
      });
    }
  }, [initialData, levelId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = initialData ? `/api/admin/lessons/${initialData.id}` : '/api/admin/lessons';
    const method = initialData ? 'PATCH' : 'POST';
    
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, levelId })
    });

    if (res.ok) onSuccess();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]" 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-3xl shadow-2xl p-8 z-[111]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black">{initialData ? 'Edit Lesson' : 'Add New Lesson'}</h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-sm font-medium">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Lesson Title</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5F1F]/20 focus:border-[#FF5F1F]"
                  placeholder="e.g. Introduction to Grep"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                  >
                    <option value="video">Video</option>
                    <option value="text">Text / Reading</option>
                    <option value="lab">Interactive Lab</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Duration (min)</label>
                  <input 
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {formData.type === 'video' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Video URL</label>
                  <input 
                    type="text"
                    value={formData.videoUrl}
                    onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none"
                    placeholder="Vimeo/YouTube/External URL"
                  />
                </div>
              )}

              {formData.type === 'text' && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Markdown Content</label>
                  <textarea 
                    value={formData.markdownContent}
                    onChange={e => setFormData({...formData, markdownContent: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none min-h-[150px] font-mono"
                    placeholder="Write your lesson in Markdown..."
                  />
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-4 bg-[#1A1A1A] text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-black/10 active:scale-95 transition-all"
                >
                  <Save size={20} />
                  {initialData ? 'Update Lesson' : 'Save Lesson'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
