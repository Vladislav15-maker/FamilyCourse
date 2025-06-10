export type UserRole = 'student' | 'teacher';

export interface User {
  id: string;
  username: string;
  // In a real app, password would be hashed and not stored directly
  password?: string; // For mock auth only
  name: string;
  role: UserRole;
}

export interface Word {
  id: string;
  english: string;
  russian: string;
  phonetic: string; // e.g., "boy (бой)"
}

export interface Round {
  id: string;
  name: string; // e.g., "Round 1"
  words: Word[];
}

export interface Unit {
  id: string;
  name: string; // e.g., "Unit 1: Greetings"
  icon?: React.ElementType; // Lucide icon component
  rounds: Round[];
}

export interface StudentProgress {
  studentId: string;
  unitId: string;
  roundId: string;
  score: number; // Percentage 0-100
  incorrectWords?: string[]; // IDs of words answered incorrectly
  completedAt: Date;
}

export interface OfflineGrade {
  studentId: string;
  unitId: string;
  grade: number; // e.g., 2, 3, 4, 5
  gradedBy: string; // Teacher ID
  gradedAt: Date;
}

// For AI Personalized Practice Test
export interface TestQuestionItem {
  word: string;
  translation: string;
  options: string[];
}

export interface PersonalizedTest {
  studentId: string;
  unitId: string;
  questions: TestQuestionItem[];
  createdAt: Date;
}
