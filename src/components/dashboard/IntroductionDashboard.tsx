import React from 'react';
import { DART_TOPICS } from '../../data/dartTopics';
import { FLUTTER_TOPICS } from '../../data/flutterTopics';
import { LearningRoadmap } from './LearningRoadmap';
import {
  Code2,
  Smartphone,
  Layers,
  ArrowRight,
  Terminal,
  Zap,
  CheckCircle2,
  Bookmark,
  Play,
} from 'lucide-react';

interface IntroductionDashboardProps {
  onSelectTrack: (track: 'dart' | 'flutter') => void;
  completedTopics: string[];
  lastVisitedTrack?: 'dart' | 'flutter' | null;
  lastVisitedTopicTitle?: string | null;
  onResumeLastTopic?: () => void;
  unlockedDartTopicIds: string[];
  unlockedFlutterTopicIds: string[];
  onSelectDartTopic: (topicId: string) => void;
  onSelectFlutterTopic: (topicId: string) => void;
}

export const IntroductionDashboard: React.FC<IntroductionDashboardProps> = ({
  onSelectTrack,
  completedTopics,
  lastVisitedTrack,
  lastVisitedTopicTitle,
  onResumeLastTopic,
  unlockedDartTopicIds,
  unlockedFlutterTopicIds,
  onSelectDartTopic,
  onSelectFlutterTopic,
}) => {
  const dartCompletedCount = DART_TOPICS.filter((t) =>
    completedTopics.includes(t.id)
  ).length;
  const dartProgressPercent = Math.round(
    (dartCompletedCount / DART_TOPICS.length) * 100
  );

  const flutterCompletedCount = FLUTTER_TOPICS.filter((t) =>
    completedTopics.includes(t.id)
  ).length;
  const flutterProgressPercent = Math.round(
    (flutterCompletedCount / FLUTTER_TOPICS.length) * 100
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12 select-none">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#16161B] text-slate-700 dark:text-[#D4D4D8] border border-slate-200 dark:border-[#27272E] text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-[#38BDF8]" />
          <span>Selamat Datang di FreeLab</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F4F5] leading-tight">
          Pilih Jalur Belajar Anda: <br className="hidden sm:inline" />
          <span className="text-sky-600 dark:text-[#38BDF8]">Dart</span> atau{' '}
          <span className="text-indigo-600 dark:text-[#818CF8]">Flutter</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-[#8A8A93] leading-relaxed font-sans">
          Platform pembelajaran koding interaktif gratis tanpa instalasi SDK berat. Pelajari dasar bahasa Dart atau langsung rancang antarmuka mobile di smartphone emulator.
        </p>
      </div>

      {/* QUICK RESUME BOX: Terakhir Dipelajari */}
      {lastVisitedTopicTitle && onResumeLastTopic && (
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-[#18181F] text-sky-600 dark:text-[#38BDF8] border border-sky-100 dark:border-[#262630] flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8A8A93] uppercase tracking-wider block">
                Topik Terakhir yang Anda Buka:
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {lastVisitedTopicTitle} ({lastVisitedTrack === 'dart' ? 'Jalur Dart' : 'Jalur Flutter'})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onResumeLastTopic}
            className="py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black font-semibold text-xs flex items-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Lanjutkan Belajar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Two Main Track Selection Cards with Progress Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Track 1: Dart Track Card */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] hover:border-slate-400/60 dark:hover:border-[#33333D] hover:dark:bg-[#141418] shadow-xs hover:shadow-md transition-all group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#18181F] text-slate-800 dark:text-[#38BDF8] flex items-center justify-center border border-slate-200 dark:border-[#262630]">
                <Terminal className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#18181F] text-slate-700 dark:text-[#D4D4D8] border border-slate-200 dark:border-[#262630]">
                Jalur 1: Bahasa Pemrograman
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#38BDF8] transition-colors">
                Fondasi Bahasa Dart
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A8A93] mt-2 leading-relaxed">
                Kuasai sintaks, tipe data, Null Safety, fungsi, konsep OOP modern, dan asynchronous programming sebelum membuat aplikasi mobile.
              </p>
            </div>

            {/* REAL PROGRESS BAR DART */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0A0A0D] border border-slate-200 dark:border-[#1C1C22] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-[#A1A1AA]">
                  Progres Pembelajaran:
                </span>
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-[#38BDF8]">
                  {dartCompletedCount}/{DART_TOPICS.length} Selesai ({dartProgressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-[#1C1C22] rounded-full overflow-hidden">
                <div
                  className="h-full bg-sky-600 dark:bg-[#38BDF8] rounded-full transition-all duration-500"
                  style={{ width: `${dartProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1F1F26] text-xs">
              <span className="font-semibold text-slate-700 dark:text-[#D4D4D8] block">
                Materi yang dipelajari:
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-[#8A8A93]">
                {DART_TOPICS.map((topic) => {
                  const isDone = completedTopics.includes(topic.id);
                  return (
                    <li key={topic.id} className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isDone
                            ? 'text-emerald-500 dark:text-[#34D399]'
                            : 'text-slate-300 dark:text-[#3F3F46]'
                        }`}
                      />
                      <span className={isDone ? 'text-slate-900 dark:text-white font-medium' : ''}>
                        {topic.title}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#1F1F26]">
            <button
              type="button"
              onClick={() => onSelectTrack('dart')}
              className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-xs"
            >
              <span>{dartCompletedCount > 0 ? 'Lanjutkan Jalur Dart' : 'Mulai Belajar Dart'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Track 2: Flutter Track Card */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] hover:border-slate-400/60 dark:hover:border-[#33333D] hover:dark:bg-[#141418] shadow-xs hover:shadow-md transition-all group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-[#18181F] text-slate-800 dark:text-[#818CF8] flex items-center justify-center border border-slate-200 dark:border-[#262630]">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#18181F] text-slate-700 dark:text-[#D4D4D8] border border-slate-200 dark:border-[#262630]">
                Jalur 2: UI &amp; Mobile Framework
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#818CF8] transition-colors">
                Framework Flutter &amp; Widget
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A8A93] mt-2 leading-relaxed">
                Rancang tampilan aplikasi mobile dengan live phone emulator, inspeksi hierarki pohon widget, serta uji coba hot reload langsung di browser.
              </p>
            </div>

            {/* REAL PROGRESS BAR FLUTTER */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0A0A0D] border border-slate-200 dark:border-[#1C1C22] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-[#A1A1AA]">
                  Progres Pembelajaran:
                </span>
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-[#818CF8]">
                  {flutterCompletedCount}/{FLUTTER_TOPICS.length} Selesai ({flutterProgressPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-[#1C1C22] rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 dark:bg-[#818CF8] rounded-full transition-all duration-500"
                  style={{ width: `${flutterProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Modules List Sample */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#1F1F26] text-xs">
              <span className="font-semibold text-slate-700 dark:text-[#D4D4D8] block">
                Materi yang dipelajari:
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-[#8A8A93]">
                {FLUTTER_TOPICS.slice(0, 5).map((topic) => {
                  const isDone = completedTopics.includes(topic.id);
                  return (
                    <li key={topic.id} className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isDone
                            ? 'text-emerald-500 dark:text-[#34D399]'
                            : 'text-slate-300 dark:text-[#3F3F46]'
                        }`}
                      />
                      <span className={isDone ? 'text-slate-900 dark:text-white font-medium' : ''}>
                        {topic.title}
                      </span>
                    </li>
                  );
                })}
                <li className="text-[11px] text-slate-400 dark:text-[#71717A] pl-5">
                  + {FLUTTER_TOPICS.length - 5} modul lanjutan lainnya
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#1F1F26]">
            <button
              type="button"
              onClick={() => onSelectTrack('flutter')}
              className="w-full py-3.5 px-5 rounded-2xl bg-sky-600 dark:bg-[#0284C7] hover:bg-sky-500 dark:hover:bg-[#0369A1] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
            >
              <span>{flutterCompletedCount > 0 ? 'Lanjutkan Jalur Flutter' : 'Mulai Belajar Flutter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ROADMAP DASHBOARD SECTION */}
      <section id="roadmap-section" className="pt-4">
        <LearningRoadmap
          completedTopics={completedTopics}
          unlockedDartTopicIds={unlockedDartTopicIds}
          unlockedFlutterTopicIds={unlockedFlutterTopicIds}
          onSelectDartTopic={onSelectDartTopic}
          onSelectFlutterTopic={onSelectFlutterTopic}
        />
      </section>

      {/* Feature Highlights Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#111114] border border-slate-200 dark:border-[#202025] space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-[#F4F4F5] text-center">
          Mengapa Belajar di FreeLab?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#18181F] text-slate-800 dark:text-[#38BDF8] border border-slate-200 dark:border-[#262630] flex items-center justify-center mx-auto sm:mx-0">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Langsung di Browser
            </h4>
            <p className="text-slate-600 dark:text-[#8A8A93] leading-relaxed font-sans text-xs">
              Tidak perlu mengunduh Flutter SDK puluhan gigabyte atau emulator Android Studio yang berat di laptop Anda.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#18181F] text-slate-800 dark:text-[#818CF8] border border-slate-200 dark:border-[#262630] flex items-center justify-center mx-auto sm:mx-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Smartphone Emulator Nyata
            </h4>
            <p className="text-slate-600 dark:text-[#8A8A93] leading-relaxed font-sans text-xs">
              Uji coba tombol, input teks, switch, dan penambahan counter secara langsung dengan feedback sentuhan realistis.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#18181F] text-slate-800 dark:text-[#34D399] border border-slate-200 dark:border-[#262630] flex items-center justify-center mx-auto sm:mx-0">
              <Code2 className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Playground &amp; Hot Reload
            </h4>
            <p className="text-slate-600 dark:text-[#8A8A93] leading-relaxed font-sans text-xs">
              Tulis dan ubah kode Dart &amp; Flutter di tab Playground, lalu lihat hasilnya seketika dengan deteksi error otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
