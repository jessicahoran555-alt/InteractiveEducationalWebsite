import React, { useState } from 'react';
import { User, UserRole, AUTH_RULES, AuthRulesConfig, AuditLogEntry, validateAuthInput } from '../types/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  registeredUsers: User[];
  onRegisterUser: (user: User, password: string) => void;
  passwordsMap: Record<string, string>;
  rules?: AuthRulesConfig;
  onAddAuditLog?: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  registeredUsers,
  onRegisterUser,
  passwordsMap,
  rules,
  onAddAuditLog,
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === 'student') {
      const studentUser = registeredUsers.find((u) => u.name.toLowerCase() === 'student') || {
        id: 'usr_student_01',
        name: 'student',
        role: 'student' as UserRole,
        title: 'Microbiology Undergraduate (Year 2)',
        studentId: 'STU-2026-0842',
        email: 'alex.rivera@students.microsphere.edu',
        avatar: '🎓',
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onLoginSuccess(studentUser);
      onClose();
    } else {
      const adminUser = registeredUsers.find((u) => u.name.toLowerCase() === 'admin') || {
        id: 'usr_admin_01',
        name: 'admin',
        role: 'admin' as UserRole,
        title: 'Dean of Microbial Sciences & Academic Affairs',
        email: 'academic.admin@microsphere.edu',
        avatar: '🛡️',
        lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onLoginSuccess(adminUser);
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = validateAuthInput(name, password, rules);
    if (!validation.isValid) {
      const firstError = validation.errors.name || validation.errors.password || 'Please check your inputs.';
      setErrorMsg(firstError);
      onAddAuditLog?.({
        userName: name.trim() || 'Anonymous',
        role: 'guest',
        action: 'sign_in',
        status: 'failed',
        details: `Validation failed: ${firstError}`,
      });
      return;
    }

    const trimmedName = name.trim();

    if (mode === 'signin') {
      // Find existing user by name (case-insensitive)
      const existingUser = registeredUsers.find(
        (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (!existingUser) {
        setErrorMsg(
          `Account "${trimmedName}" not found. Please check spelling or switch to "Create Account" tab to register.`
        );
        onAddAuditLog?.({
          userName: trimmedName,
          role: 'guest',
          action: 'sign_in',
          status: 'failed',
          details: `Sign-in rejected: No user found with name "${trimmedName}".`,
        });
        return;
      }

      const expectedPassword = passwordsMap[existingUser.name] || passwordsMap[existingUser.name.toLowerCase()];
      if (expectedPassword && expectedPassword !== password) {
        setErrorMsg('Incorrect password for this account. Please try again.');
        onAddAuditLog?.({
          userName: existingUser.name,
          role: existingUser.role,
          action: 'sign_in',
          status: 'failed',
          details: 'Sign-in rejected: Incorrect password entered.',
        });
        return;
      }

      // Successful sign in
      const updatedUser: User = {
        ...existingUser,
        lastLogin: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      };
      onAddAuditLog?.({
        userName: updatedUser.name,
        role: updatedUser.role,
        action: 'sign_in',
        status: 'success',
        details: `Sign in successful. Routed to ${
          updatedUser.role === 'student' ? 'The Basics' : 'Academic Information'
        } under active policy rules.`,
      });
      onLoginSuccess(updatedUser);
      onClose();
    } else {
      // Register mode
      if (rules && !rules.allowRegistration) {
        setErrorMsg('New user registration is currently disabled by system policy.');
        return;
      }

      const nameExists = registeredUsers.some(
        (u) => u.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (nameExists) {
        setErrorMsg(`An account with the name "${trimmedName}" already exists. Please sign in instead.`);
        return;
      }

      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: trimmedName,
        role: role,
        title: role === 'admin' ? 'Academic Department Administrator' : 'Enrolled Microbiology Student',
        studentId: role === 'student' ? `STU-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        email: `${trimmedName.toLowerCase().replace(/\s+/g, '.')}@microsphere.edu`,
        avatar: role === 'admin' ? '🛡️' : '🎓',
        lastLogin: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      };

      onRegisterUser(newUser, password);
      onAddAuditLog?.({
        userName: newUser.name,
        role: newUser.role,
        action: 'register',
        status: 'success',
        details: `Account registered as ${newUser.role}. Complies with Name (>=${
          rules?.minNameLength ?? 3
        }) and Password (>=${rules?.minPasswordLength ?? 6}) rules.`,
      });
      onLoginSuccess(newUser);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(2, 11, 24, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-7 md:p-8 relative transition-all"
        style={{
          background: 'linear-gradient(145deg, rgba(7, 21, 37, 0.95), rgba(4, 13, 26, 0.98))',
          border: '1px solid rgba(20, 184, 166, 0.25)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(20, 184, 166, 0.15)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle, rgba(20,184,166,0.25), rgba(34,211,238,0.08))',
              border: '1px solid rgba(20,184,166,0.4)',
            }}
          >
            <span className="text-2xl">🔐</span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            {mode === 'signin' ? 'Sign In to MicroSphere' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Students unlock <strong className="text-teal-400">The Basics</strong> &bull; Admins unlock{' '}
            <strong className="text-cyan-400">Academic Information</strong>
          </p>
        </div>

        {/* Quick Demo Login Bar */}
        <div
          className="rounded-2xl p-3 mb-5"
          style={{
            background: 'rgba(2, 11, 24, 0.6)',
            border: '1px dashed rgba(20, 184, 166, 0.25)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Quick 1-Click Demo Login
            </span>
            <span className="text-[10px] font-mono text-teal-400">Preset credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium font-display transition-all"
              style={{
                background: 'rgba(20, 184, 166, 0.15)',
                border: '1px solid rgba(20, 184, 166, 0.35)',
                color: '#2dd4bf',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(20, 184, 166, 0.28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(20, 184, 166, 0.15)';
              }}
            >
              <span>🎓</span>
              <span>Student (Basics)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-medium font-display transition-all"
              style={{
                background: 'rgba(34, 211, 238, 0.15)',
                border: '1px solid rgba(34, 211, 238, 0.35)',
                color: '#67e8f9',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(34, 211, 238, 0.28)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(34, 211, 238, 0.15)';
              }}
            >
              <span>🛡️</span>
              <span>Admin (Academic)</span>
            </button>
          </div>
          <div className="text-[10px] text-slate-400 mt-2 text-center font-mono">
            Demo passwords: <span className="text-teal-300">student123</span> / <span className="text-cyan-300">admin123</span>
          </div>
        </div>

        {/* Tab Toggle: Sign In vs Register */}
        <div className="flex rounded-xl p-1 mb-5" style={{ background: 'rgba(2, 11, 24, 0.8)' }}>
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-display font-semibold rounded-lg transition-all ${
              mode === 'signin' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{
              background: mode === 'signin' ? 'rgba(20, 184, 166, 0.3)' : 'transparent',
              border: mode === 'signin' ? '1px solid rgba(20, 184, 166, 0.4)' : '1px solid transparent',
            }}
          >
            Sign In with Rules
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 text-xs font-display font-semibold rounded-lg transition-all ${
              mode === 'register' ? 'text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{
              background: mode === 'register' ? 'rgba(34, 211, 238, 0.3)' : 'transparent',
              border: mode === 'register' ? '1px solid rgba(34, 211, 238, 0.4)' : '1px solid transparent',
            }}
          >
            Register New Account
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div
            className="mb-4 p-3 rounded-xl text-xs font-sans flex items-start gap-2 animate-fadeIn"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#fca5a5',
            }}
          >
            <span className="text-sm shrink-0">⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-medium text-slate-300">
                User Name <span className="text-teal-400">*</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">Min. {AUTH_RULES.MIN_NAME_LENGTH} chars</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={mode === 'signin' ? 'e.g., student or admin' : 'Your full name / username'}
                required
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-sans text-white placeholder-slate-500 focus:outline-none transition-all"
                style={{
                  background: 'rgba(2, 11, 24, 0.7)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#14b8a6';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(20, 184, 166, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-medium text-slate-300">
                Password <span className="text-teal-400">*</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">Min. {AUTH_RULES.MIN_PASSWORD_LENGTH} chars</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl text-sm font-sans text-white placeholder-slate-500 focus:outline-none transition-all"
                style={{
                  background: 'rgba(2, 11, 24, 0.7)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#14b8a6';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(20, 184, 166, 0.25)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                tabIndex={-1}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Role Picker (Visible in Register mode, or informative in signin) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Select Account Role <span className="text-teal-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: role === 'student' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(2, 11, 24, 0.5)',
                    border:
                      role === 'student'
                        ? '2px solid rgba(20, 184, 166, 0.8)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🎓</span>
                    <span className="font-display font-semibold text-xs text-white">Student</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Access <strong className="text-teal-300">The Basics</strong> learning portal, quizzes & cards
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className="p-3 rounded-xl text-left transition-all"
                  style={{
                    background: role === 'admin' ? 'rgba(34, 211, 238, 0.2)' : 'rgba(2, 11, 24, 0.5)',
                    border:
                      role === 'admin'
                        ? '2px solid rgba(34, 211, 238, 0.8)'
                        : '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🛡️</span>
                    <span className="font-display font-semibold text-xs text-white">Admin</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Access <strong className="text-cyan-300">Academic Information</strong>, rosters & curriculum
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Rules info pill */}
          <div
            className="p-2.5 rounded-xl text-[11px] font-mono text-slate-400 flex items-start gap-2"
            style={{ background: 'rgba(2, 11, 24, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            <span className="text-teal-400">ℹ️</span>
            <div>
              <span className="text-slate-300 font-semibold">Active Rules Enforced: </span>
              Name &ge; {rules?.minNameLength ?? AUTH_RULES.MIN_NAME_LENGTH} chars, Password &ge;{' '}
              {rules?.minPasswordLength ?? AUTH_RULES.MIN_PASSWORD_LENGTH} chars
              {rules?.requireSpecialChar ? ' (+ special character required)' : ''}.
              Role routing: Students $\rightarrow$ The Basics; Admins $\rightarrow$ Academic Information.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200 mt-2"
            style={{
              background:
                mode === 'signin'
                  ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                  : 'linear-gradient(135deg, #22d3ee, #0891b2)',
              color: '#020b18',
              boxShadow: '0 0 20px rgba(20, 184, 166, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(20, 184, 166, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(20, 184, 166, 0.3)';
            }}
          >
            {mode === 'signin' ? 'Sign In' : `Register as ${role === 'admin' ? 'Admin' : 'Student'}`}
          </button>
        </form>
      </div>
    </div>
  );
}
