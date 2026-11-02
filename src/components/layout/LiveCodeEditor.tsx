import React, { useState, useEffect, useRef } from 'react';
import type { FlutterTopic, EmulatorRuntimeState } from '../../types/flutter';
import { parseAndValidateFlutterCode } from '../../utils/flutterCodeParser';
import {
  evaluateFlutterChallenge,
} from '../../utils/flutterQuizGrader';
import type { FlutterGradeEvaluation } from '../../utils/flutterQuizGrader';
import {
  Play,
  RotateCcw,
  Copy,
  Check,
  Code2,
  AlertTriangle,
  ArrowRight,
  FileCode2,
  Terminal,
  Crosshair,
  Award,
  CheckCircle2,
  KeyRound,
  Lightbulb,
} from 'lucide-react';

interface LiveCodeEditorProps {
  topic: FlutterTopic;
  emulatorState: EmulatorRuntimeState;
  onUpdateState: (updates: Partial<EmulatorRuntimeState>) => void;
  isChallengeCompleted: boolean;
  onChallengeCompleted: (topicId: string, nextTopicId?: string) => void;
  onNavigateTopic?: (topicId: string) => void;
}

export const LiveCodeEditor: React.FC<LiveCodeEditorProps> = ({
  topic,
  emulatorState,
  onUpdateState,
  isChallengeCompleted,
  onChallengeCompleted,
  onNavigateTopic,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'playground' | 'reference'>('quiz');
  const [playgroundCode, setPlaygroundCode] = useState<string>(topic.dartCode);
  const [quizCode, setQuizCode] = useState<string>(topic.challenge.starterCode);
  const [gradeResult, setGradeResult] = useState<FlutterGradeEvaluation | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedUnlockCode, setCopiedUnlockCode] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const quizTextareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const quizGutterRef = useRef<HTMLDivElement>(null);
  const highlightLayerRef = useRef<HTMLDivElement>(null);
  const quizHighlightLayerRef = useRef<HTMLDivElement>(null);
  const lastTopicIdRef = useRef<string>(topic.id);

  const errorLine = emulatorState.compileError?.line;

  // Auto-scroll to error line when compileError line changes
  useEffect(() => {
    if (errorLine) {
      const targetScroll = Math.max(0, (errorLine - 3) * 24);
      if (activeTab === 'playground' && textareaRef.current) {
        textareaRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
      } else if (activeTab === 'quiz' && quizTextareaRef.current) {
        quizTextareaRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    }
  }, [errorLine, activeTab]);

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
    if (errorLine) {
      const targetScroll = Math.max(0, (errorLine - 3) * 24);
      const targetRef = activeTab === 'quiz' ? quizTextareaRef : textareaRef;
      if (targetRef.current) {
        targetRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
        targetRef.current.focus();
      }
    }
  };

  // Reset codes when active topic genuinely changes
  useEffect(() => {
    if (lastTopicIdRef.current !== topic.id) {
      lastTopicIdRef.current = topic.id;
      setPlaygroundCode(topic.dartCode);
      setQuizCode(topic.challenge.starterCode);
      setGradeResult(null);
      setShowHint(false);
    }
  }, [topic.id, topic.dartCode, topic.challenge.starterCode]);

  // Tab key handler for 2 spaces indentation
  const handleTabKey = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    currentText: string,
    setText: (s: string) => void,
    ref: React.RefObject<HTMLTextAreaElement | null>
  ) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'Enter')) {
      e.preventDefault();
      if (activeTab === 'quiz') handleEvaluateQuiz();
      else handleRunCode();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newCode = currentText.substring(0, start) + '  ' + currentText.substring(end);
      setText(newCode);

      requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.selectionStart = ref.current.selectionEnd = start + 2;
        }
      });
    }
  };

  // Run code inside Playground mode
  const handleRunCode = () => {
    const result = parseAndValidateFlutterCode(playgroundCode, topic.id);

    if (result.success) {
      onUpdateState(result.updates);
    } else {
      onUpdateState({ compileError: result.error });
    }
  };

  // Auto-grade quiz challenge
  const handleEvaluateQuiz = () => {
    const parseResult = parseAndValidateFlutterCode(quizCode, topic.id);

    if (!parseResult.success) {
      onUpdateState({ compileError: parseResult.error });
      setGradeResult({
        passed: false,
        passedCount: 0,
        totalCount: topic.challenge.criteria.length,
        criteriaResults: topic.challenge.criteria.map((c) => ({
          id: c.id,
          label: c.label,
          passed: false,
        })),
        message: `Sintaks error: ${parseResult.error?.message}`,
      });
      return;
    }

    // Apply updates to phone emulator so user sees their solution live!
    onUpdateState(parseResult.updates);

    // Evaluate criteria
    const evaluation = evaluateFlutterChallenge(
      topic.id,
      quizCode,
      parseResult.updates,
      topic.challenge
    );
    setGradeResult(evaluation);

    if (evaluation.passed) {
      onChallengeCompleted(topic.id, topic.challenge.nextTopicId);
    }
  };

  const handleResetQuiz = () => {
    setQuizCode(topic.challenge.starterCode);
    setGradeResult(null);
    onUpdateState({ compileError: null });
  };

  const handleResetPlayground = () => {
    setPlaygroundCode(topic.dartCode);
    onUpdateState({
      compileError: null,
      customAppBarTitle: undefined,
      appBarColor: undefined,
      customBodyText: undefined,
      fontSize: undefined,
      fontWeight: undefined,
      textAlign: undefined,
      textColor: undefined,
      containerWidth: undefined,
      containerHeight: undefined,
      buttonBgColor: undefined,
      buttonFgColor: undefined,
      customButtonLabel: undefined,
      customInputLabel: undefined,
      customBadgeText: undefined,
    });
  };

  const handleCopyCode = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleCopyUnlockCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedUnlockCode(true);
      setTimeout(() => setCopiedUnlockCode(false), 2000);
    } catch {
      setCopiedUnlockCode(false);
    }
  };

  const playgroundLines = playgroundCode.split('\n');
  const quizLines = quizCode.split('\n');

  return (
    <div className="space-y-4">
      {/* 3 Tabs: 1. Quiz & Tantangan, 2. Playground Bebas, 3. Kode Asli */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-[#221F33] pb-3">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-[#12101B] border border-slate-200 dark:border-[#221F33] rounded-xl text-xs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'quiz'}
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'quiz'
                ? 'bg-amber-500 text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>1. Quiz &amp; Mini-Challenge</span>
            {isChallengeCompleted && <CheckCircle2 className="w-3 h-3 text-white ml-0.5" />}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'playground'}
            onClick={() => setActiveTab('playground')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'playground'
                ? 'bg-sky-600 dark:bg-[#7C3AED] text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
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
                ? 'bg-white dark:bg-[#201C30] text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>3. Kode Asli (Referensi)</span>
          </button>
        </div>

        {/* Toolbar Action Buttons */}
        <div className="flex items-center gap-2">
          {activeTab === 'quiz' ? (
            <>
              <button
                type="button"
                onClick={handleResetQuiz}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#12101B] hover:bg-slate-200 dark:hover:bg-[#1C172E] border border-slate-200 dark:border-[#221F33] rounded-lg transition-colors"
                title="Muat ulang kerangka soal kosong"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Soal</span>
              </button>

              <button
                type="button"
                onClick={handleEvaluateQuiz}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 active:scale-95 shadow-sm rounded-lg transition-all ring-1 ring-amber-400/40"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Periksa Jawaban (Auto-Grade)</span>
              </button>
            </>
          ) : activeTab === 'playground' ? (
            <>
              <button
                type="button"
                onClick={handleResetPlayground}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#12101B] hover:bg-slate-200 dark:hover:bg-[#1C172E] border border-slate-200 dark:border-[#221F33] rounded-lg transition-colors"
                title="Muat ulang kode asli ke playground"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>

              <button
                type="button"
                onClick={handleRunCode}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-600 dark:bg-[#7C3AED] hover:bg-sky-500 dark:hover:bg-[#6D28D9] active:scale-95 shadow-sm rounded-lg transition-all ring-1 ring-sky-400/40 dark:ring-[#9353FF]/40"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simpan &amp; Jalankan</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => handleCopyCode(topic.dartCode)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[#C4C2D1] hover:text-slate-950 dark:hover:text-white bg-slate-100 dark:bg-[#12101B] hover:bg-slate-200 dark:hover:bg-[#1C172E] border border-slate-200 dark:border-[#221F33] rounded-lg transition-colors"
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

      {/* TAB 1: QUIZ & MINI-CHALLENGE WITH SKELETON CODE */}
      {activeTab === 'quiz' && (
        <div className="space-y-4">
          {/* Challenge Instruction Card */}
          <div className="p-4 bg-amber-50/70 dark:bg-[#1C172E] border border-amber-200 dark:border-[#3B2D5C] rounded-2xl text-xs space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 dark:text-[#FBBF24]" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  Tantangan Widget: {topic.title}
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase font-bold text-amber-700 dark:text-[#FBBF24] bg-amber-100 dark:bg-[#282142] px-2 py-0.5 rounded-full border border-amber-300 dark:border-[#4B3B6E]">
                Auto-Grading
              </span>
            </div>

            <p className="text-slate-700 dark:text-[#C4C2D1] leading-relaxed">
              {topic.challenge.instruction}
            </p>

            {/* Criteria Checklist Preview */}
            <div className="space-y-1.5 pt-1 border-t border-amber-200/60 dark:border-[#3B2D5C]/60">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-[#8E8C9A] block">
                Kriteria Penyelesaian:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                {topic.challenge.criteria.map((c) => (
                  <li key={c.id} className="flex items-center gap-1.5 text-slate-600 dark:text-[#C4C2D1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
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
                <div className="mt-2 p-2.5 rounded-xl bg-white/80 dark:bg-[#12101B] border border-amber-200 dark:border-[#3B2D5C] text-[11px] text-slate-700 dark:text-[#C4C2D1]">
                  {topic.challenge.hint}
                </div>
              )}
            </div>
          </div>

          {/* Quiz Code Editor with Gutter and Error Highlight */}
          <div className="relative rounded-2xl bg-slate-950 dark:bg-[#0B0A11] border border-slate-800 dark:border-[#221F33] overflow-hidden shadow-md flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 dark:border-[#221F33] bg-slate-900/80 dark:bg-[#12101B] text-[11px] font-mono text-slate-400 dark:text-[#8E8C9A] shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-slate-200 dark:text-[#F3F4F6] font-semibold">{topic.id}_challenge.dart</span>
              </div>
              <div className="flex items-center gap-3">
                {errorLine && (
                  <button
                    type="button"
                    onClick={jumpToErrorLine}
                    className="flex items-center gap-1 text-rose-400 dark:text-rose-300 bg-rose-950/70 hover:bg-rose-900/90 border border-rose-800/80 px-2 py-0.5 rounded text-[10px] font-semibold transition-colors"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Lompat ke Baris {errorLine}</span>
                  </button>
                )}
                <span className="text-amber-400 font-semibold text-[10px]">Tantangan Mandiri</span>
              </div>
            </div>

            <div className="relative flex h-[340px] bg-slate-950 dark:bg-[#0B0A11] overflow-hidden font-mono text-xs">
              {/* Gutter */}
              <div
                ref={quizGutterRef}
                aria-hidden="true"
                className="select-none py-3 bg-slate-900/60 dark:bg-[#0E0C17] border-r border-slate-800 dark:border-[#221F33] text-slate-500 dark:text-[#6C687E] text-[11px] shrink-0 w-12 overflow-hidden pointer-events-none"
              >
                {Array.from({ length: quizLines.length }, (_, i) => {
                  const num = i + 1;
                  const isError = num === errorLine;
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

              {/* Textarea & Underlay */}
              <div className="relative flex-1 h-full overflow-hidden">
                <div
                  ref={quizHighlightLayerRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 overflow-hidden py-3 font-mono text-xs select-none"
                >
                  {Array.from({ length: quizLines.length }, (_, i) => {
                    const num = i + 1;
                    const isError = num === errorLine;
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
                  onKeyDown={(e) => handleTabKey(e, quizCode, setQuizCode, quizTextareaRef)}
                  onScroll={handleQuizScroll}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Editor kode kuis Flutter"
                  className="relative z-10 w-full h-full py-3 px-3 bg-transparent text-slate-100 dark:text-[#F3F4F6] font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-amber-500/30 whitespace-pre overflow-auto"
                  placeholder="// Lengkapi kerangka soal Flutter di sini..."
                />
              </div>
            </div>
          </div>

          {/* FLUTTER AUTO-GRADING EVALUATION CARD */}
          {gradeResult && (
            <div
              className={`p-5 rounded-2xl border transition-all animate-fade-in space-y-4 ${
                gradeResult.passed
                  ? 'bg-emerald-50 dark:bg-[#0F2418] border-emerald-300 dark:border-[#1E4D33]'
                  : 'bg-rose-50 dark:bg-[#251017] border-rose-300 dark:border-[#521E2C]'
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
                        Luar Biasa! Semua Kriteria Berhasil Dipenuhi!
                      </h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Widget yang Anda rancang telah memenuhi seluruh spesifikasi tantangan.
                      </p>
                    </div>
                  </div>

                  {/* Secret Unlock Code Showcase */}
                  <div className="p-4 rounded-xl bg-white dark:bg-[#12101B] border border-emerald-300 dark:border-[#221F33] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8E8C9A] uppercase tracking-wider flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                        <span>Kode Akses Materi Selanjutnya:</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-[#34D399] font-medium">
                        Tersimpan Otomatis
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-50 dark:bg-[#0B0A11] border border-slate-200 dark:border-[#221F33]">
                      <span className="font-mono text-sm sm:text-base font-extrabold tracking-wider text-slate-900 dark:text-[#F3F4F6] selection:bg-emerald-500/30">
                        {topic.challenge.unlockCode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyUnlockCode(topic.challenge.unlockCode)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shrink-0 shadow-xs"
                      >
                        {copiedUnlockCode ? (
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
                  {topic.challenge.nextTopicId && onNavigateTopic ? (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (topic.challenge.nextTopicId) {
                            onNavigateTopic(topic.challenge.nextTopicId);
                          }
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
                      >
                        <span>Lanjut ke Materi: {topic.challenge.nextTopicTitle}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-rose-800 dark:text-rose-300">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                    <div>
                      <h4 className="font-bold text-sm">
                        Tantangan Belum Lengkap ({gradeResult.passedCount} dari {gradeResult.totalCount} Kriteria Terpenuhi)
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                        {gradeResult.message}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Checklist of what passed and what failed */}
                  <div className="space-y-1.5 pt-1">
                    {gradeResult.criteriaResults.map((c) => (
                      <div
                        key={c.id}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono ${
                          c.passed
                            ? 'bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-100/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.passed ? '✓' : '✗'}</span>
                          <span>{c.label}</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold">
                          {c.passed ? 'Lulus' : 'Belum Sesuai'}
                        </span>
                      </div>
                    ))}
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
          <div className="p-3 bg-slate-100 dark:bg-[#12101B] border border-slate-300 dark:border-[#221F33] rounded-xl text-xs text-slate-700 dark:text-[#C4C2D1]">
            <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
              Playground Eksperimen Bebas:
            </span>
            <p className="text-slate-600 dark:text-[#8E8C9A] text-[11px]">
              Ketik atau ubah kode Flutter di bawah, lalu klik <strong>"Simpan &amp; Jalankan"</strong> (atau tekan Ctrl+S) untuk melihat hasil seketika di layar smartphone emulator di sebelah kanan.
            </p>
          </div>

          <div className="relative rounded-2xl bg-slate-950 dark:bg-[#0B0A11] border border-slate-800 dark:border-[#221F33] overflow-hidden shadow-md flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 dark:border-[#221F33] bg-slate-900/80 dark:bg-[#12101B] text-[11px] font-mono text-slate-400 dark:text-[#8E8C9A]">
              <span className="text-slate-200 dark:text-[#F3F4F6]">{topic.id}_playground.dart</span>
              <span className="text-sky-400 dark:text-[#A78BFA] font-semibold text-[10px]">Playground Mode</span>
            </div>

            <div className="relative flex h-[360px] bg-slate-950 dark:bg-[#0B0A11] overflow-hidden font-mono text-xs">
              {/* Gutter */}
              <div
                ref={gutterRef}
                aria-hidden="true"
                className="select-none py-3 bg-slate-900/60 dark:bg-[#0E0C17] border-r border-slate-800 dark:border-[#221F33] text-slate-500 dark:text-[#6C687E] text-[11px] shrink-0 w-12 overflow-hidden pointer-events-none"
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
                  onKeyDown={(e) => handleTabKey(e, playgroundCode, setPlaygroundCode, textareaRef)}
                  onScroll={handleScroll}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Playground editor kode Flutter"
                  className="relative z-10 w-full h-full py-3 px-3 bg-transparent text-slate-100 dark:text-[#F3F4F6] font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-sky-500/30 selection:dark:bg-[#7C3AED]/30 whitespace-pre overflow-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: KODE ASLI (REFERENSI) */}
      {activeTab === 'reference' && (
        <div className="space-y-3">
          <div className="p-3 bg-sky-50 dark:bg-[#161226] border border-sky-200 dark:border-[#3B2D5C] rounded-xl text-xs text-sky-800 dark:text-[#C4B5FD] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-600 dark:text-[#A78BFA] shrink-0" />
              <span>
                Ini adalah kode referensi resmi modul. Anda bisa mempelajarinya atau menyalinnya langsung ke Playground untuk bereksperimen.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setPlaygroundCode(topic.dartCode);
                setActiveTab('playground');
              }}
              className="text-xs font-bold text-sky-700 dark:text-[#A78BFA] hover:underline shrink-0 ml-2"
            >
              Buka di Playground ➔
            </button>
          </div>

          <div className="relative rounded-2xl bg-slate-900 dark:bg-[#0B0A11] border border-slate-800 dark:border-[#221F33] overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 dark:border-[#221F33] bg-slate-950/60 dark:bg-[#12101B] text-[11px] font-mono text-slate-400 dark:text-[#8E8C9A]">
              <span>{topic.id}_reference.dart (Read-only)</span>
              <span className="text-sky-400 dark:text-[#A78BFA] font-semibold">Flutter / Dart SDK</span>
            </div>
            <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 dark:text-[#F3F4F6] leading-relaxed selection:bg-sky-500/20 selection:dark:bg-[#7C3AED]/30 max-h-[460px] overflow-y-auto">
              <code>{topic.dartCode}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
