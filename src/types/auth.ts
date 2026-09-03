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

export interface AuthRulesConfig {
  minNameLength: number;
  minPasswordLength: number;
  requireSpecialChar: boolean;
  allowRegistration: boolean;
  studentDefaultRoute: 'student-basics' | 'main';
  adminDefaultRoute: 'admin-academic' | 'main';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  role: UserRole | 'guest';
  action: 'sign_in' | 'register' | 'sign_out' | 'rule_update' | 'role_change';
  status: 'success' | 'failed';
  details: string;
}

export interface RolePermission {
  feature: string;
  description: string;
  guest: boolean;
  student: boolean;
  admin: boolean;
}

// Default static fallback rules
export const AUTH_RULES = {
  MIN_NAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 6,
  NAME_RULE_TEXT: 'Name must be at least 3 characters long',
  PASSWORD_RULE_TEXT: 'Password must be at least 6 characters long',
};

export function validateAuthInput(
  name: string,
  password: string,
  config?: Partial<AuthRulesConfig>
): AuthValidationResult {
  const errors: AuthValidationResult['errors'] = {};
  const minName = config?.minNameLength ?? AUTH_RULES.MIN_NAME_LENGTH;
  const minPass = config?.minPasswordLength ?? AUTH_RULES.MIN_PASSWORD_LENGTH;

  if (!name || name.trim().length < minName) {
    errors.name = `Name must be at least ${minName} characters long`;
  }

  if (!password || password.length < minPass) {
    errors.password = `Password must be at least ${minPass} characters long`;
  } else if (config?.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.password = 'Password must include at least one special character (!@#$%^&*)';
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
