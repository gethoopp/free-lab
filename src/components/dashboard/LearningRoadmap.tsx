import React, { useState } from 'react';
import { DART_TOPICS } from '../../data/dartTopics';
import { FLUTTER_TOPICS } from '../../data/flutterTopics';
import {
  CheckCircle2,
  Lock,
  Play,
  ArrowRight,
  Terminal,
  Smartphone,
  Map,
  Award,
} from 'lucide-react';

interface LearningRoadmapProps {
  completedTopics: string[];
  unlockedDartTopicIds: string[];
  unlockedFlutterTopicIds: string[];
  onSelectDartTopic: (topicId: string) => void;
  onSelectFlutterTopic: (topicId: string) => void;
}

export const LearningRoadmap: React.FC<LearningRoadmapProps> = ({
  completedTopics,
  unlockedDartTopicIds,
  unlockedFlutterTopicIds,
  onSelectDartTopic,
  onSelectFlutterTopic,
}) => {
  const [activeTrack, setActiveTrack] = useState<'dart' | 'flutter'>('flutter');

  const topics = activeTrack === 'dart' ? DART_TOPICS : FLUTTER_TOPICS;
  const unlockedIds =
    activeTrack === 'dart' ? unlockedDartTopicIds : unlockedFlutterTopicIds;
  const onSelectTopic =
    activeTrack === 'dart' ? onSelectDartTopic : onSelectFlutterTopic;

  const completedCount = topics.filter((t) =>
    completedTopics.includes(t.id)
  ).length;
  const progressPercent = Math.round((completedCount / topics.length) * 100);

  return (
    <div className="space-y-8 select-none">
      {/* Roadmap Header & Track Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#202025] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8A8A93]">
            <Map className="w-4 h-4 text-sky-600 dark:text-[#38BDF8]" />
            <span>Peta Jalur Belajar (Learning Roadmap)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
            Visualisasi Perkembangan Modul
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A8A93] mt-0.5">
            Garis penghubung antar modul akan berubah warna secara otomatis saat Anda menyelesaikan materi.
          </p>
        </div>

        {/* Track Selector Pills */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-[#111114] border border-slate-200 dark:border-[#202025] rounded-2xl text-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTrack('flutter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeTrack === 'flutter'
                ? 'bg-sky-600 dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Roadmap Flutter ({FLUTTER_TOPICS.length} Modul)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTrack('dart')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeTrack === 'dart'
                ? 'bg-sky-600 dark:bg-white text-white dark:text-black shadow-xs'
                : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Roadmap Dart ({DART_TOPICS.length} Modul)</span>
          </button>
        </div>
      </div>

      {/* Progress Milestone Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#16161B] text-slate-800 dark:text-[#38BDF8] border border-slate-200 dark:border-[#26262E] flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-[#8A8A93] uppercase tracking-wider block">
              Status Jalur {activeTrack === 'dart' ? 'Dart' : 'Flutter'}:
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {completedCount} dari {topics.length} Modul Selesai ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="w-full sm:w-48 space-y-1">
          <div className="h-2.5 w-full bg-slate-200 dark:bg-[#1C1C22] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                activeTrack === 'dart'
                  ? 'bg-sky-600 dark:bg-[#38BDF8]'
                  : 'bg-indigo-600 dark:bg-[#818CF8]'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* VISUAL ROADMAP TIMELINE NODES */}
      <div className="relative pl-4 sm:pl-8 space-y-8 max-w-4xl mx-auto py-2">
        {topics.map((topic, index) => {
          const isCompleted = completedTopics.includes(topic.id);
          const isUnlocked = unlockedIds.includes(topic.id);
          const isNextInLine = isUnlocked && !isCompleted;
          const isLast = index === topics.length - 1;

          // Connecting line state to the NEXT node:
          // The line turns colored (emerald/green) if THIS topic is completed!
          const isLineActive = isCompleted;

          return (
            <div key={topic.id} className="relative flex items-start gap-4 sm:gap-6 group">
              {/* CONNECTING LINE TO NEXT NODE */}
              {!isLast && (
                <div
                  aria-hidden="true"
                  className={`absolute left-[19px] sm:left-[23px] top-[46px] w-[3px] -bottom-8 rounded-full transition-colors duration-500 ${
                    isLineActive
                      ? 'bg-emerald-500 dark:bg-[#34D399] shadow-xs'
                      : 'bg-slate-200 dark:bg-[#202025]'
                  }`}
                />
              )}

              {/* NODE CIRCLE INDICATOR */}
              <div className="relative z-10 shrink-0">
                {isCompleted ? (
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500 dark:bg-[#122419] border-2 border-emerald-500 dark:border-[#34D399] text-white dark:text-[#34D399] flex items-center justify-center shadow-sm"
                    title="Modul Selesai"
                  >
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                ) : isNextInLine ? (
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-600 dark:bg-white text-white dark:text-black font-extrabold text-sm flex items-center justify-center shadow-md ring-4 ring-sky-500/20 dark:ring-white/20 animate-pulse-subtle"
                    title="Modul Siap Dipelajari"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                ) : !isUnlocked ? (
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 dark:bg-[#141418] border border-slate-300 dark:border-[#202025] text-slate-400 dark:text-[#52525B] flex items-center justify-center"
                    title="Modul Terkunci"
                  >
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                ) : (
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-[#111114] border-2 border-slate-300 dark:border-[#26262E] text-slate-700 dark:text-[#D4D4D8] font-bold text-sm flex items-center justify-center"
                    title="Modul Terbuka"
                  >
                    {index + 1}
                  </div>
                )}
              </div>

              {/* NODE CARD CONTENT */}
              <div
                className={`flex-1 p-4 sm:p-5 rounded-2xl border transition-all ${
                  isNextInLine
                    ? 'bg-white dark:bg-[#111114] border-sky-500/60 dark:border-white/40 shadow-sm ring-1 ring-sky-500/10'
                    : isCompleted
                    ? 'bg-white dark:bg-[#111114] border-slate-200 dark:border-[#202025]'
                    : isUnlocked
                    ? 'bg-white dark:bg-[#111114] border-slate-200 dark:border-[#202025]'
                    : 'bg-slate-50/70 dark:bg-[#0C0C0F] border-slate-200/60 dark:border-[#1A1A20] opacity-75'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-500 dark:text-[#8A8A93]">
                      Langkah {index + 1}
                    </span>
                    <span className="text-slate-300 dark:text-[#33333D]">•</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#16161B] text-slate-600 dark:text-[#A1A1AA] border border-slate-200 dark:border-[#26262E]">
                      {topic.difficulty}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-[#122419] text-emerald-700 dark:text-[#34D399] border border-emerald-300 dark:border-[#1E4D33]'
                        : isNextInLine
                        ? 'bg-sky-100 dark:bg-[#18181F] text-sky-700 dark:text-[#38BDF8] border border-sky-300 dark:border-[#262630]'
                        : !isUnlocked
                        ? 'bg-slate-200/60 dark:bg-[#141418] text-slate-500 dark:text-[#52525B]'
                        : 'bg-slate-100 dark:bg-[#16161B] text-slate-600 dark:text-[#8A8A93]'
                    }`}
                  >
                    {isCompleted
                      ? '✓ Selesai'
                      : isNextInLine
                      ? '▶ Sedang Dipelajari'
                      : !isUnlocked
                      ? '🔒 Terkunci'
                      : 'Siap'}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  {topic.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8A8A93] mt-1 leading-relaxed">
                  {topic.subtitle}
                </p>

                {/* Node Action Button */}
                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-[#1C1C22] flex items-center justify-between">
                  {isUnlocked ? (
                    <button
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-all ${
                        isNextInLine
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-black hover:opacity-90 shadow-xs'
                          : isCompleted
                          ? 'text-emerald-700 dark:text-[#34D399] hover:bg-emerald-50 dark:hover:bg-[#122419]'
                          : 'text-sky-600 dark:text-[#38BDF8] hover:bg-slate-100 dark:hover:bg-[#18181D]'
                      }`}
                    >
                      <span>
                        {isCompleted
                          ? 'Buka / Pelajari Ulang'
                          : isNextInLine
                          ? 'Mulai Belajar Sekarang'
                          : 'Buka Materi'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-[#52525B]">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Selesaikan langkah {index} untuk membuka materi ini</span>
                    </div>
                  )}

                  {isCompleted && (
                    <span className="text-[11px] text-emerald-600 dark:text-[#34D399] font-medium hidden sm:inline">
                      Garis terhubung hijau ke modul berikutnya
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
