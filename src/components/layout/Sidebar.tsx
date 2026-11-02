import React, { useState } from 'react';
import type { FlutterTopic, WidgetCategory } from '../../types/flutter';
import {
  Layers,
  Layout,
  MousePointerClick,
  ListFilter,
  Bookmark,
  CheckCircle2,
  Lock,
  KeyRound,
} from 'lucide-react';

interface SidebarProps {
  topics: FlutterTopic[];
  activeTopicId: string;
  onSelectTopic: (id: string) => void;
  bookmarkedTopics: string[];
  onToggleBookmark: (id: string) => void;
  unlockedTopicIds: string[];
  completedChallengeIds: string[];
  onRequestUnlockModal: () => void;
}

const CATEGORY_ORDER: { key: WidgetCategory; label: string; icon: React.ReactNode }[] = [
  {
    key: 'core',
    label: 'Konsep Inti',
    icon: <Layers className="w-4 h-4 text-sky-600 dark:text-[#A78BFA]" aria-hidden="true" />,
  },
  {
    key: 'layout',
    label: 'Layout & Tata Letak',
    icon: <Layout className="w-4 h-4 text-indigo-600 dark:text-[#818CF8]" aria-hidden="true" />,
  },
  {
    key: 'input',
    label: 'Input & Tombol',
    icon: <MousePointerClick className="w-4 h-4 text-amber-600 dark:text-[#FBBF24]" aria-hidden="true" />,
  },
  {
    key: 'list',
    label: 'List & Scroll',
    icon: <ListFilter className="w-4 h-4 text-emerald-600 dark:text-[#34D399]" aria-hidden="true" />,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  topics,
  activeTopicId,
  onSelectTopic,
  bookmarkedTopics,
  onToggleBookmark,
  unlockedTopicIds,
  completedChallengeIds,
  onRequestUnlockModal,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'favorites'>('all');

  const visibleTopics =
    filterMode === 'favorites'
      ? topics.filter((t) => bookmarkedTopics.includes(t.id))
      : topics;

  const totalFavoritesCount = topics.filter((t) =>
    bookmarkedTopics.includes(t.id)
  ).length;

  return (
    <nav
      aria-label="Kurikulum Pembelajaran Flutter"
      className="w-full lg:w-64 shrink-0 space-y-4 py-2 select-none"
    >
      {/* Top Header: Bookmark Filter & Enter Code Button */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-[#8E8C9A] px-1">
        <span>Silabus Flutter</span>
        <button
          type="button"
          onClick={onRequestUnlockModal}
          className="inline-flex items-center gap-1 font-mono text-[10px] text-sky-600 dark:text-[#A78BFA] hover:underline"
          title="Masukkan kode akses materi"
        >
          <KeyRound className="w-3 h-3" />
          <span>Punya Kode?</span>
        </button>
      </div>

      {/* Bookmark Filter Segmented Toggle */}
      <div className="p-1 bg-slate-100 dark:bg-[#12101B] border border-slate-200 dark:border-[#221F33] rounded-xl flex items-center text-xs">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center transition-all ${
            filterMode === 'all'
              ? 'bg-white dark:bg-[#201C30] text-slate-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Semua ({topics.length})
        </button>

        <button
          type="button"
          onClick={() => setFilterMode('favorites')}
          className={`flex-1 py-1.5 px-2 rounded-lg font-medium text-center flex items-center justify-center gap-1.5 transition-all ${
            filterMode === 'favorites'
              ? 'bg-amber-500 text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Bookmark className={`w-3 h-3 ${filterMode === 'favorites' ? 'fill-current' : ''}`} />
          <span>Favorit ({totalFavoritesCount})</span>
        </button>
      </div>

      {/* Topics List Categorized */}
      {CATEGORY_ORDER.map(({ key, label, icon }) => {
        const categoryTopics = visibleTopics.filter((t) => t.category === key);
        if (categoryTopics.length === 0) return null;

        return (
          <div key={key} className="space-y-1.5">
            <div className="flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#8E8C9A]">
              {icon}
              <span>{label}</span>
              <span className="ml-auto text-[10px] font-mono bg-slate-100 dark:bg-[#12101B] border border-slate-200 dark:border-[#221F33] px-1.5 py-0.2 rounded text-slate-500 dark:text-[#8E8C9A]">
                {categoryTopics.length}
              </span>
            </div>

            <ul className="space-y-1">
              {categoryTopics.map((topic, index) => {
                const isActive = topic.id === activeTopicId;
                const isBookmarked = bookmarkedTopics.includes(topic.id);
                const isUnlocked = unlockedTopicIds.includes(topic.id);
                const isCompleted = completedChallengeIds.includes(topic.id);

                return (
                  <li key={topic.id} className="relative group">
                    <button
                      type="button"
                      onClick={() => onSelectTopic(topic.id)}
                      className={`w-full text-left pl-3 pr-8 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-sky-600 dark:bg-[#7C3AED] text-white shadow-sm font-semibold'
                          : isUnlocked
                          ? 'text-slate-700 dark:text-[#C4C2D1] hover:bg-slate-200/70 dark:hover:bg-[#151221] hover:text-slate-950 dark:hover:text-white'
                          : 'text-slate-400 dark:text-[#58546A] hover:bg-slate-100 dark:hover:bg-[#100E1A]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-[#34D399] shrink-0" />
                        ) : !isUnlocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-[#58546A] shrink-0" />
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
                            ? 'bg-sky-700 dark:bg-[#6D28D9] text-white'
                            : isCompleted
                            ? 'bg-emerald-100 dark:bg-[#132B1E] text-emerald-700 dark:text-[#34D399]'
                            : !isUnlocked
                            ? 'bg-slate-200/60 dark:bg-[#171424] text-slate-400 dark:text-[#58546A]'
                            : 'bg-slate-100 dark:bg-[#1C172E] text-slate-500 dark:text-[#8E8C9A]'
                        }`}
                      >
                        {isCompleted ? 'Lulus' : !isUnlocked ? 'Terkunci' : topic.difficulty}
                      </span>
                    </button>

                    {/* Quick Bookmark Toggle Button on Sidebar Item */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(topic.id);
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity ${
                        isBookmarked
                          ? 'opacity-100 text-amber-400 hover:text-amber-500'
                          : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                      aria-label={isBookmarked ? `Hapus ${topic.title} dari favorit` : `Simpan ${topic.title} ke favorit`}
                      title={isBookmarked ? 'Tersimpan di Favorit' : 'Simpan ke Favorit'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {/* Empty State for Favorites */}
      {filterMode === 'favorites' && visibleTopics.length === 0 && (
        <div className="p-4 text-center text-xs text-slate-500 dark:text-[#8E8C9A] bg-slate-100 dark:bg-[#12101B]/50 rounded-xl border border-slate-200 dark:border-[#221F33] space-y-2">
          <Bookmark className="w-5 h-5 mx-auto text-amber-500/70" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            Belum ada topik favorit
          </p>
          <p className="text-[11px] leading-relaxed">
            Klik ikon bookmark pada materi atau di samping judul modul untuk menyimpannya ke daftar ini.
          </p>
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className="text-[11px] font-semibold text-sky-600 dark:text-[#A78BFA] hover:underline block mx-auto pt-1"
          >
            Tampilkan Semua Topik ➔
          </button>
        </div>
      )}

      {filterMode === 'all' && visibleTopics.length === 0 && (
        <div className="p-4 text-center text-xs text-slate-500 dark:text-[#8E8C9A] bg-slate-100 dark:bg-[#12101B]/50 rounded-xl border border-slate-200 dark:border-[#221F33]">
          Tidak ada topik yang cocok dengan pencarian Anda.
        </div>
      )}
    </nav>
  );
};
