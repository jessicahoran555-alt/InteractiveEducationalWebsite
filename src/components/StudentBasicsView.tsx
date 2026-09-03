import React, { useState, useEffect } from 'react';
import { User, BasicTopic, Flashcard, QuizQuestion, AuthRulesConfig } from '../types/auth';
import {
  BASIC_TOPICS,
  BASIC_FLASHCARDS,
  BASIC_QUIZ_QUESTIONS,
  BASIC_CHECKLIST_ITEMS,
} from '../services/mockData';

interface StudentBasicsViewProps {
  user: User;
  onExploreFullSite: () => void;
  rules?: AuthRulesConfig;
}

export default function StudentBasicsView({ user, onExploreFullSite, rules }: StudentBasicsViewProps) {
  const [activeTab, setActiveTab] = useState<'modules' | 'flashcards' | 'quiz' | 'checklist'>('modules');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(BASIC_TOPICS[0].id);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Checklist state (persisted in local state)
  const [checklist, setChecklist] = useState<Array<{ id: string; text: string; done: boolean }>>(() => {
    const saved = localStorage.getItem('microsphere_student_checklist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return BASIC_CHECKLIST_ITEMS.map((item) => ({ ...item, done: item.defaultDone }));
  });

  // Notes state
  const [studentNotes, setStudentNotes] = useState<string>(() => {
    return (
      localStorage.getItem(`microsphere_notes_${user.name}`) ||
      '• Gram-positive = Purple = Thick peptidoglycan layer.\n• Gram-negative = Pink = Outer LPS membrane.\n• Endospores survive autoclaving at 121°C.'
    );
  });

  useEffect(() => {
    localStorage.setItem('microsphere_student_checklist', JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem(`microsphere_notes_${user.name}`, studentNotes);
  }, [studentNotes, user.name]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleAnswerSelect = (questionId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    BASIC_QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const activeTopic = BASIC_TOPICS.find((t) => t.id === selectedTopicId) || BASIC_TOPICS[0];
  const activeCard = BASIC_FLASHCARDS[currentCardIndex];
  const completedChecklistCount = checklist.filter((i) => i.done).length;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Student Welcome & Identity Header */}
      <div
        className="rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(7, 21, 37, 0.9) 0%, rgba(2, 11, 24, 0.95) 100%)',
          border: '1px solid rgba(20, 184, 166, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(20, 184, 166, 0.08)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
              style={{
                background: 'radial-gradient(circle, rgba(20, 184, 166, 0.3), rgba(34, 211, 238, 0.1))',
                border: '1px solid rgba(20, 184, 166, 0.5)',
              }}
            >
              {user.avatar || '🎓'}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf', border: '1px solid rgba(20, 184, 166, 0.4)' }}
                >
                  Student Portal
                </span>
                {user.studentId && (
                  <span className="text-xs font-mono text-slate-400">
                    ID: <strong className="text-white">{user.studentId}</strong>
                  </span>
                )}
              </div>
              <h1 className="font-display font-black text-2xl md:text-3xl text-white">
                Welcome, {user.name}
              </h1>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                {user.title || 'Microbiology Undergraduate Student'} &bull; Here are{' '}
                <span className="text-teal-400 font-semibold">The Basics</span> of microbiology: core
                concepts, study flashcards, and knowledge checks.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:self-center">
            <button
              onClick={onExploreFullSite}
              className="px-4 py-2.5 rounded-xl text-xs font-display font-semibold transition-all flex items-center gap-2"
              style={{
                background: 'rgba(20, 184, 166, 0.12)',
                border: '1px solid rgba(20, 184, 166, 0.35)',
                color: '#2dd4bf',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(20, 184, 166, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(20, 184, 166, 0.12)';
              }}
            >
              <span>🌐</span>
              <span>Browse Full Website</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Basic Modules</div>
            <div className="text-lg font-display font-bold text-teal-400">4 Foundations</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Study Flashcards</div>
            <div className="text-lg font-display font-bold text-cyan-400">8 Key Terms</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Basics Check</div>
            <div className="text-lg font-display font-bold text-violet-400">5 Questions</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400">Basics Progress</div>
            <div className="text-lg font-display font-bold text-amber-400">
              {completedChecklistCount}/{checklist.length} Completed
            </div>
          </div>
        </div>

        {/* Rules Connection Info Banner */}
        <div
          className="mt-5 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono"
          style={{
            background: 'rgba(20, 184, 166, 0.08)',
            border: '1px dashed rgba(20, 184, 166, 0.3)',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-teal-400">🛡️</span>
            <span className="text-slate-300">
              <strong className="text-teal-300">Rule Policy Active:</strong> Authenticated as{' '}
              <strong className="text-white">Student</strong> &bull; Validated Name &ge;{' '}
              {rules?.minNameLength ?? 3} chars, Password &ge; {rules?.minPasswordLength ?? 6} chars.
            </span>
          </div>
          <span className="text-[11px] text-teal-400/90 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
            The Basics: Unlocked (Academic Admin: Restricted)
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1.5 rounded-2xl bg-slate-900/80 border border-teal-900/40">
        {[
          { id: 'modules', label: '📖 The Basics Modules', count: '4 Topics' },
          { id: 'flashcards', label: '🎴 Flashcard Review', count: '8 Cards' },
          { id: 'quiz', label: '✍️ Knowledge Check Quiz', count: '5 Qs' },
          { id: 'checklist', label: '✅ Study Checklist & Notes', count: `${completedChecklistCount}/${checklist.length}` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-display font-semibold transition-all ${
              activeTab === tab.id
                ? 'text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(20, 184, 166, 0.35), rgba(34, 211, 238, 0.2))'
                  : 'transparent',
              border:
                activeTab === tab.id
                  ? '1px solid rgba(20, 184, 166, 0.5)'
                  : '1px solid transparent',
            }}
          >
            <span>{tab.label}</span>
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                background: activeTab === tab.id ? 'rgba(20, 184, 166, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                color: activeTab === tab.id ? '#2dd4bf' : '#64748b',
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: THE BASICS MODULES */}
      {/* ============================================================ */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar: Topics List */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 px-1">
              Fundamental Lessons
            </h3>
            {BASIC_TOPICS.map((topic) => {
              const isSelected = topic.id === selectedTopicId;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className="w-full text-left p-4 rounded-2xl transition-all block"
                  style={{
                    background: isSelected ? 'rgba(20, 184, 166, 0.15)' : 'rgba(7, 21, 37, 0.7)',
                    border: isSelected ? '1px solid rgba(20, 184, 166, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: isSelected ? '0 0 20px rgba(20, 184, 166, 0.1)' : 'none',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0 mt-0.5">{topic.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                          style={{
                            background: isSelected ? 'rgba(20, 184, 166, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                            color: isSelected ? '#2dd4bf' : '#94a3b8',
                          }}
                        >
                          {topic.level}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{topic.readTime}</span>
                      </div>
                      <h4 className="font-display font-bold text-sm text-white">{topic.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{topic.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Area: Selected Module Deep Dive */}
          <div className="lg:col-span-8">
            <div
              className="rounded-3xl p-6 md:p-8"
              style={{
                background: 'rgba(7, 21, 37, 0.7)',
                border: '1px solid rgba(20, 184, 166, 0.2)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-teal-400 bg-teal-950/60 border border-teal-800/60 px-2.5 py-0.5 rounded-full">
                      {activeTopic.level}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{activeTopic.readTime}</span>
                  </div>
                  <h2 className="font-display font-black text-2xl text-white">{activeTopic.title}</h2>
                  <p className="text-sm font-sans text-teal-300/80 mt-1">{activeTopic.subtitle}</p>
                </div>
                <span className="text-4xl">{activeTopic.icon}</span>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6 text-sm text-slate-300 leading-relaxed">
                {activeTopic.summary}
              </div>

              {/* Key Concept Points */}
              <div className="mb-6">
                <h3 className="text-xs font-mono uppercase tracking-wider text-teal-400 mb-3 flex items-center gap-2">
                  <span>📌</span> Essential Learning Points
                </h3>
                <div className="space-y-2.5">
                  {activeTopic.keyPoints.map((pt, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl flex items-start gap-3 text-sm text-slate-200"
                      style={{ background: 'rgba(2, 11, 24, 0.5)', border: '1px solid rgba(255, 255, 255, 0.05)' }}
                    >
                      <span className="w-5 h-5 rounded-full bg-teal-900/60 text-teal-300 text-xs font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinical & Real-world Relevance Callout */}
              <div
                className="p-4 rounded-2xl flex items-start gap-3 text-xs md:text-sm"
                style={{
                  background: 'rgba(34, 211, 238, 0.08)',
                  border: '1px solid rgba(34, 211, 238, 0.3)',
                  color: '#bae6fd',
                }}
              >
                <span className="text-xl shrink-0 mt-0.5">💡</span>
                <div>
                  <strong className="text-cyan-300 block mb-1">Clinical & Practical Takeaway:</strong>
                  {activeTopic.clinicalRelevance}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: FLASHCARD REVIEW */}
      {/* ============================================================ */}
      {activeTab === 'flashcards' && (
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="font-display font-bold text-xl text-white">Basics Terminology Flashcards</h2>
            <p className="text-xs text-slate-400 mt-1">
              Click the card to flip between the term and definition.
            </p>
          </div>

          {/* Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] rounded-3xl p-8 cursor-pointer transition-all duration-300 relative flex flex-col justify-between select-none"
            style={{
              background: isFlipped
                ? 'linear-gradient(145deg, rgba(7, 21, 37, 0.95), rgba(15, 30, 50, 0.95))'
                : 'linear-gradient(145deg, rgba(7, 21, 37, 0.9), rgba(4, 13, 26, 0.95))',
              border: isFlipped
                ? '2px solid rgba(34, 211, 238, 0.5)'
                : '1px solid rgba(20, 184, 166, 0.4)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(20, 184, 166, 0.1)',
            }}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between text-xs font-mono">
              <span
                className="px-2.5 py-0.5 rounded-full"
                style={{
                  background: isFlipped ? 'rgba(34, 211, 238, 0.15)' : 'rgba(20, 184, 166, 0.15)',
                  color: isFlipped ? '#67e8f9' : '#2dd4bf',
                }}
              >
                {activeCard.category}
              </span>
              <span className="text-slate-400">
                Card {currentCardIndex + 1} of {BASIC_FLASHCARDS.length} &bull;{' '}
                <span className="text-teal-400">{isFlipped ? 'Answer Side' : 'Question Side'}</span>
              </span>
            </div>

            {/* Card Body */}
            <div className="my-8 text-center">
              {!isFlipped ? (
                <div>
                  <h3 className="font-display font-black text-3xl md:text-4xl text-white mb-2">
                    {activeCard.term}
                  </h3>
                  {activeCard.phonetic && (
                    <p className="font-mono text-xs text-teal-400">{activeCard.phonetic}</p>
                  )}
                  <p className="text-xs text-slate-500 mt-6 font-sans">
                    (Click to reveal definition & laboratory example)
                  </p>
                </div>
              ) : (
                <div className="text-left animate-fadeIn">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
                    Definition
                  </h4>
                  <p className="text-sm md:text-base text-slate-200 leading-relaxed mb-4">
                    {activeCard.definition}
                  </p>
                  <div
                    className="p-3 rounded-xl text-xs leading-relaxed"
                    style={{ background: 'rgba(2, 11, 24, 0.7)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
                  >
                    <strong className="text-teal-300">Lab Example: </strong>
                    <span className="text-slate-300">{activeCard.example}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Hint */}
            <div className="text-center text-[11px] font-mono text-slate-400">
              💡 Press space or click anywhere to flip
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-4 mt-6">
            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : BASIC_FLASHCARDS.length - 1));
              }}
              className="px-4 py-2 rounded-xl text-xs font-display font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:border-teal-500 transition-colors"
            >
              ← Previous Card
            </button>

            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="px-5 py-2 rounded-xl text-xs font-display font-semibold text-teal-300 bg-teal-950/60 border border-teal-700 hover:bg-teal-900/60 transition-colors"
            >
              🔄 Flip Card
            </button>

            <button
              onClick={() => {
                setIsFlipped(false);
                setCurrentCardIndex((prev) => (prev < BASIC_FLASHCARDS.length - 1 ? prev + 1 : 0));
              }}
              className="px-4 py-2 rounded-xl text-xs font-display font-medium text-slate-300 bg-slate-900 border border-slate-700 hover:border-teal-500 transition-colors"
            >
              Next Card →
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: BASICS KNOWLEDGE CHECK (QUIZ) */}
      {/* ============================================================ */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-widest px-3 py-1 rounded-full bg-teal-950/60 border border-teal-800">
              Self-Assessment
            </span>
            <h2 className="font-display font-black text-2xl text-white mt-3">
              Microbiology Basics Knowledge Check
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test your grasp on cell walls, Gram staining, growth phases, and selective toxicity.
            </p>
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-6">
            {BASIC_QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = isAnswered && selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl p-6 transition-all"
                  style={{
                    background: 'rgba(7, 21, 37, 0.7)',
                    border: '1px solid rgba(20, 184, 166, 0.15)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-teal-400">
                      Question {qIndex + 1} of {BASIC_QUIZ_QUESTIONS.length}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 px-2 py-0.5 rounded bg-slate-900">
                      {q.topic}
                    </span>
                  </div>

                  <h3 className="font-display font-semibold text-base text-white mb-4">
                    {q.question}
                  </h3>

                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => {
                      const isThisSelected = selectedOpt === optIndex;
                      let optionStyle = {
                        background: 'rgba(2, 11, 24, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#cbd5e1',
                      };

                      if (quizSubmitted) {
                        if (optIndex === q.correctIndex) {
                          optionStyle = {
                            background: 'rgba(16, 185, 129, 0.2)',
                            border: '1px solid rgba(16, 185, 129, 0.6)',
                            color: '#6ee7b7',
                          };
                        } else if (isThisSelected) {
                          optionStyle = {
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid rgba(239, 68, 68, 0.6)',
                            color: '#fca5a5',
                          };
                        }
                      } else if (isThisSelected) {
                        optionStyle = {
                          background: 'rgba(20, 184, 166, 0.25)',
                          border: '1px solid rgba(20, 184, 166, 0.7)',
                          color: '#2dd4bf',
                        };
                      }

                      return (
                        <button
                          key={optIndex}
                          type="button"
                          onClick={() => handleAnswerSelect(q.id, optIndex)}
                          disabled={quizSubmitted}
                          className="w-full text-left p-3 rounded-xl text-xs md:text-sm font-sans flex items-center justify-between transition-all"
                          style={optionStyle}
                        >
                          <span>
                            <strong className="font-mono mr-2 text-slate-400">
                              {String.fromCharCode(65 + optIndex)}.
                            </strong>
                            {opt}
                          </span>
                          {quizSubmitted && optIndex === q.correctIndex && <span>✅</span>}
                          {quizSubmitted && isThisSelected && optIndex !== q.correctIndex && <span>❌</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submission */}
                  {quizSubmitted && (
                    <div
                      className="mt-4 p-3.5 rounded-xl text-xs leading-relaxed"
                      style={{
                        background: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        border: isCorrect ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                        color: isCorrect ? '#a7f3d0' : '#fecaca',
                      }}
                    >
                      <strong className="block mb-1">
                        {isCorrect ? 'Correct!' : 'Incorrect.'}
                      </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quiz Action Bar */}
          <div className="mt-8 p-6 rounded-2xl bg-slate-900/90 border border-teal-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {quizSubmitted ? (
                <div>
                  <span className="text-xs font-mono text-slate-400">Quiz Completed: </span>
                  <span className="text-lg font-display font-bold text-teal-300">
                    {calculateScore()} / {BASIC_QUIZ_QUESTIONS.length} (
                    {Math.round((calculateScore() / BASIC_QUIZ_QUESTIONS.length) * 100)}%)
                  </span>
                </div>
              ) : (
                <span className="text-xs font-mono text-slate-400">
                  Answered: {Object.keys(selectedAnswers).length} of {BASIC_QUIZ_QUESTIONS.length}
                </span>
              )}
            </div>

            <div className="flex gap-3">
              {quizSubmitted ? (
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 rounded-xl text-xs font-display font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  🔄 Retake Quiz
                </button>
              ) : (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(selectedAnswers).length === 0}
                  className="px-6 py-2.5 rounded-xl text-xs font-display font-semibold transition-all"
                  style={{
                    background:
                      Object.keys(selectedAnswers).length === 0
                        ? 'rgba(20, 184, 166, 0.2)'
                        : 'linear-gradient(135deg, #14b8a6, #0d9488)',
                    color: Object.keys(selectedAnswers).length === 0 ? '#64748b' : '#020b18',
                    cursor: Object.keys(selectedAnswers).length === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Submit & See Results
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: STUDY CHECKLIST & NOTES */}
      {/* ============================================================ */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checklist */}
          <div
            className="rounded-3xl p-6"
            style={{ background: 'rgba(7, 21, 37, 0.7)', border: '1px solid rgba(20, 184, 166, 0.15)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-white">Basics Study Checklist</h3>
                <p className="text-xs text-slate-400">Track your foundational learning milestones</p>
              </div>
              <span className="text-xs font-mono text-teal-400 bg-teal-950 px-2.5 py-1 rounded-full border border-teal-800">
                {completedChecklistCount}/{checklist.length} Done
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: item.done ? 'rgba(20, 184, 166, 0.08)' : 'rgba(2, 11, 24, 0.5)',
                    border: item.done ? '1px solid rgba(20, 184, 166, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="mt-1 rounded accent-teal-500 cursor-pointer"
                  />
                  <span
                    className={`text-xs md:text-sm leading-relaxed ${
                      item.done ? 'line-through text-slate-400' : 'text-slate-200'
                    }`}
                  >
                    {item.text}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Student Notes */}
          <div
            className="rounded-3xl p-6 flex flex-col justify-between"
            style={{ background: 'rgba(7, 21, 37, 0.7)', border: '1px solid rgba(20, 184, 166, 0.15)' }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-lg text-white">My Study Notes & Scratchpad</h3>
                <span className="text-[10px] font-mono text-slate-500">Auto-saved locally</span>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Jot down key points, lab reminders, or questions for your professor.
              </p>

              <textarea
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                rows={10}
                className="w-full p-4 rounded-2xl text-xs md:text-sm font-mono text-slate-200 focus:outline-none transition-all resize-none"
                style={{
                  background: 'rgba(2, 11, 24, 0.8)',
                  border: '1px solid rgba(20, 184, 166, 0.25)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#14b8a6';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(20, 184, 166, 0.25)';
                }}
              />
            </div>

            <div className="text-[11px] font-mono text-teal-400/80 mt-4 flex items-center gap-1.5">
              <span>💾</span>
              <span>Notes are saved automatically for {user.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
