import ReactMarkdown from 'react-markdown';
import { Lesson } from '../../types';

interface TextLessonProps {
  lesson: Lesson;
  onComplete: () => void;
}

export function TextLesson({ lesson, onComplete }: TextLessonProps) {
  return (
    <div className="flex flex-col h-full p-6 overflow-y-auto">
      <h1 className="text-white text-2xl font-semibold mb-2">{lesson.title}</h1>
      <p className="text-gray-400 text-sm mb-6">{lesson.description}</p>
      <div className="prose prose-invert prose-sm max-w-none flex-1">
        <ReactMarkdown>{lesson.content || '*No content yet.*'}</ReactMarkdown>
      </div>
      <button onClick={onComplete} className="bg-white text-black px-6 py-2.5 rounded font-medium text-sm w-fit mt-8">
        Mark as complete →
      </button>
    </div>
  );
}
