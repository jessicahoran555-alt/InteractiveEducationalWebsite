// ============================================================
// AUTHENTICATION & ROLE TYPES
// ============================================================

export type UserRole = 'admin' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title?: string;
  studentId?: string;
  email?: string;
  avatar?: string;
  lastLogin?: string;
}

export interface AuthValidationResult {
  isValid: boolean;
  errors: {
    name?: string;
    password?: string;
    general?: string;
  };
}

// Rules for validation
export const AUTH_RULES = {
  MIN_NAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  NAME_RULE_TEXT: 'Name must be at least 3 characters long',
  PASSWORD_RULE_TEXT: 'Password must be at least 6 characters long',
};

export function validateAuthInput(name: string, password: string): AuthValidationResult {
  const errors: AuthValidationResult['errors'] = {};

  if (!name || name.trim().length < AUTH_RULES.MIN_NAME_LENGTH) {
    errors.name = AUTH_RULES.NAME_RULE_TEXT;
  }

  if (!password || password.length < AUTH_RULES.MIN_PASSWORD_LENGTH) {
    errors.password = AUTH_RULES.PASSWORD_RULE_TEXT;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ============================================================
// STUDENT "THE BASICS" TYPES
// ============================================================

export interface BasicTopic {
  id: string;
  title: string;
  subtitle: string;
  readTime: string;
  level: string;
  icon: string;
  summary: string;
  keyPoints: string[];
  clinicalRelevance: string;
}

export interface Flashcard {
  id: string;
  term: string;
  phonetic?: string;
  category: string;
  definition: string;
  example: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

// ============================================================
// ADMIN "ACADEMIC INFORMATION" TYPES
// ============================================================

export type AcademicStanding = "Dean's List" | 'Good Standing' | 'Academic Alert' | 'Probation';

export interface StudentAcademicRecord {
  id: string;
  studentId: string;
  name: string;
  email: string;
  program: string;
  year: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Graduate';
  gpa: number;
  standing: AcademicStanding;
  enrolledCourse: string;
  attendancePercent: number;
  completedCredits: number;
  quizAverage: number;
}

export interface AcademicCourse {
  code: string;
  name: string;
  creditHours: number;
  instructor: string;
  semester: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
  prerequisites: string;
  syllabusHighlights: string[];
}

export interface AcademicAnnouncement {
  id: string;
  title: string;
  date: string;
  author: string;
  priority: 'normal' | 'high' | 'urgent';
  content: string;
  targetAudience: 'All' | 'Undergraduate' | 'Faculty' | 'Graduate';
}
