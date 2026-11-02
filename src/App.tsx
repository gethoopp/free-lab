import { useState, useEffect, useMemo, useCallback } from 'react';
import { FLUTTER_TOPICS } from './data/flutterTopics';
import { DART_TOPICS } from './data/dartTopics';
import type { FlutterTopic, EmulatorRuntimeState } from './types/flutter';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { TopicContent } from './components/layout/TopicContent';
import { PhoneEmulator } from './components/emulator/PhoneEmulator';
import { IntroductionDashboard } from './components/dashboard/IntroductionDashboard';
import { DartWorkspace } from './components/layout/DartWorkspace';
import { KeyRound } from 'lucide-react';

const INITIAL_EMULATOR_STATE: EmulatorRuntimeState = {
  counter: 0,
  inputText: 'Budi Santoso',
  isSwitchOn: true,
  sliderValue: 65,
  containerColor: '#0284c7',
  containerRadius: 16,
  containerPadding: 20,
  flexDirection: 'column',
  mainAxisAlignment: 'center',
  crossAxisAlignment: 'center',
  buttonClicks: 0,
  activeSnackbar: null,
  listItems: [
    'Belajar Dasar Widget',
    'Memahami StatelessWidget',
    'State Management Provider',
    'Navigasi & Routing App',
    'Integrasi REST API',
  ],
  compileError: null,
};

export function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('freelab-theme');
    return saved === 'light' ? 'light' : 'dark';
  });

  // User opens directly to Introduction Dashboard first
  const [currentView, setCurrentView] = useState<'dashboard' | 'flutter' | 'dart'>('dashboard');

  // Bookmarked Topics stored in localStorage
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freelab-bookmarked-topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Manually completed topics ("Tandai Selesai") stored in localStorage
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freelab-completed-topics');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Flutter Unlocked Topics & Completed Challenges
  const [unlockedFlutterTopicIds, setUnlockedFlutterTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freelab-unlocked-flutter-topics');
      return saved ? JSON.parse(saved) : ['what-is-widget'];
    } catch {
      return ['what-is-widget'];
    }
  });

  // Dart Unlocked Topics
  const [unlockedDartTopicIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freelab-unlocked-dart-topics');
      return saved ? JSON.parse(saved) : ['dart-variables'];
    } catch {
      return ['dart-variables'];
    }
  });

  const [completedFlutterChallengeIds, setCompletedFlutterChallengeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('freelab-completed-flutter-challenges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auto-restore last visited track and topic
  const [lastVisitedTrack, setLastVisitedTrack] = useState<'dart' | 'flutter' | null>(() => {
    try {
      return (localStorage.getItem('freelab-last-track') as 'dart' | 'flutter') || null;
    } catch {
      return null;
    }
  });

  const [activeTopicId, setActiveTopicId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('freelab-last-flutter-topic');
      return saved || 'what-is-widget';
    } catch {
      return 'what-is-widget';
    }
  });

  const [showFlutterUnlockModal, setShowFlutterUnlockModal] = useState<boolean>(false);
  const [manualFlutterCodeInput, setManualFlutterCodeInput] = useState<string>('');
  const [flutterUnlockMessage, setFlutterUnlockMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileView, setMobileView] = useState<'content' | 'emulator'>('content');
  const [emulatorState, setEmulatorState] =
    useState<EmulatorRuntimeState>(INITIAL_EMULATOR_STATE);

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem('freelab-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const handleToggleBookmark = useCallback((id: string) => {
    setBookmarkedTopics((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem('freelab-bookmarked-topics', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const handleToggleTopicCompletion = useCallback((id: string) => {
    setCompletedTopics((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem('freelab-completed-topics', JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Filter Flutter topics based on search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return FLUTTER_TOPICS;
    const q = searchQuery.toLowerCase();
    return FLUTTER_TOPICS.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Current active Flutter topic
  const activeTopic: FlutterTopic = useMemo(() => {
    return (
      FLUTTER_TOPICS.find((t) => t.id === activeTopicId) || FLUTTER_TOPICS[0]
    );
  }, [activeTopicId]);

  // Track last visited topic title for quick resume on Dashboard
  const lastVisitedTopicTitle = useMemo(() => {
    if (lastVisitedTrack === 'dart') {
      const topicId = localStorage.getItem('freelab-last-dart-topic');
      const found = DART_TOPICS.find((t) => t.id === topicId);
      return found ? found.title : DART_TOPICS[0].title;
    } else if (lastVisitedTrack === 'flutter') {
      const topicId = localStorage.getItem('freelab-last-flutter-topic');
      const found = FLUTTER_TOPICS.find((t) => t.id === topicId);
      return found ? found.title : FLUTTER_TOPICS[0].title;
    }
    return null;
  }, [lastVisitedTrack]);

  // Stable callback that never triggers infinite loops or editor resets
  const handleUpdateEmulatorState = useCallback(
    (updates: Partial<EmulatorRuntimeState>) => {
      setEmulatorState((prev) => ({ ...prev, ...updates }));
    },
    []
  );

  const handleResetEmulator = useCallback(() => {
    setEmulatorState(INITIAL_EMULATOR_STATE);
  }, []);

  const handleSelectFlutterTopic = useCallback((id: string) => {
    if (!unlockedFlutterTopicIds.includes(id)) {
      setShowFlutterUnlockModal(true);
      return;
    }
    setActiveTopicId(id);
    try {
      localStorage.setItem('freelab-last-flutter-topic', id);
      localStorage.setItem('freelab-last-track', 'flutter');
      setLastVisitedTrack('flutter');
    } catch {}
  }, [unlockedFlutterTopicIds]);

  const handleFlutterChallengeCompleted = useCallback((topicId: string, nextTopicId?: string) => {
    setCompletedFlutterChallengeIds((prev) => {
      if (!prev.includes(topicId)) {
        const next = [...prev, topicId];
        try {
          localStorage.setItem('freelab-completed-flutter-challenges', JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });

    // Also mark topic as completed
    if (!completedTopics.includes(topicId)) {
      handleToggleTopicCompletion(topicId);
    }

    if (nextTopicId) {
      setUnlockedFlutterTopicIds((prev) => {
        if (!prev.includes(nextTopicId)) {
          const next = [...prev, nextTopicId];
          try {
            localStorage.setItem('freelab-unlocked-flutter-topics', JSON.stringify(next));
          } catch {}
          return next;
        }
        return prev;
      });
    }
  }, [completedTopics, handleToggleTopicCompletion]);

  const handleManualFlutterUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualFlutterCodeInput.trim().toUpperCase();
    const matchingTopic = FLUTTER_TOPICS.find(
      (t) => t.challenge.unlockCode.toUpperCase() === code
    );

    if (matchingTopic && matchingTopic.challenge.nextTopicId) {
      const nextId = matchingTopic.challenge.nextTopicId;
      setUnlockedFlutterTopicIds((prev) => {
        const updated = prev.includes(nextId) ? prev : [...prev, nextId];
        try {
          localStorage.setItem('freelab-unlocked-flutter-topics', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setFlutterUnlockMessage({
        text: `Berhasil! Modul "${matchingTopic.challenge.nextTopicTitle}" telah dibuka.`,
        isError: false,
      });
      setTimeout(() => {
        setShowFlutterUnlockModal(false);
        setActiveTopicId(nextId);
        setFlutterUnlockMessage(null);
        setManualFlutterCodeInput('');
      }, 1500);
    } else if (code === 'FREE-FLUTTER-MASTER-999') {
      setFlutterUnlockMessage({
        text: 'Selamat! Kode ini membuktikan Anda telah menyelesaikan seluruh tantangan Flutter!',
        isError: false,
      });
    } else {
      setFlutterUnlockMessage({
        text: 'Kode akses tidak valid. Periksa kembali huruf dan angka kode.',
        isError: true,
      });
    }
  };

  const handleResumeLastTopic = useCallback(() => {
    const track = lastVisitedTrack || 'flutter';
    setCurrentView(track);
  }, [lastVisitedTrack]);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors ${
        theme === 'dark'
          ? 'bg-[#09090B] text-[#F4F4F5]'
          : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Header Landmark (R-39) with FreeLab Branding */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        theme={theme}
        onToggleTheme={toggleTheme}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mobileView={mobileView}
        onMobileViewChange={setMobileView}
      />

      {/* VIEW 1: INTRODUCTION DASHBOARD (Default Landing View) */}
      {currentView === 'dashboard' && (
        <main className="flex-1 w-full">
          <IntroductionDashboard
            onSelectTrack={(track) => {
              setCurrentView(track);
              setLastVisitedTrack(track);
              try {
                localStorage.setItem('freelab-last-track', track);
              } catch {}
            }}
            completedTopics={completedTopics}
            lastVisitedTrack={lastVisitedTrack}
            lastVisitedTopicTitle={lastVisitedTopicTitle}
            onResumeLastTopic={handleResumeLastTopic}
            unlockedDartTopicIds={unlockedDartTopicIds}
            unlockedFlutterTopicIds={unlockedFlutterTopicIds}
            onSelectDartTopic={(topicId) => {
              try {
                localStorage.setItem('freelab-last-dart-topic', topicId);
                localStorage.setItem('freelab-last-track', 'dart');
              } catch {}
              setLastVisitedTrack('dart');
              setCurrentView('dart');
            }}
            onSelectFlutterTopic={(topicId) => {
              handleSelectFlutterTopic(topicId);
              setCurrentView('flutter');
            }}
          />
        </main>
      )}

      {/* VIEW 2: DART LEARNING WORKSPACE */}
      {currentView === 'dart' && (
        <DartWorkspace
          onBackToDashboard={() => setCurrentView('dashboard')}
          onSwitchToFlutter={() => {
            setCurrentView('flutter');
            setLastVisitedTrack('flutter');
            try {
              localStorage.setItem('freelab-last-track', 'flutter');
            } catch {}
          }}
          bookmarkedTopics={bookmarkedTopics}
          onToggleBookmark={handleToggleBookmark}
          completedTopics={completedTopics}
          onToggleTopicCompletion={handleToggleTopicCompletion}
          onTopicVisited={(t) => {
            setLastVisitedTrack('dart');
            try {
              localStorage.setItem('freelab-last-track', 'dart');
              localStorage.setItem('freelab-last-dart-topic', t.id);
            } catch {}
          }}
        />
      )}

      {/* VIEW 3: FLUTTER LEARNING WORKSPACE WITH EMULATOR */}
      {currentView === 'flutter' && (
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
          {/* Left Nav: Curriculum Topics Sidebar */}
          <aside
            aria-label="Daftar Modul Pembelajaran Flutter"
            className="lg:w-60 xl:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#202025] pb-4 lg:pb-0 lg:pr-5"
          >
            <div className="sticky top-20">
              <Sidebar
                topics={filteredTopics}
                activeTopicId={activeTopic.id}
                onSelectTopic={handleSelectFlutterTopic}
                bookmarkedTopics={bookmarkedTopics}
                onToggleBookmark={handleToggleBookmark}
                unlockedTopicIds={unlockedFlutterTopicIds}
                completedChallengeIds={completedFlutterChallengeIds}
                completedTopics={completedTopics}
                onRequestUnlockModal={() => setShowFlutterUnlockModal(true)}
              />
            </div>
          </aside>

          {/* Center Panel: Topic Content & Live Tweak Controls */}
          <section
            aria-label="Materi Pembelajaran dan Kode"
            className={`flex-1 min-w-0 ${
              mobileView === 'emulator' ? 'hidden lg:block' : 'block'
            }`}
          >
            <TopicContent
              topic={activeTopic}
              emulatorState={emulatorState}
              onUpdateState={handleUpdateEmulatorState}
              isBookmarked={bookmarkedTopics.includes(activeTopic.id)}
              onToggleBookmark={handleToggleBookmark}
              isChallengeCompleted={completedFlutterChallengeIds.includes(activeTopic.id)}
              onChallengeCompleted={handleFlutterChallengeCompleted}
              onNavigateTopic={handleSelectFlutterTopic}
              isTopicCompleted={completedTopics.includes(activeTopic.id)}
              onToggleTopicCompletion={handleToggleTopicCompletion}
            />
          </section>

          {/* Right Panel: Phone Emulator (Sticky on Desktop) */}
          <section
            aria-label="Emulator Smartphone Interaktif"
            className={`lg:w-[370px] shrink-0 ${
              mobileView === 'content' ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="sticky top-20 flex flex-col items-center">
              <PhoneEmulator
                topic={activeTopic}
                state={emulatorState}
                onUpdateState={handleUpdateEmulatorState}
                onReset={handleResetEmulator}
              />
            </div>
          </section>
        </main>
      )}

      {/* Manual Unlock Modal Dialog for Flutter */}
      {showFlutterUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#202025] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-[#251E14] text-amber-600 dark:text-[#FBBF24] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Buka Kunci Modul Flutter
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowFlutterUnlockModal(false);
                  setFlutterUnlockMessage(null);
                  setManualFlutterCodeInput('');
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold p-1 rounded"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-[#8A8A93] leading-relaxed">
              Modul Flutter lanjutan ini masih terkunci. Selesaikan tantangan kuis pada modul sebelumnya untuk mendapatkan kode akses otomatis, atau masukkan kode akses yang telah Anda peroleh di bawah ini:
            </p>

            <form onSubmit={handleManualFlutterUnlock} className="space-y-3">
              <div>
                <label htmlFor="flutter-unlock-code-input" className="sr-only">
                  Kode Akses Modul Flutter
                </label>
                <input
                  id="flutter-unlock-code-input"
                  type="text"
                  value={manualFlutterCodeInput}
                  onChange={(e) => setManualFlutterCodeInput(e.target.value)}
                  placeholder="Contoh: FREE-FLUTTER-STATE-101"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#09090B] border border-slate-300 dark:border-[#202025] text-slate-900 dark:text-white font-mono text-xs uppercase placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {flutterUnlockMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium ${
                    flutterUnlockMessage.isError
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                  }`}
                >
                  {flutterUnlockMessage.text}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFlutterUnlockModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-[#8A8A93] hover:bg-slate-100 dark:hover:bg-[#18181D]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-xs"
                >
                  Buka Modul ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Landmark (R-39) */}
      <footer className="border-t border-slate-200 dark:border-[#202025] py-6 px-4 text-center text-xs text-slate-600 dark:text-[#8A8A93] bg-white/70 dark:bg-[#09090B] mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            FreeLab: Platform Pembelajaran Pemrograman Dart &amp; Flutter
            Interaktif.
          </p>
          <p className="text-[11px] text-slate-500">
            Created By Haliim Pamungkas • Mematuhi panduan best practices &amp; standar kode flutter dan dart.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
