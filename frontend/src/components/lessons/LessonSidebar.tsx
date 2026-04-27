import { Lesson } from '../../types';

interface LessonSidebarProps {
  lessons: Lesson[];
  currentLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lesson: Lesson) => void;
}

export function LessonSidebar({ lessons, currentLessonId, completedLessonIds, onSelectLesson }: LessonSidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-800 bg-black h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-medium text-sm">Lessons</h2>
      </div>
      <nav className="p-2">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessonIds.includes(lesson.id);
          const isCurrent = lesson.id === currentLessonId;
          return (
            <button
              key={lesson.id}
              onClick={() => onSelectLesson(lesson)}
              className={`w-full text-left px-3 py-2.5 rounded text-sm flex items-center gap-3 mb-1 transition-colors ${
                isCurrent ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 text-xs ${
                isCompleted ? 'bg-green-500 border-green-500 text-white' : isCurrent ? 'border-blue-500 text-blue-500' : 'border-gray-600 text-gray-600'
              }`}>
                {isCompleted ? '✓' : index + 1}
              </span>
              <span className="truncate">{lesson.title}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
