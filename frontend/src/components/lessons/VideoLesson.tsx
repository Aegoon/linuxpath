import { Lesson } from '../../types';

interface VideoLessonProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function VideoLesson({ lesson, onComplete }: VideoLessonProps) {
  return (
    <div className="flex flex-col h-full p-6">
      <h1 className="text-white text-2xl font-semibold mb-2">{lesson.title}</h1>
      <p className="text-gray-400 text-sm mb-6">{lesson.description}</p>
      <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-6">
        <p className="text-gray-500 text-sm">Video player</p>
      </div>
      <button onClick={onComplete} className="bg-white text-black px-6 py-2.5 rounded font-medium text-sm w-fit">
        Mark as complete →
      </button>
    </div>
  );
}
