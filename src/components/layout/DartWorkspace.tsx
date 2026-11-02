import React, { useState, useRef, useEffect } from 'react';
import { DART_TOPICS } from '../../data/dartTopics';
import type { DartTopic } from '../../data/dartTopics';
import { runDartCodeSimulation } from '../../utils/dartRunner';
import type { DartRunResult } from '../../utils/dartRunner';
import { gradeDartChallenge } from '../../utils/quizGrader';
import type { GradeResult } from '../../utils/quizGrader';
import {
  Terminal,
  FileCode2,
  Play,
  RotateCcw,
  Copy,
  Check,
  BookOpen,
  Info,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
  Bookmark,
  Award,
  Lock,
  KeyRound,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';

interface DartWorkspaceProps {
  onBackToDashboard: () => void;
  onSwitchToFlutter: () => void;
  bookmarkedTopics: string[];
  onToggleBookmark: (id: string) => void;
  completedTopics: string[];
  onToggleTopicCompletion: (topicId: string) => void;
  onTopicVisited?: (topic: DartTopic) => void;
}

export const DartWorkspace: React.FC<DartWorkspaceProps> = ({
  onBackToDashboard,
  onSwitchToFlutter,
  bookmarkedTopics,
  onToggleBookmark,
  completedTopics,
  onToggleTopicCompletion,
  onTopicVisited,
}) => {
  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('freelab-last-dart-topic');
      return saved || 'dart-variables';
    } catch {
      return 'dart-variables';
    }
  });
  const [activeTab, setActiveTab] = useState<'quiz' | 'playground' | 'reference'>('quiz');
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Completed challenges persisted in localStorage
  const [completedChallengeIds, setCompletedChallengeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freelab-completed-dart-challenges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Unlocked topic IDs persisted in localStorage (Topic 1 unlocked by default)
  const [unlockedTopicIds, setUnlockedTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freelab-unlocked-dart-topics');
      return saved ? JSON.parse(saved) : ['dart-variables'];
    } catch {
      return ['dart-variables'];
    }
  });

  // Manual code entry modal / input state
  const [showUnlockModal, setShowUnlockModal] = useState<boolean>(false);
  const [manualCodeInput, setManualCodeInput] = useState<string>('');
  const [unlockMessage, setUnlockMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const activeTopic =
    DART_TOPICS.find((t) => t.id === activeTopicId) || DART_TOPICS[0];

  useEffect(() => {
    try {
      localStorage.setItem('freelab-last-dart-topic', activeTopic.id);
      localStorage.setItem('freelab-last-track', 'dart');
      if (onTopicVisited) onTopicVisited(activeTopic);
    } catch {}
  }, [activeTopic, onTopicVisited]);

  // Playground state
  const [playgroundCode, setPlaygroundCode] = useState<string>(activeTopic.dartCode);
  const [runResult, setRunResult] = useState<DartRunResult>({
    success: true,
    output: activeTopic.expectedOutput,
    error: null,
  });

  // Quiz state
  const [quizCode, setQuizCode] = useState<string>(activeTopic.challenge.starterCode);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isGrading, setIsGrading] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const quizTextareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const quizGutterRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);
  const quizHighlightLayerRef = useRef<HTMLDivElement>(null);

  const isBookmarked = bookmarkedTopics.includes(activeTopic.id);
  const isTopicMarkedDone = completedTopics.includes(activeTopic.id);
  const isCurrentQuizCompleted = completedChallengeIds.includes(activeTopic.id);

  const visibleTopics =
    filterMode === 'favorites'
      ? DART_TOPICS.filter((t) => bookmarkedTopics.includes(t.id))
      : DART_TOPICS;

  const totalFavoritesCount = DART_TOPICS.filter((t) =>
    bookmarkedTopics.includes(t.id)
  ).length;

  // Auto-scroll to error line when runResult.errorLine changes in Playground
  useEffect(() => {
    if (runResult.errorLine && textareaRef.current && activeTab === 'playground') {
      const targetScroll = Math.max(0, (runResult.errorLine - 3) * 24);
      textareaRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [runResult.errorLine, activeTab]);

  // Synchronize scroll between gutter, highlight underlay, and textarea
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const top = e.currentTarget.scrollTop;
    if (gutterRef.current) gutterRef.current.scrollTop = top;
    if (highlightLayerRef.current) highlightLayerRef.current.scrollTop = top;
  };

  const handleQuizScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const top = e.currentTarget.scrollTop;
    if (quizGutterRef.current) quizGutterRef.current.scrollTop = top;
    if (quizHighlightLayerRef.current) quizHighlightLayerRef.current.scrollTop = top;
  };

  const jumpToErrorLine = () => {
    if (runResult.errorLine && textareaRef.current) {
      const targetScroll = Math.max(0, (runResult.errorLine - 3) * 24);
      textareaRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
      textareaRef.current.focus();
    }
  };

  const handleSelectTopic = (topic: DartTopic) => {
    if (!unlockedTopicIds.includes(topic.id)) {
      setShowUnlockModal(true);
      return;
    }

    setActiveTopicId(topic.id);
    setPlaygroundCode(topic.dartCode);
    setQuizCode(topic.challenge.starterCode);
    setGradeResult(null);
    setShowHint(false);
    setRunResult({
      success: true,
      output: topic.expectedOutput,
      error: null,
    });
  };

  // Run code inside standard Playground
  const handleRunCode = async () => {
    const result = await runDartCodeSimulation(playgroundCode);
    setRunResult(result);
  };

  const handleReset = () => {
    setPlaygroundCode(activeTopic.dartCode);
    setRunResult({
      success: true,
      output: activeTopic.expectedOutput,
      error: null,
    });
  };

  // Auto-grade quiz submission
  const handleEvaluateQuiz = async () => {
    setIsGrading(true);
    setRunResult({ success: true, output: '', error: null });

    const execResult = await runDartCodeSimulation(quizCode);

    if (!execResult.success) {
      setRunResult(execResult);
      setGradeResult({
        passed: false,
        actualOutput: execResult.error || 'Error saat eksekusi.',
        expectedOutput: activeTopic.expectedOutput,
        diffMessage: `Program menghasilkan error kompilasi: ${execResult.error}`,
        mismatchedLine: execResult.errorLine,
      });
      setIsGrading(false);
      return;
    }

    const grading = gradeDartChallenge(execResult.output, activeTopic.expectedOutput);
    setGradeResult(grading);

    if (grading.passed) {
      // Mark as completed challenge
      if (!completedChallengeIds.includes(activeTopic.id)) {
        const nextCompleted = [...completedChallengeIds, activeTopic.id];
        setCompletedChallengeIds(nextCompleted);
        try {
          localStorage.setItem('freelab-completed-dart-challenges', JSON.stringify(nextCompleted));
        } catch {}
      }

      // Automatically mark topic as completed as well
      if (!completedTopics.includes(activeTopic.id)) {
        onToggleTopicCompletion(activeTopic.id);
      }

      // Unlock next topic if exists
      if (activeTopic.challenge.nextTopicId && !unlockedTopicIds.includes(activeTopic.challenge.nextTopicId)) {
        const nextUnlocked = [...unlockedTopicIds, activeTopic.challenge.nextTopicId];
        setUnlockedTopicIds(nextUnlocked);
        try {
          localStorage.setItem('freelab-unlocked-dart-topics', JSON.stringify(nextUnlocked));
        } catch {}
      }
    }

    setIsGrading(false);
  };

  // Handle manual unlock code submission
  const handleManualUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualCodeInput.trim().toUpperCase();

    // Check if code matches any challenge unlockCode
    const matchingTopic = DART_TOPICS.find(
      (t) => t.challenge.unlockCode.toUpperCase() === code
    );

    if (matchingTopic) {
      if (matchingTopic.challenge.nextTopicId) {
        const nextId = matchingTopic.challenge.nextTopicId;
        if (!unlockedTopicIds.includes(nextId)) {
          const updated = [...unlockedTopicIds, nextId];
          setUnlockedTopicIds(updated);
          try {
            localStorage.setItem('freelab-unlocked-dart-topics', JSON.stringify(updated));
          } catch {}
        }
        setUnlockMessage({
          text: `Berhasil! Materi "${matchingTopic.challenge.nextTopicTitle}" telah dibuka.`,
          isError: false,
        });
        setTimeout(() => {
          setShowUnlockModal(false);
          setActiveTopicId(nextId);
          setUnlockMessage(null);
          setManualCodeInput('');
        }, 1500);
      } else {
        setUnlockMessage({
          text: 'Selamat! Kode ini membuktikan Anda telah menyelesaikan seluruh silabus Dart!',
          isError: false,
        });
      }
    } else {
      setUnlockMessage({
        text: 'Kode akses tidak valid. Periksa kembali huruf dan angka kode.',
        isError: true,
      });
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyUnlockCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setCopiedCode(false);
    }
  };

  const playgroundLines = playgroundCode.split('\n');
  const quizLines = quizCode.split('\n');

  return (
    <div className="max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
      {/* Left Sidebar: Dart Topics & Unlock Status */}
      <aside
        aria-label="Daftar Modul Dart"
        className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#202025] pb-4 lg:pb-0 lg:pr-5 select-none"
      >
        <div className="sticky top-20 space-y-4">
          {/* Bookmark Filter Segmented Control */}
          <div className="p-1 bg-slate-100 dark:bg-[#111114] border border-slate-200 dark:border-[#202025] rounded-xl flex items-center text-xs">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-[#1C1C21] text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Semua ({DART_TOPICS.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('favorites')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center flex items-center justify-center gap-1.5 transition-all ${
                filterMode === 'favorites'
                  ? 'bg-amber-500 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bookmark className={`w-3 h-3 ${filterMode === 'favorites' ? 'fill-current' : ''}`} />
              <span>Favorit ({totalFavoritesCount})</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-[#8A8A93] uppercase tracking-wider px-2">
            <span>Modul Dart</span>
            <button
              type="button"
              onClick={() => setShowUnlockModal(true)}
              className="inline-flex items-center gap-1 font-mono text-[10px] text-sky-600 dark:text-[#38BDF8] hover:underline"
              title="Masukkan kode akses materi"
            >
              <KeyRound className="w-3 h-3" />
              <span>Punya Kode?</span>
            </button>
          </div>

          {/* Module List with Lock & Completion Status */}
          <ul className="space-y-1">
            {visibleTopics.map((topic, index) => {
              const isActive = topic.id === activeTopic.id;
              const isTopicBookmarked = bookmarkedTopics.includes(topic.id);
              const isUnlocked = unlockedTopicIds.includes(topic.id);
              const isChallengeDone = completedChallengeIds.includes(topic.id);
              const isTopicDone = completedTopics.includes(topic.id);

              return (
                <li key={topic.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleSelectTopic(topic)}
                    className={`w-full text-left pl-3 pr-8 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-black font-semibold shadow-xs'
                        : isUnlocked
                        ? 'text-slate-700 dark:text-[#D4D4D8] hover:bg-slate-200/70 dark:hover:bg-[#18181D] hover:text-slate-950 dark:hover:text-white'
                        : 'text-slate-400 dark:text-[#52525B] hover:bg-slate-100 dark:hover:bg-[#111114]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {isTopicDone || isChallengeDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399] shrink-0" />
                      ) : !isUnlocked ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-[#52525B] shrink-0" />
                      ) : (
                        <span className="w-3.5 text-center font-mono text-[10px] text-slate-400">
                          {index + 1}
                        </span>
                      )}
                      <span className="truncate">{topic.title}</span>
                    </div>

                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-mono tracking-wide shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-slate-800 dark:bg-[#E4E4E7] text-slate-200 dark:text-black'
                          : isTopicDone || isChallengeDone
                          ? 'bg-emerald-100 dark:bg-[#122419] text-emerald-700 dark:text-[#34D399]'
                          : !isUnlocked
                          ? 'bg-slate-200/60 dark:bg-[#18181D] text-slate-400 dark:text-[#52525B]'
                          : 'bg-slate-100 dark:bg-[#16161B] text-slate-500 dark:text-[#8A8A93]'
                      }`}
                    >
                      {isTopicDone ? 'Selesai' : isChallengeDone ? 'Lulus' : !isUnlocked ? 'Terkunci' : topic.difficulty}
                    </span>
                  </button>

                  {/* Bookmark Button in Sidebar Item */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(topic.id);
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity ${
                      isTopicBookmarked
                        ? 'opacity-100 text-amber-400 hover:text-amber-500'
                        : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                    aria-label={isTopicBookmarked ? `Hapus ${topic.title} dari favorit` : `Simpan ${topic.title} ke favorit`}
                    title={isTopicBookmarked ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isTopicBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Empty state for favorites */}
          {filterMode === 'favorites' && visibleTopics.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500 dark:text-[#8A8A93] bg-slate-100 dark:bg-[#111114] rounded-xl border border-slate-200 dark:border-[#202025] space-y-2">
              <Bookmark className="w-5 h-5 mx-auto text-amber-500/70" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                Belum ada topik favorit
              </p>
              <p className="text-[11px] leading-relaxed">
                Klik ikon bookmark pada materi untuk menyimpan topik Dart ke daftar favorit.
              </p>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200 dark:border-[#202025] space-y-2">
            <button
              type="button"
              onClick={onSwitchToFlutter}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-[#111114] hover:bg-slate-200 dark:hover:bg-[#18181D] text-slate-700 dark:text-[#D4D4D8] border border-slate-200 dark:border-[#202025] text-xs font-medium flex items-center justify-between transition-colors"
            >
              <span>Lanjut ke Jalur Flutter</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 space-y-6">
        {/* Topic Header & Breadcrumb */}
        <div className="space-y-3 border-b border-slate-200 dark:border-[#202025] pb-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="text-sky-600 dark:text-[#38BDF8] hover:underline font-medium"
              >
                ← Dashboard
              </button>
              <span className="text-slate-400 dark:text-[#52525B]">/</span>
              <span className="text-slate-600 dark:text-[#8A8A93] font-medium">Jalur Dart</span>
              <span className="text-slate-400 dark:text-[#52525B]">•</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#18181F] border border-slate-200 dark:border-[#262630] text-slate-700 dark:text-[#D4D4D8] font-mono text-[10px]">
                {activeTopic.difficulty}
              </span>
              {isCurrentQuizCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-[#122419] text-emerald-700 dark:text-[#34D399] font-mono text-[10px] font-semibold border border-emerald-300 dark:border-[#1E4D33]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Kuis Selesai</span>
                </span>
              )}
            </div>

            {/* Action Buttons: Tandai Selesai & Bookmark */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleTopicCompletion(activeTopic.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isTopicMarkedDone
                    ? 'bg-emerald-50 dark:bg-[#122419] text-emerald-700 dark:text-[#34D399] border-emerald-300 dark:border-[#1E4D33] shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161B] text-slate-700 dark:text-[#A1A1AA] border-slate-200 dark:border-[#26262E] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1F1F26]'
                }`}
                aria-label={isTopicMarkedDone ? 'Batalkan tanda selesai' : 'Tandai materi ini telah selesai dipelajari'}
                title={isTopicMarkedDone ? 'Materi telah selesai dipelajari' : 'Tandai materi selesai'}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${isTopicMarkedDone ? 'text-emerald-500 dark:text-[#34D399]' : ''}`}
                />
                <span>{isTopicMarkedDone ? 'Selesai Dipelajari' : 'Tandai Selesai'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleBookmark(activeTopic.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  isBookmarked
                    ? 'bg-amber-50 dark:bg-[#251E14] text-amber-700 dark:text-[#FBBF24] border-amber-300 dark:border-[#523B19] shadow-xs'
                    : 'bg-slate-100 dark:bg-[#16161B] text-slate-700 dark:text-[#A1A1AA] border-slate-200 dark:border-[#26262E] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1F1F26]'
                }`}
                aria-label={isBookmarked ? 'Hapus dari daftar favorit' : 'Simpan topik ke daftar favorit'}
                title={isBookmarked ? 'Tersimpan di Favorit' : 'Simpan topik ke favorit'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Favorit' : 'Bookmark'}</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeTopic.title}
          </h1>

          <p className="text-sm lg:text-base text-slate-600 dark:text-[#8A8A93] leading-relaxed max-w-3xl">
            {activeTopic.subtitle}
          </p>
        </div>

        {/* Conceptual Summary */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <BookOpen className="w-4 h-4 text-sky-600 dark:text-[#38BDF8]" />
            <span>Penjelasan Konseptual</span>
          </div>
          <p className="text-xs lg:text-sm text-slate-600 dark:text-[#8A8A93] leading-relaxed font-sans">
            {activeTopic.summary}
          </p>
        </div>

        {/* Concept Points */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-600 dark:text-[#38BDF8]" />
            <span>Poin Pembelajaran Kunci</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeTopic.conceptPoints.map((point, index) => (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] space-y-1.5 shadow-xs"
              >
                <h3 className="font-semibold text-xs text-sky-700 dark:text-[#38BDF8]">
                  {point.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-[#8A8A93] leading-relaxed font-sans">
                  {point.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Syntax Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Referensi Sintaks Dart
          </h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#202025] bg-white dark:bg-[#111114]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#202025] bg-slate-50 dark:bg-[#09090B] text-slate-600 dark:text-[#8A8A93]">
                  <th className="py-2.5 px-3 font-semibold font-mono">Konsep</th>
                  <th className="py-2.5 px-3 font-semibold font-mono">Contoh Sintaks</th>
                  <th className="py-2.5 px-3 font-semibold">Penjelasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#202025]">
                {activeTopic.keyProperties.map((prop, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-[#18181D] transition-colors"
                  >
                    <td className="py-2.5 px-3 font-mono font-semibold text-sky-600 dark:text-[#38BDF8]">
                      {prop.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-[#8A8A93]">
                      {prop.type}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-[#D4D4D8] leading-relaxed font-sans">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dart Code Workspace with 3 Tabs: Referensi, Playground, & Quiz */}
        <div className="space-y-4 pt-2">
          {/* Editor Header & 3 Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-[#202025] pb-3">
            <div className="inline-flex p-1 bg-slate-100 dark:bg-[#111114] border border-slate-200 dark:border-[#202025] rounded-xl text-xs">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'quiz'}
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'quiz'
                    ? 'bg-amber-500 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>1. Quiz &amp; Mini-Challenge</span>
                {isCurrentQuizCompleted && <CheckCircle2 className="w-3 h-3 text-white ml-0.5" />}
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'playground'}
                onClick={() => setActiveTab('playground')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'playground'
                    ? 'bg-sky-600 dark:bg-white text-white dark:text-black shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>2. Playground Bebas</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'reference'}
                onClick={() => setActiveTab('reference')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'reference'
                    ? 'bg-white dark:bg-[#1C1C21] text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>3. Kode Asli (Referensi)</span>
              </button>
            </div>

            {/* Quick Actions depending on Tab */}
            <div className="flex items-center gap-2">
              {activeTab === 'quiz' ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizCode(activeTopic.challenge.starterCode);
                      setGradeResult(null);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#111114] hover:bg-slate-200 dark:hover:bg-[#18181D] border border-slate-200 dark:border-[#202025] rounded-lg transition-colors"
                    title="Muat ulang kode awal kuis"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset Kuis</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleEvaluateQuiz}
                    disabled={isGrading}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 shadow-sm rounded-lg transition-all ring-1 ring-amber-400/40"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{isGrading ? 'Memeriksa...' : 'Periksa Jawaban (Auto-Grade)'}</span>
                  </button>
                </>
              ) : activeTab === 'playground' ? (
                <>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#111114] hover:bg-slate-200 dark:hover:bg-[#18181D] border border-slate-200 dark:border-[#202025] rounded-lg transition-colors"
                    title="Reset ke kode awal"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleRunCode}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 dark:bg-white text-white dark:text-black hover:opacity-90 active:scale-95 shadow-xs rounded-lg transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Jalankan Kode</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCopy(activeTopic.dartCode)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[#D4D4D8] hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-[#111114] hover:bg-slate-200 dark:hover:bg-[#18181D] border border-slate-200 dark:border-[#202025] rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Kode</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* TAB 1: QUIZ & MINI-CHALLENGE WITH AUTO-GRADE */}
          {activeTab === 'quiz' && (
            <div className="space-y-4">
              {/* Challenge Instruction Card */}
              <div className="p-4 bg-amber-50/70 dark:bg-[#16161B] border border-amber-200 dark:border-[#2A241C] rounded-2xl text-xs space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600 dark:text-[#FBBF24]" />
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      Tantangan Kuis: {activeTopic.title}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] uppercase font-bold text-amber-700 dark:text-[#FBBF24] bg-amber-100 dark:bg-[#251E14] px-2 py-0.5 rounded-full border border-amber-300 dark:border-[#523B19]">
                    Auto-Grading
                  </span>
                </div>

                <p className="text-slate-700 dark:text-[#D4D4D8] leading-relaxed">
                  {activeTopic.challenge.instruction}
                </p>

                {/* Expected Output Target Box */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-[#8A8A93]">
                    Target Output yang Diharapkan:
                  </span>
                  <pre className="p-2.5 rounded-xl bg-slate-900 dark:bg-[#09090B] text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 dark:border-[#202025]">
                    <code>{activeTopic.expectedOutput}</code>
                  </pre>
                </div>

                {/* Collapsible Hint */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 dark:text-[#FBBF24] hover:underline"
                  >
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>{showHint ? 'Sembunyikan Petunjuk' : 'Lihat Petunjuk Koding'}</span>
                  </button>
                  {showHint && (
                    <div className="mt-2 p-2.5 rounded-xl bg-white/80 dark:bg-[#111114] border border-amber-200 dark:border-[#202025] text-[11px] text-slate-700 dark:text-[#D4D4D8]">
                      {activeTopic.challenge.hint}
                    </div>
                  )}
                </div>
              </div>

              {/* Quiz Code Editor */}
              <div className="relative rounded-2xl bg-slate-950 dark:bg-[#09090B] border border-slate-800 dark:border-[#202025] overflow-hidden shadow-md flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 dark:border-[#202025] bg-slate-900/80 dark:bg-[#111114] text-[11px] font-mono text-slate-400 dark:text-[#8A8A93] shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    <span className="text-slate-200 dark:text-[#F4F4F5] font-semibold">{activeTopic.id}_challenge.dart</span>
                  </div>
                  <span className="text-amber-400 font-semibold text-[10px]">Challenge Mode</span>
                </div>

                <div className="relative flex h-[320px] bg-slate-950 dark:bg-[#09090B] overflow-hidden font-mono text-xs">
                  {/* Gutter */}
                  <div
                    ref={quizGutterRef}
                    aria-hidden="true"
                    className="select-none py-3 bg-slate-900/60 dark:bg-[#0C0C0F] border-r border-slate-800 dark:border-[#202025] text-slate-500 dark:text-[#71717A] text-[11px] shrink-0 w-12 overflow-hidden pointer-events-none"
                  >
                    {Array.from({ length: quizLines.length }, (_, i) => {
                      const num = i + 1;
                      const isError = num === gradeResult?.mismatchedLine;
                      return (
                        <div
                          key={num}
                          className={`h-6 leading-6 flex items-center justify-end px-2 transition-colors ${
                            isError
                              ? 'bg-rose-950/90 text-rose-300 font-bold border-l-2 border-rose-500'
                              : ''
                          }`}
                        >
                          {isError ? `!${num}` : num}
                        </div>
                      );
                    })}
                  </div>

                  {/* Highlight Underlay & Textarea */}
                  <div className="relative flex-1 h-full overflow-hidden">
                    <div
                      ref={quizHighlightLayerRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 overflow-hidden py-3 font-mono text-xs select-none"
                    >
                      {Array.from({ length: quizLines.length }, (_, i) => {
                        const num = i + 1;
                        const isError = num === gradeResult?.mismatchedLine;
                        return (
                          <div
                            key={num}
                            className={`h-6 leading-6 w-full px-3 flex items-center transition-colors ${
                              isError
                                ? 'bg-rose-500/20 dark:bg-rose-950/60 border-l-2 border-rose-500'
                                : ''
                            }`}
                          >
                            &nbsp;
                          </div>
                        );
                      })}
                    </div>

                    <textarea
                      ref={quizTextareaRef}
                      value={quizCode}
                      onChange={(e) => setQuizCode(e.target.value)}
                      onScroll={handleQuizScroll}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoComplete="off"
                      aria-label="Editor kode kuis Dart"
                      className="relative z-10 w-full h-full py-3 px-3 bg-transparent text-slate-100 dark:text-[#F4F4F5] font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-amber-500/30 whitespace-pre overflow-auto"
                      placeholder="// Tulis jawaban tantangan Dart Anda di sini..."
                    />
                  </div>
                </div>
              </div>

              {/* AUTO-GRADING EVALUATION RESULT BOX */}
              {gradeResult && (
                <div
                  className={`p-5 rounded-2xl border transition-all animate-fade-in space-y-4 ${
                    gradeResult.passed
                      ? 'bg-emerald-50 dark:bg-[#0D1F15] border-emerald-300 dark:border-[#1E4D33]'
                      : 'bg-rose-50 dark:bg-[#200F15] border-rose-300 dark:border-[#4B1E29]'
                  }`}
                >
                  {gradeResult.passed ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-sm sm:text-base text-emerald-900 dark:text-emerald-300">
                            Luar Biasa! Jawaban Anda 100% Tepat!
                          </h3>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400">
                            Output program berhasil memenuhi kriteria tantangan kuis.
                          </p>
                        </div>
                      </div>

                      {/* Secret Unlock Code Showcase */}
                      <div className="p-4 rounded-xl bg-white dark:bg-[#111114] border border-emerald-300 dark:border-[#202025] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8A8A93] uppercase tracking-wider flex items-center gap-1.5">
                            <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                            <span>Kode Akses Materi Selanjutnya:</span>
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-[#34D399] font-medium">
                            Tersimpan Otomatis
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#09090B] border border-slate-200 dark:border-[#202025]">
                          <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-slate-900 dark:text-[#F4F4F5] selection:bg-emerald-500/30">
                            {activeTopic.challenge.unlockCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyUnlockCode(activeTopic.challenge.unlockCode)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shrink-0 shadow-xs"
                          >
                            {copiedCode ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Salin Kode</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Next Topic CTA Button */}
                      {activeTopic.challenge.nextTopicId ? (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (activeTopic.challenge.nextTopicId) {
                                const nextId = activeTopic.challenge.nextTopicId;
                                const topicObj = DART_TOPICS.find((t) => t.id === nextId);
                                if (topicObj) handleSelectTopic(topicObj);
                              }
                            }}
                            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
                          >
                            <span>Lanjut ke Materi: {activeTopic.challenge.nextTopicTitle}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={onSwitchToFlutter}
                            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
                          >
                            <span>Lanjut ke Seluruh Silabus Flutter Mobile UI ➔</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2.5 text-rose-800 dark:text-rose-300">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                        <div>
                          <h4 className="font-bold text-sm">
                            Output Belum Sesuai
                          </h4>
                          <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                            {gradeResult.diffMessage}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1 font-mono">
                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-rose-800 dark:text-rose-400">
                            Output yang Anda Hasilkan:
                          </span>
                          <pre className="p-3 rounded-xl bg-white dark:bg-[#111114] text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-[#38161F] overflow-x-auto min-h-[70px]">
                            <code>{gradeResult.actualOutput || '(Tidak ada output yang dihasilkan)'}</code>
                          </pre>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                            Output Target yang Diharapkan:
                          </span>
                          <pre className="p-3 rounded-xl bg-white dark:bg-[#111114] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-[#1E4D33] overflow-x-auto min-h-[70px]">
                            <code>{gradeResult.expectedOutput}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PLAYGROUND BEBAS */}
          {activeTab === 'playground' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-100 dark:bg-[#111114] border border-slate-300 dark:border-[#202025] rounded-xl text-xs text-slate-700 dark:text-[#D4D4D8]">
                <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                  Playground Eksperimen Bebas:
                </span>
                <p className="text-slate-600 dark:text-[#8A8A93] text-[11px]">
                  Ketik atau ubah kode Dart di bawah, lalu klik <strong>"Jalankan Kode"</strong> untuk melihat hasil output terminal di bawah editor.
                </p>
              </div>

              <div className="relative rounded-2xl bg-slate-950 dark:bg-[#09090B] border border-slate-800 dark:border-[#202025] overflow-hidden shadow-md flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 dark:border-[#202025] bg-slate-900/80 dark:bg-[#111114] text-[11px] font-mono text-slate-400 dark:text-[#8A8A93] shrink-0">
                  <span className="text-slate-200 dark:text-[#F4F4F5]">{activeTopic.id}_playground.dart</span>
                  <span className="text-sky-400 dark:text-[#38BDF8] font-semibold text-[10px]">Playground Mode</span>
                </div>

                <div className="relative flex h-[300px] bg-slate-950 dark:bg-[#09090B] overflow-hidden font-mono text-xs">
                  {/* Gutter */}
                  <div
                    ref={gutterRef}
                    aria-hidden="true"
                    className="select-none py-3 bg-slate-900/60 dark:bg-[#0C0C0F] border-r border-slate-800 dark:border-[#202025] text-slate-500 dark:text-[#71717A] text-[11px] shrink-0 w-12 overflow-hidden pointer-events-none"
                  >
                    {Array.from({ length: playgroundLines.length }, (_, i) => (
                      <div key={i + 1} className="h-6 leading-6 flex items-center justify-end px-2">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  <div className="relative flex-1 h-full overflow-hidden">
                    <div
                      ref={highlightLayerRef}
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 overflow-hidden py-3 font-mono text-xs select-none"
                    />

                    <textarea
                      ref={textareaRef}
                      value={playgroundCode}
                      onChange={(e) => setPlaygroundCode(e.target.value)}
                      onScroll={handleScroll}
                      spellCheck={false}
                      autoCapitalize="off"
                      autoComplete="off"
                      aria-label="Editor kode Dart"
                      className="relative z-10 w-full h-full py-3 px-3 bg-transparent text-slate-100 dark:text-[#F4F4F5] font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-sky-500/30 whitespace-pre overflow-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Terminal Console Output */}
              <div className="rounded-2xl bg-slate-950 dark:bg-[#09090B] border border-slate-800 dark:border-[#202025] overflow-hidden shadow-xs">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 dark:border-[#202025] bg-slate-900/60 dark:bg-[#111114] text-[11px] font-mono text-slate-400 dark:text-[#8A8A93]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-sky-400 dark:text-[#38BDF8]" />
                    <span className="text-slate-300 dark:text-white font-semibold">Terminal Output Console</span>
                  </div>
                  <span className="text-slate-500 dark:text-[#71717A] font-mono">$ dart run</span>
                </div>

                <div className="p-4 font-mono text-xs overflow-x-auto min-h-[90px]">
                  {runResult.error ? (
                    <div className="space-y-2 text-rose-400">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold">Execution Error:</span>
                            {runResult.errorLine && (
                              <button
                                type="button"
                                onClick={jumpToErrorLine}
                                className="text-[11px] underline text-rose-300 hover:text-white"
                              >
                                Lompat ke Baris {runResult.errorLine}
                              </button>
                            )}
                          </div>
                          <p className="mt-1 whitespace-pre-wrap">{runResult.error}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <pre className="text-emerald-400 dark:text-[#34D399] whitespace-pre-wrap leading-relaxed font-mono">
                      {runResult.output}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KODE ASLI (REFERENSI) */}
          {activeTab === 'reference' && (
            <div className="relative rounded-2xl bg-slate-900 dark:bg-[#09090B] border border-slate-800 dark:border-[#202025] overflow-hidden shadow-xs">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 dark:border-[#202025] bg-slate-950/60 dark:bg-[#111114] text-[11px] font-mono text-slate-400 dark:text-[#8A8A93]">
                <span>{activeTopic.id}.dart (Read-only)</span>
                <span className="text-sky-400 dark:text-[#38BDF8] font-semibold">Dart SDK</span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 dark:text-[#F4F4F5] leading-relaxed selection:bg-sky-500/20 max-h-[360px] overflow-y-auto">
                <code>{activeTopic.dartCode}</code>
              </pre>
            </div>
          )}
        </div>
      </main>

      {/* Manual Unlock Modal Dialog */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202025] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-[#251E14] text-amber-600 dark:text-[#FBBF24] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Buka Kunci Materi Dart
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUnlockModal(false);
                  setUnlockMessage(null);
                  setManualCodeInput('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#8A8A93] leading-relaxed">
              Materi lanjutan terkunci. Selesaikan kuis pada materi sebelumnya untuk mendapatkan kode akses otomatis, atau masukkan kode akses yang telah Anda miliki di bawah ini:
            </p>

            <form onSubmit={handleManualUnlock} className="space-y-3">
              <div>
                <label htmlFor="unlock-code-input" className="sr-only">
                  Kode Akses Materi
                </label>
                <input
                  id="unlock-code-input"
                  type="text"
                  value={manualCodeInput}
                  onChange={(e) => setManualCodeInput(e.target.value)}
                  placeholder="Contoh: FREE-DART-FUNC-201"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#09090B] border border-slate-300 dark:border-[#202025] text-slate-900 dark:text-white font-mono text-xs uppercase placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {unlockMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium ${
                    unlockMessage.isError
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                  }`}
                >
                  {unlockMessage.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUnlockModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-[#8A8A93] hover:bg-slate-100 dark:hover:bg-[#18181D]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-xs"
                >
                  Buka Materi ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
