import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  GripVertical 
} from 'lucide-react';
import { LessonFormModal } from '../../components/admin/LessonFormModal';

export default function AdminCourses() {
  const [levels, setLevels] = useState<any[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/levels')
      .then(res => res.json())
      .then(setLevels);
  }, []);

  const loadLessons = (levelId: string) => {
    fetch(`/api/admin/levels/${levelId}/lessons`)
      .then(res => res.json())
      .then(setLessons);
  };

  const selectLevel = (level: any) => {
    setSelectedLevel(level);
    loadLessons(level.id);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
        <p className="text-gray-500">Curriculum design and lesson management.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs uppercase font-bold tracking-widest text-gray-400">Curriculum Structure</h3>
          {levels.map((level) => (
            <button 
              key={level.id}
              onClick={() => selectLevel(level)}
              className={`w-full p-6 bg-white border rounded-2xl text-left transition-all group ${
                selectedLevel?.id === level.id 
                  ? 'border-[#FF5F1F] shadow-xl shadow-orange-500/5' 
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-gray-400 font-mono">{level.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${level.isFree ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {level.isFree ? 'Free' : 'Pro'}
                </span>
              </div>
              <h4 className="font-bold text-lg mb-1">{level.name}</h4>
              <p className="text-xs text-gray-500 font-medium mb-4">{level._count.lessons} lessons</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#FF5F1F] opacity-0 group-hover:opacity-100 transition-opacity">
                Manage lessons <Plus size={12} />
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {selectedLevel ? (
            <>
              <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black">{selectedLevel.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">Drag to reorder lessons</p>
                </div>
                <button 
                  onClick={() => { setEditingLesson(null); setIsModalOpen(true); }}
                  className="px-5 py-2.5 bg-[#1A1A1A] text-white rounded-xl text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-black/10"
                >
                  <Plus size={18} />
                  Add Lesson
                </button>
              </div>

              <div className="space-y-3">
                {lessons.map((lesson, idx) => (
                  <div 
                    key={lesson.id}
                    className="p-4 bg-white border border-gray-100 rounded-xl flex items-center gap-4 group hover:shadow-md transition-shadow"
                  >
                    <div className="cursor-move text-gray-300">
                      <GripVertical size={18} />
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center font-mono text-xs font-bold text-gray-400">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold">{lesson.title}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                        <span className="px-1.5 py-0.5 bg-gray-100 rounded">{lesson.type}</span>
                        <span>•</span>
                        <span>{lesson.duration}m</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingLesson(lesson); setIsModalOpen(true); }}
                        className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[400px] border-2 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center text-gray-400 italic">
              Select a level to manage its curriculum
            </div>
          )}
        </div>
      </div>

      <LessonFormModal 
        isOpen={isModalOpen}
        levelId={selectedLevel?.id}
        initialData={editingLesson}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); if (selectedLevel) loadLessons(selectedLevel.id); }}
      />
    </div>
  );
}
