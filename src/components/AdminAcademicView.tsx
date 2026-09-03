import React, { useState } from 'react';
import {
  User,
  UserRole,
  StudentAcademicRecord,
  AcademicCourse,
  AcademicAnnouncement,
  AcademicStanding,
  AuthRulesConfig,
  AuditLogEntry,
} from '../types/auth';
import {
  INITIAL_STUDENT_ROSTER,
  ACADEMIC_COURSES,
  INITIAL_ANNOUNCEMENTS,
  ROLE_PERMISSIONS_MATRIX,
  DEFAULT_AUTH_RULES,
} from '../services/mockData';

interface AdminAcademicViewProps {
  user: User;
  onExploreFullSite: () => void;
  rules: AuthRulesConfig;
  onUpdateRules: (newRules: AuthRulesConfig) => void;
  registeredUsers: User[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
  onDeleteUser: (userId: string) => void;
  auditLogs: AuditLogEntry[];
  onClearAuditLogs: () => void;
}

export default function AdminAcademicView({
  user,
  onExploreFullSite,
  rules,
  onUpdateRules,
  registeredUsers,
  onUpdateUserRole,
  onDeleteUser,
  auditLogs,
  onClearAuditLogs,
}: AdminAcademicViewProps) {
  const [activeTab, setActiveTab] = useState<
    'roster' | 'courses' | 'analytics' | 'announcements' | 'rules'
  >('roster');

  // Local rules editor state
  const [localRules, setLocalRules] = useState<AuthRulesConfig>(rules);
  const [ruleSaveToast, setRuleSaveToast] = useState<string | null>(null);

  const handleSaveRules = () => {
    onUpdateRules(localRules);
    setRuleSaveToast('Authentication & Role rules successfully updated and enforced live!');
    setTimeout(() => setRuleSaveToast(null), 3500);
  };

  // Student roster state (stored and modifiable)
  const [roster, setRoster] = useState<StudentAcademicRecord[]>(() => {
    const saved = localStorage.getItem('microsphere_student_roster');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_STUDENT_ROSTER;
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<AcademicAnnouncement[]>(() => {
    const saved = localStorage.getItem('microsphere_announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // Filters for roster
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStanding, setSelectedStanding] = useState<string>('All');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('All');

  // New Student Record Modal State
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentProgram, setNewStudentProgram] = useState('B.S. Microbiology');
  const [newStudentYear, setNewStudentYear] = useState<StudentAcademicRecord['year']>('1st Year');
  const [newStudentGpa, setNewStudentGpa] = useState('3.80');
  const [newStudentCourse, setNewStudentCourse] = useState('MICR-101: Fundamentals of Microbiology');
  const [newStudentAttendance, setNewStudentAttendance] = useState('95');

  // New Announcement Form State
  const [isAddNoticeOpen, setIsAddNoticeOpen] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeAudience, setNoticeAudience] = useState<AcademicAnnouncement['targetAudience']>('All');
  const [noticePriority, setNoticePriority] = useState<AcademicAnnouncement['priority']>('normal');
  const [noticeContent, setNoticeContent] = useState('');

  // Editing student grade state
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editGpaValue, setEditGpaValue] = useState<string>('');
  const [editStandingValue, setEditStandingValue] = useState<AcademicStanding>('Good Standing');

  const saveRoster = (newRoster: StudentAcademicRecord[]) => {
    setRoster(newRoster);
    localStorage.setItem('microsphere_student_roster', JSON.stringify(newRoster));
  };

  const saveAnnouncements = (newAnn: AcademicAnnouncement[]) => {
    setAnnouncements(newAnn);
    localStorage.setItem('microsphere_announcements', JSON.stringify(newAnn));
  };

  // Add student handler
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    const gpaNum = parseFloat(newStudentGpa) || 3.0;
    let standing: AcademicStanding = 'Good Standing';
    if (gpaNum >= 3.75) standing = "Dean's List";
    else if (gpaNum < 2.5) standing = 'Probation';
    else if (gpaNum < 3.0) standing = 'Academic Alert';

    const newRecord: StudentAcademicRecord = {
      id: `rec-${Date.now()}`,
      studentId: `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newStudentName.trim(),
      email: `${newStudentName.toLowerCase().replace(/\s+/g, '.')}@students.microsphere.edu`,
      program: newStudentProgram,
      year: newStudentYear,
      gpa: parseFloat(gpaNum.toFixed(2)),
      standing,
      enrolledCourse: newStudentCourse,
      attendancePercent: parseInt(newStudentAttendance) || 90,
      completedCredits: newStudentYear === '1st Year' ? 16 : newStudentYear === '2nd Year' ? 44 : 76,
      quizAverage: Math.round(gpaNum * 24),
    };

    saveRoster([newRecord, ...roster]);
    setNewStudentName('');
    setIsAddStudentOpen(false);
  };

  // Edit grade handler
  const handleStartEditGrade = (rec: StudentAcademicRecord) => {
    setEditingStudentId(rec.id);
    setEditGpaValue(rec.gpa.toString());
    setEditStandingValue(rec.standing);
  };

  const handleSaveGrade = (recId: string) => {
    const parsedGpa = parseFloat(editGpaValue) || 3.0;
    const updated = roster.map((rec) => {
      if (rec.id === recId) {
        return {
          ...rec,
          gpa: parseFloat(parsedGpa.toFixed(2)),
          standing: editStandingValue,
        };
      }
      return rec;
    });
    saveRoster(updated);
    setEditingStudentId(null);
  };

  const handleDeleteStudent = (recId: string) => {
    if (confirm('Are you sure you want to remove this academic record?')) {
      const updated = roster.filter((r) => r.id !== recId);
      saveRoster(updated);
    }
  };

  // Add announcement handler
  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const newNotice: AcademicAnnouncement = {
      id: `ann-${Date.now()}`,
      title: noticeTitle.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      author: user.name || 'Academic Administrator',
      priority: noticePriority,
      targetAudience: noticeAudience,
      content: noticeContent.trim(),
    };

    saveAnnouncements([newNotice, ...announcements]);
    setNoticeTitle('');
    setNoticeContent('');
    setIsAddNoticeOpen(false);
  };

  // Filtered roster
  const filteredRoster = roster.filter((rec) => {
    const matchesSearch =
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.program.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStanding = selectedStanding === 'All' || rec.standing === selectedStanding;
    const matchesCourse =
      selectedCourseFilter === 'All' || rec.enrolledCourse.includes(selectedCourseFilter);
    return matchesSearch && matchesStanding && matchesCourse;
  });

  // Metrics calculation
  const totalStudents = roster.length;
  const avgGpa =
    totalStudents > 0
      ? (roster.reduce((acc, r) => acc + r.gpa, 0) / totalStudents).toFixed(2)
      : '0.00';
  const deansListCount = roster.filter((r) => r.standing === "Dean's List").length;
  const avgAttendance =
    totalStudents > 0
      ? Math.round(roster.reduce((acc, r) => acc + r.attendancePercent, 0) / totalStudents)
      : 0;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Admin Academic Header */}
      <div
        className="rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(7, 21, 37, 0.95) 0%, rgba(3, 16, 32, 0.98) 100%)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 35px rgba(34, 211, 238, 0.1)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{
                background: 'radial-gradient(circle, rgba(34, 211, 238, 0.3), rgba(20, 184, 166, 0.1))',
                border: '1px solid rgba(34, 211, 238, 0.5)',
              }}
            >
              {user.avatar || '🛡️'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{
                    background: 'rgba(34, 211, 238, 0.2)',
                    color: '#67e8f9',
                    border: '1px solid rgba(34, 211, 238, 0.4)',
                  }}
                >
                  Admin &bull; Academic Portal
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Role: <strong className="text-cyan-300">Administrator</strong>
                </span>
              </div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-white">
                Academic Information Management
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Signed in as <strong className="text-white">{user.name}</strong> ({user.title || 'Department Administrator'}).
                Managing department rosters, GPAs, courses, and institutional curriculum.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:self-center">
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #0891b2)',
                color: '#020b18',
                boxShadow: '0 0 15px rgba(34, 211, 238, 0.3)',
              }}
            >
              <span>➕</span>
              <span>Enroll New Student</span>
            </button>
            <button
              onClick={onExploreFullSite}
              className="px-4 py-2.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-2"
              style={{
                background: 'rgba(34, 211, 238, 0.1)',
                border: '1px solid rgba(34, 211, 238, 0.3)',
                color: '#67e8f9',
              }}
            >
              <span>🌐</span>
              <span>Browse Site</span>
            </button>
          </div>
        </div>

        {/* Academic Key Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-900/30">
            <div className="text-[11px] font-mono text-slate-400">Total Enrolled</div>
            <div className="text-2xl font-display font-black text-cyan-300">{totalStudents} Students</div>
            <div className="text-[10px] text-slate-500 font-mono mt-0.5">Across 4 core sections</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-teal-900/30">
            <div className="text-[11px] font-mono text-slate-400">Department Avg GPA</div>
            <div className="text-2xl font-display font-black text-teal-300">{avgGpa} / 4.0</div>
            <div className="text-[10px] text-teal-400 font-mono mt-0.5">&uarr; +0.12 vs last term</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-purple-900/30">
            <div className="text-[11px] font-mono text-slate-400">Dean's Honor List</div>
            <div className="text-2xl font-display font-black text-purple-300">{deansListCount} Scholars</div>
            <div className="text-[10px] text-purple-400 font-mono mt-0.5">GPA &ge; 3.75 threshold</div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-emerald-900/30">
            <div className="text-[11px] font-mono text-slate-400">Avg Lab Attendance</div>
            <div className="text-2xl font-display font-black text-emerald-300">{avgAttendance}%</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">High laboratory adherence</div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-slate-900/80 border border-cyan-900/40">
        {[
          { id: 'roster', label: '👥 Student Academic Roster', count: `${roster.length} Records` },
          { id: 'courses', label: '📚 Course Curriculum & Syllabi', count: '4 Courses' },
          { id: 'analytics', label: '📊 Grade Distribution & Stats', count: 'Analytics' },
          { id: 'announcements', label: '📢 Academic Announcements', count: `${announcements.length} Notices` },
          { id: 'rules', label: '🛡️ Rules & Access Control', count: 'Active Policy' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-semibold transition-all ${
              activeTab === tab.id ? 'text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.35), rgba(20, 184, 166, 0.2))'
                  : 'transparent',
              border:
                activeTab === tab.id ? '1px solid rgba(34, 211, 238, 0.5)' : '1px solid transparent',
            }}
          >
            <span>{tab.label}</span>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                background: activeTab === tab.id ? 'rgba(34, 211, 238, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === tab.id ? '#67e8f9' : '#64748b',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: STUDENT ACADEMIC ROSTER */}
      {/* ============================================================ */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search by student name, ID, or degree program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                style={{
                  background: 'rgba(7, 21, 37, 0.8)',
                  border: '1px solid rgba(34, 211, 238, 0.25)',
                }}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">🔍</span>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedStanding}
                onChange={(e) => setSelectedStanding(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-sans text-slate-200 focus:outline-none"
                style={{ background: 'rgba(7, 21, 37, 0.8)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
              >
                <option value="All">All Standings</option>
                <option value="Dean's List">Dean's List</option>
                <option value="Good Standing">Good Standing</option>
                <option value="Academic Alert">Academic Alert</option>
                <option value="Probation">Probation</option>
              </select>

              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-sans text-slate-200 focus:outline-none"
                style={{ background: 'rgba(7, 21, 37, 0.8)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
              >
                <option value="All">All Courses</option>
                <option value="MICR-101">MICR-101</option>
                <option value="MICR-204">MICR-204</option>
                <option value="MICR-310">MICR-310</option>
                <option value="MICR-420">MICR-420</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          <div
            className="rounded-3xl overflow-hidden border border-cyan-950/60"
            style={{ background: 'rgba(7, 21, 37, 0.75)', backdropFilter: 'blur(12px)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr
                    className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 border-b border-cyan-900/40"
                    style={{ background: 'rgba(2, 11, 24, 0.8)' }}
                  >
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Program & Year</th>
                    <th className="py-3.5 px-4">Course Enrolled</th>
                    <th className="py-3.5 px-4 text-center">GPA</th>
                    <th className="py-3.5 px-4">Academic Standing</th>
                    <th className="py-3.5 px-4 text-center">Attendance</th>
                    <th className="py-3.5 px-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredRoster.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                        No student records match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredRoster.map((rec) => {
                      const isEditing = editingStudentId === rec.id;

                      let standingBadgeStyle = {
                        background: 'rgba(34, 211, 238, 0.15)',
                        color: '#67e8f9',
                        border: '1px solid rgba(34, 211, 238, 0.4)',
                      };
                      if (rec.standing === "Dean's List") {
                        standingBadgeStyle = {
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#6ee7b7',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                        };
                      } else if (rec.standing === 'Academic Alert') {
                        standingBadgeStyle = {
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fcd34d',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                        };
                      } else if (rec.standing === 'Probation') {
                        standingBadgeStyle = {
                          background: 'rgba(239, 68, 68, 0.15)',
                          color: '#fca5a5',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                        };
                      }

                      return (
                        <tr
                          key={rec.id}
                          className="hover:bg-cyan-950/20 transition-colors"
                        >
                          {/* Student identity */}
                          <td className="py-3 px-4">
                            <div className="font-display font-semibold text-white">{rec.name}</div>
                            <div className="text-[11px] font-mono text-slate-400">{rec.studentId}</div>
                            <div className="text-[10px] text-slate-500">{rec.email}</div>
                          </td>

                          {/* Program */}
                          <td className="py-3 px-4">
                            <div className="text-slate-200">{rec.program}</div>
                            <div className="text-[11px] text-teal-400 font-mono">{rec.year} &bull; {rec.completedCredits} cr</div>
                          </td>

                          {/* Course */}
                          <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                            {rec.enrolledCourse}
                          </td>

                          {/* GPA */}
                          <td className="py-3 px-4 text-center">
                            {isEditing ? (
                              <input
                                type="number"
                                step="0.01"
                                min="0.00"
                                max="4.00"
                                value={editGpaValue}
                                onChange={(e) => setEditGpaValue(e.target.value)}
                                className="w-16 px-1.5 py-1 text-center font-mono text-xs rounded bg-slate-900 border border-cyan-400 text-white"
                              />
                            ) : (
                              <span
                                className={`font-mono font-bold text-sm ${
                                  rec.gpa >= 3.75
                                    ? 'text-emerald-400'
                                    : rec.gpa >= 3.0
                                    ? 'text-cyan-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                {rec.gpa.toFixed(2)}
                              </span>
                            )}
                          </td>

                          {/* Standing */}
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <select
                                value={editStandingValue}
                                onChange={(e) => setEditStandingValue(e.target.value as AcademicStanding)}
                                className="px-2 py-1 text-xs rounded bg-slate-900 border border-cyan-400 text-white"
                              >
                                <option value="Dean's List">Dean's List</option>
                                <option value="Good Standing">Good Standing</option>
                                <option value="Academic Alert">Academic Alert</option>
                                <option value="Probation">Probation</option>
                              </select>
                            ) : (
                              <span
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-mono inline-block"
                                style={standingBadgeStyle}
                              >
                                {rec.standing}
                              </span>
                            )}
                          </td>

                          {/* Attendance */}
                          <td className="py-3 px-4 text-center font-mono">
                            <span
                              className={
                                rec.attendancePercent >= 90
                                  ? 'text-emerald-400'
                                  : rec.attendancePercent >= 75
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                              }
                            >
                              {rec.attendancePercent}%
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleSaveGrade(rec.id)}
                                  className="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold text-[11px]"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingStudentId(null)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleStartEditGrade(rec)}
                                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline"
                                >
                                  Update Grade
                                </button>
                                <span className="text-slate-700">&bull;</span>
                                <button
                                  onClick={() => handleDeleteStudent(rec.id)}
                                  className="text-[11px] font-mono text-red-400 hover:text-red-300"
                                >
                                  Drop
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: COURSE CURRICULUM & SYLLABI */}
      {/* ============================================================ */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACADEMIC_COURSES.map((course) => {
            const fillPercent = Math.round((course.enrolled / course.capacity) * 100);

            return (
              <div
                key={course.code}
                className="rounded-3xl p-6 transition-all"
                style={{
                  background: 'rgba(7, 21, 37, 0.75)',
                  border: '1px solid rgba(34, 211, 238, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2.5 py-0.5 rounded-full">
                      {course.code} &bull; {course.creditHours} Credit Hours
                    </span>
                    <h3 className="font-display font-bold text-xl text-white mt-2">
                      {course.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg">
                    {course.semester}
                  </span>
                </div>

                {/* Faculty & Logistics */}
                <div className="space-y-1.5 text-xs text-slate-300 font-sans my-4 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div>
                    <strong className="text-slate-400 font-mono">Lead Instructor: </strong>
                    <span className="text-white">{course.instructor}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 font-mono">Schedule: </strong>
                    <span className="text-teal-300">{course.schedule}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 font-mono">Location: </strong>
                    <span className="text-slate-300">{course.room}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400 font-mono">Prerequisites: </strong>
                    <span className="text-slate-400 italic">{course.prerequisites}</span>
                  </div>
                </div>

                {/* Enrollment Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Class Enrollment Capacity</span>
                    <span className="text-cyan-400">
                      {course.enrolled} / {course.capacity} seats ({fillPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${fillPercent}%`,
                        background:
                          fillPercent >= 90
                            ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                            : 'linear-gradient(90deg, #14b8a6, #22d3ee)',
                      }}
                    />
                  </div>
                </div>

                {/* Syllabus Topics */}
                <div>
                  <h4 className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
                    Syllabus Highlights & Learning Objectives
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-400">
                    {course.syllabusHighlights.map((topic, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-teal-400 shrink-0">&bull;</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: GRADE DISTRIBUTION & ANALYTICS */}
      {/* ============================================================ */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Grade Tier A */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-emerald-400 font-semibold">Tier A (3.70 – 4.00)</span>
                <span className="text-xl">🏆</span>
              </div>
              <div className="text-3xl font-display font-black text-emerald-300">
                {Math.round((roster.filter((r) => r.gpa >= 3.7).length / (roster.length || 1)) * 100)}%
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {roster.filter((r) => r.gpa >= 3.7).length} students qualified for Dean's Academic Honors.
              </p>
            </div>

            {/* Grade Tier B */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.3)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-cyan-400 font-semibold">Tier B (3.00 – 3.69)</span>
                <span className="text-xl">📈</span>
              </div>
              <div className="text-3xl font-display font-black text-cyan-300">
                {Math.round(
                  (roster.filter((r) => r.gpa >= 3.0 && r.gpa < 3.7).length / (roster.length || 1)) * 100
                )}%
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {roster.filter((r) => r.gpa >= 3.0 && r.gpa < 3.7).length} students in solid Good Standing.
              </p>
            </div>

            {/* Support Tier */}
            <div
              className="p-5 rounded-2xl"
              style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-amber-400 font-semibold">Under 3.0 (Intervention)</span>
                <span className="text-xl">⚠️</span>
              </div>
              <div className="text-3xl font-display font-black text-amber-300">
                {Math.round((roster.filter((r) => r.gpa < 3.0).length / (roster.length || 1)) * 100)}%
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {roster.filter((r) => r.gpa < 3.0).length} students assigned to peer tutoring or academic coaching.
              </p>
            </div>
          </div>

          {/* Academic Policy Summary */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.7)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
          >
            <h3 className="font-display font-bold text-lg text-white mb-3">
              Departmental Grading Ledger & Criteria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-mono text-cyan-300 uppercase mb-2">Grading Weight Distribution</h4>
                <ul className="space-y-1 text-slate-400">
                  <li>&bull; Laboratory Practicums & Microscopy Staining: <strong className="text-slate-200">30%</strong></li>
                  <li>&bull; Midterm Comprehensive Exam: <strong className="text-slate-200">25%</strong></li>
                  <li>&bull; Final Written Examination & Case Study: <strong className="text-slate-200">30%</strong></li>
                  <li>&bull; Weekly Microbe Quizzes & Attendance: <strong className="text-slate-200">15%</strong></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h4 className="font-mono text-teal-300 uppercase mb-2">Accreditation Standards</h4>
                <p className="text-slate-400">
                  All courses follow ASM (American Society for Microbiology) curriculum guidelines for
                  undergraduate microbiology education, with mandated biosafety Level 2 training.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: ACADEMIC ANNOUNCEMENTS & NOTICES */}
      {/* ============================================================ */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-white">Department Announcements Board</h3>
              <p className="text-xs text-slate-400">Official directives, exam timetables, and academic bulletins</p>
            </div>
            <button
              onClick={() => setIsAddNoticeOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-1.5"
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: '#020b18',
              }}
            >
              <span>✍️</span>
              <span>Publish Notice</span>
            </button>
          </div>

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="rounded-2xl p-5 transition-all"
                style={{
                  background: 'rgba(7, 21, 37, 0.7)',
                  border:
                    ann.priority === 'urgent'
                      ? '1px solid rgba(239, 68, 68, 0.4)'
                      : ann.priority === 'high'
                      ? '1px solid rgba(245, 158, 11, 0.4)'
                      : '1px solid rgba(34, 211, 238, 0.2)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        ann.priority === 'urgent'
                          ? 'bg-red-950/80 text-red-300 border border-red-800'
                          : ann.priority === 'high'
                          ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          : 'bg-cyan-950/80 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {ann.priority} priority
                    </span>
                    <span className="text-xs font-mono text-slate-500">&bull; Audience: {ann.targetAudience}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{ann.date}</span>
                </div>

                <h4 className="font-display font-bold text-base text-white mb-2">{ann.title}</h4>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mb-3">{ann.content}</p>

                <div className="text-[11px] font-mono text-slate-400">
                  Signed: <strong className="text-slate-300">{ann.author}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: RULES & ACCESS CONTROL DASHBOARD */}
      {/* ============================================================ */}
      {activeTab === 'rules' && (
        <div className="space-y-8">
          {/* Header & Status Banner */}
          <div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12), rgba(34, 211, 238, 0.08))',
              border: '1px solid rgba(20, 184, 166, 0.3)',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                    Rules System Active & Enforced
                  </span>
                </div>
                <h3 className="font-display font-bold text-xl text-white">
                  Authentication & Role-Based Access Control (RBAC) Dashboard
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  These rules dictate authentication constraints (Name & Password length, complexity) and
                  strictly govern which views are delivered upon login: <strong>Students</strong> appear <strong>The Basics</strong>,
                  while <strong>Admins</strong> show <strong>Academic Information</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLocalRules(DEFAULT_AUTH_RULES);
                    onUpdateRules(DEFAULT_AUTH_RULES);
                    setRuleSaveToast('Default rules restored!');
                    setTimeout(() => setRuleSaveToast(null), 3000);
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-500 transition-colors"
                >
                  Reset Defaults
                </button>
              </div>
            </div>

            {ruleSaveToast && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <span>✅</span>
                <span>{ruleSaveToast}</span>
              </div>
            )}
          </div>

          {/* Section 1: Dynamic Rule Configuration Form */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.75)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <span>⚙️</span> Authentication Constraints & Policies
                </h4>
                <p className="text-xs text-slate-400">Modify login verification rules in real-time</p>
              </div>
              <button
                type="button"
                onClick={handleSaveRules}
                className="px-5 py-2.5 rounded-xl text-xs font-display font-semibold transition-all shadow-md self-start sm:self-auto"
                style={{
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                  color: '#020b18',
                }}
              >
                Save & Enforce Rules
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Min Name Length */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono text-slate-300 font-medium">Minimum Name Length</label>
                  <span className="text-xs font-mono text-teal-400 font-bold px-2 py-0.5 rounded bg-teal-950/60 border border-teal-800">
                    {localRules.minNameLength} chars
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={10}
                  value={localRules.minNameLength}
                  onChange={(e) => setLocalRules({ ...localRules, minNameLength: parseInt(e.target.value) })}
                  className="w-full accent-teal-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-2">
                  Names with fewer than {localRules.minNameLength} characters will be rejected during sign in and registration.
                </p>
              </div>

              {/* Min Password Length */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-mono text-slate-300 font-medium">Minimum Password Length</label>
                  <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800">
                    {localRules.minPasswordLength} chars
                  </span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={16}
                  value={localRules.minPasswordLength}
                  onChange={(e) => setLocalRules({ ...localRules, minPasswordLength: parseInt(e.target.value) })}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500 mt-2">
                  Passwords with fewer than {localRules.minPasswordLength} characters are prohibited.
                </p>
              </div>

              {/* Special Character Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-slate-200 font-semibold mb-1">
                    Require Special Characters
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Mandate symbols like (!@#$%^&*) in passwords
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localRules.requireSpecialChar}
                  onChange={(e) => setLocalRules({ ...localRules, requireSpecialChar: e.target.checked })}
                  className="w-5 h-5 rounded accent-teal-400 cursor-pointer"
                />
              </div>

              {/* Allow Registration Toggle */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono text-slate-200 font-semibold mb-1">
                    Allow Self-Registration
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Allow visitors to register new Student or Admin accounts
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={localRules.allowRegistration}
                  onChange={(e) => setLocalRules({ ...localRules, allowRegistration: e.target.checked })}
                  className="w-5 h-5 rounded accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role-Based Access Control (RBAC) Matrix */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.75)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
          >
            <div className="mb-4">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <span>📋</span> Role-Based Permission Mapping Matrix
              </h4>
              <p className="text-xs text-slate-400">
                Visual relationship between Roles (Guest, Student, Admin) and platform capabilities
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono text-[11px]">
                    <th className="p-3.5">Platform Capability / Feature</th>
                    <th className="p-3.5">Feature Description</th>
                    <th className="p-3.5 text-center">Guest</th>
                    <th className="p-3.5 text-center text-teal-400">Student (The Basics)</th>
                    <th className="p-3.5 text-center text-cyan-400">Admin (Academic)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ROLE_PERMISSIONS_MATRIX.map((perm, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 font-display font-semibold text-white">{perm.feature}</td>
                      <td className="p-3.5 text-slate-400">{perm.description}</td>
                      <td className="p-3.5 text-center">
                        {perm.guest ? <span className="text-emerald-400 font-bold">✓</span> : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="p-3.5 text-center bg-teal-950/10">
                        {perm.student ? <span className="text-teal-400 font-bold text-sm">✓</span> : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="p-3.5 text-center bg-cyan-950/10">
                        {perm.admin ? <span className="text-cyan-400 font-bold text-sm">✓</span> : <span className="text-slate-600">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: User Accounts & Live Role Management */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.75)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <span>👥</span> Registered User Accounts & Live Role Assignment
                </h4>
                <p className="text-xs text-slate-400">
                  Promote or reassign roles directly. Changes immediately affect their access upon sign in.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
                {registeredUsers.length} Active Accounts
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-mono text-[11px]">
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Assigned Role</th>
                    <th className="p-3.5">Effective Landing View</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {registeredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3.5 flex items-center gap-2.5">
                        <span className="text-xl">{u.avatar || (u.role === 'admin' ? '🛡️' : '🎓')}</span>
                        <div>
                          <div className="font-display font-semibold text-white">{u.name}</div>
                          <div className="text-[10px] font-mono text-slate-500">{u.title || 'Platform Member'}</div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300 text-[11px]">{u.email || '—'}</td>
                      <td className="p-3.5">
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono focus:outline-none cursor-pointer"
                          style={{
                            background: u.role === 'admin' ? 'rgba(34, 211, 238, 0.15)' : 'rgba(20, 184, 166, 0.15)',
                            color: u.role === 'admin' ? '#67e8f9' : '#2dd4bf',
                            border: u.role === 'admin' ? '1px solid rgba(34, 211, 238, 0.4)' : '1px solid rgba(20, 184, 166, 0.4)',
                          }}
                        >
                          <option value="student">🎓 Student</option>
                          <option value="admin">🛡️ Admin</option>
                        </select>
                      </td>
                      <td className="p-3.5 font-mono text-[11px]">
                        {u.role === 'student' ? (
                          <span className="text-teal-400">📖 The Basics Portal</span>
                        ) : (
                          <span className="text-cyan-400">📊 Academic Information</span>
                        )}
                      </td>
                      <td className="p-3.5 text-right">
                        {u.name !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => onDeleteUser(u.id)}
                            className="text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Real-time Authentication & Security Audit Trail */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.75)', border: '1px solid rgba(20, 184, 166, 0.2)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                  <span>📜</span> Real-Time Security & Sign-in Audit Log
                </h4>
                <p className="text-xs text-slate-400">
                  Chronological record of login rule validations, role routings, and policy checks
                </p>
              </div>
              <button
                type="button"
                onClick={onClearAuditLogs}
                className="text-xs font-mono text-slate-400 hover:text-red-400 px-3 py-1 rounded-lg border border-slate-800 hover:border-red-900 transition-colors"
              >
                Clear Log
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <div className="p-6 text-center text-xs font-mono text-slate-500 bg-slate-900/40 rounded-2xl">
                  No audit entries recorded yet.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    style={{
                      background: log.status === 'success' ? 'rgba(16, 185, 129, 0.06)' : 'rgba(239, 68, 68, 0.08)',
                      border: log.status === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.25)',
                    }}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-sm mt-0.5">{log.status === 'success' ? '🟢' : '🔴'}</span>
                      <div>
                        <div className="text-slate-200 font-semibold flex items-center gap-2">
                          <span>{log.userName}</span>
                          <span className="text-[10px] text-slate-400 uppercase">({log.role})</span>
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full uppercase ${
                              log.status === 'success'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-red-950 text-red-300 border border-red-800'
                            }`}
                          >
                            {log.action} &bull; {log.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans mt-0.5">{log.details}</p>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 shrink-0 self-start sm:self-center">
                      {log.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: ADD NEW STUDENT RECORD */}
      {/* ============================================================ */}
      {isAddStudentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddStudentOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 md:p-8 relative"
            style={{
              background: 'linear-gradient(145deg, rgba(7, 21, 37, 0.98), rgba(2, 11, 24, 0.98))',
              border: '1px solid rgba(34, 211, 238, 0.3)',
            }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-bold text-xl text-white">Enroll New Student Record</h3>
              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-mono text-slate-300 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g., Samantha Miller"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-300 mb-1">Degree Program</label>
                  <select
                    value={newStudentProgram}
                    onChange={(e) => setNewStudentProgram(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="B.S. Microbiology">B.S. Microbiology</option>
                    <option value="B.S. Biochemistry & Virology">B.S. Biochemistry & Virology</option>
                    <option value="B.S. Biomedical Sciences">B.S. Biomedical Sciences</option>
                    <option value="M.S. Molecular Microbiology">M.S. Molecular Microbiology</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-300 mb-1">Academic Year</label>
                  <select
                    value={newStudentYear}
                    onChange={(e) => setNewStudentYear(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-300 mb-1">Initial GPA (0.0 - 4.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={newStudentGpa}
                    onChange={(e) => setNewStudentGpa(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block font-mono text-slate-300 mb-1">Lab Attendance %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStudentAttendance}
                    onChange={(e) => setNewStudentAttendance(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-300 mb-1">Initial Enrolled Course</label>
                <select
                  value={newStudentCourse}
                  onChange={(e) => setNewStudentCourse(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="MICR-101: Fundamentals of Microbiology">MICR-101: Fundamentals of Microbiology</option>
                  <option value="MICR-204: Microbial Genetics & Genomics">MICR-204: Microbial Genetics & Genomics</option>
                  <option value="MICR-310: Clinical Pathogenesis & Immunology">MICR-310: Clinical Pathogenesis & Immunology</option>
                  <option value="MICR-420: Advanced Lab Techniques & Metagenomics">MICR-420: Advanced Lab Techniques & Metagenomics</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-display font-semibold bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: PUBLISH NEW NOTICE */}
      {/* ============================================================ */}
      {isAddNoticeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddNoticeOpen(false);
          }}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 md:p-8 relative"
            style={{
              background: 'linear-gradient(145deg, rgba(7, 21, 37, 0.98), rgba(2, 11, 24, 0.98))',
              border: '1px solid rgba(20, 184, 166, 0.3)',
            }}
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-display font-bold text-xl text-white">Publish Academic Announcement</h3>
              <button
                onClick={() => setIsAddNoticeOpen(false)}
                className="text-slate-400 hover:text-white text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNotice} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block font-mono text-slate-300 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g., Final Lab Exam Schedule for MICR-101"
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-slate-300 mb-1">Priority Level</label>
                  <select
                    value={noticePriority}
                    onChange={(e) => setNoticePriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-slate-300 mb-1">Target Audience</label>
                  <select
                    value={noticeAudience}
                    onChange={(e) => setNoticeAudience(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                  >
                    <option value="All">All Students & Faculty</option>
                    <option value="Undergraduate">Undergraduate Students</option>
                    <option value="Graduate">Graduate Researchers</option>
                    <option value="Faculty">Faculty Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-300 mb-1">Notice Content *</label>
                <textarea
                  required
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Provide complete instructions, room numbers, and relevant dates..."
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-teal-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddNoticeOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-display font-semibold bg-teal-400 text-slate-950 hover:bg-teal-300"
                >
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
