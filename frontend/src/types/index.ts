export interface User {
  id: string;
  email: string;
  name?: string;
  avatarInitials?: string;
  level: 1 | 2 | 3 | 4 | 5;
  streak: number;
  xp: number;
  subscriptionActive: boolean;
  role?: 'student' | 'admin';
  isBanned?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: number;
  order: number;
  type: 'video' | 'text' | 'lab';
  quiz?: Quiz;
  challenge?: LabChallenge;
}

export interface LabChallenge {
  id: string;
  instruction: string;
  checkScript: string;
  hints: string[];
  answer?: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  type: 'multiple-choice' | 'command';
  expectedCommand?: string;
}

export interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
  completedAt: Date;
}
