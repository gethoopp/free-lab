import React from 'react';
import { Moon, Sun, Smartphone, BookOpen, Layers, Terminal, Home } from 'lucide-react';

interface HeaderProps {
  currentView: 'dashboard' | 'flutter' | 'dart';
  onNavigate: (view: 'dashboard' | 'flutter' | 'dart') => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  mobileView: 'content' | 'emulator';
  onMobileViewChange: (view: 'content' | 'emulator') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  searchQuery,
  onSearchChange,
  mobileView,
  onMobileViewChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#221F33] bg-white/90 dark:bg-[#08070C]/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Identity: FreeLab */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            title="Kembali ke Dashboard Utama FreeLab"
          >
            <div className="w-9 h-9 rounded-xl bg-sky-600 dark:bg-[#7C3AED] group-hover:bg-sky-500 dark:group-hover:bg-[#6D28D9] flex items-center justify-center text-white shadow-sm ring-1 ring-sky-400/30 dark:ring-[#9353FF]/30 transition-colors">
              <Layers className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#A78BFA] transition-colors">
                  FreeLab
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-100 dark:bg-[#1C172E] text-sky-700 dark:text-[#C4B5FD] border border-sky-300 dark:border-[#3B2D5C] font-semibold">
                  v3.2
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8E8C9A] hidden sm:block">
                Belajar Dart &amp; Flutter Interaktif
              </p>
            </div>
          </button>
        </div>

        {/* Center: Track Switcher Navigation */}
        <nav
          aria-label="Pilihan Jalur Belajar"
          className="hidden md:flex items-center p-1 bg-slate-100 dark:bg-[#12101B] border border-slate-200 dark:border-[#221F33] rounded-xl text-xs"
        >
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentView === 'dashboard'
                ? 'bg-white dark:bg-[#201C30] text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentView === 'dart'
                ? 'bg-sky-600 dark:bg-[#7C3AED] text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Jalur Dart</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('flutter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              currentView === 'flutter'
                ? 'bg-indigo-600 dark:bg-[#4F46E5] text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Jalur Flutter</span>
          </button>
        </nav>

        {/* Search Topic Input (Shown when in Flutter view) */}
        {currentView === 'flutter' && (
          <div className="flex-1 max-w-xs mx-2 hidden lg:block">
            <label htmlFor="topic-search" className="sr-only">
              Cari topik Flutter
            </label>
            <div className="relative">
              <input
                id="topic-search"
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari widget (Row, State, dll)..."
                className="w-full text-xs py-1.5 pl-3 pr-8 rounded-xl bg-slate-100 dark:bg-[#12101B] border border-slate-200 dark:border-[#221F33] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-[#6C697B] focus:outline-none focus:border-sky-500 dark:focus:border-[#7C3AED] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                  aria-label="Bersihkan pencarian"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Right Actions: Mobile Toggle & Light/Dark Theme Switch */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Screen Segmented Switch (Only in Flutter View) */}
          {currentView === 'flutter' && (
            <div className="flex lg:hidden bg-slate-100 dark:bg-[#12101B] border border-slate-200 dark:border-[#221F33] rounded-lg p-0.5 text-xs">
              <button
                type="button"
                role="tab"
                aria-selected={mobileView === 'content'}
                onClick={() => onMobileViewChange('content')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  mobileView === 'content'
                    ? 'bg-sky-600 dark:bg-[#7C3AED] text-white shadow-sm'
                    : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Materi</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mobileView === 'emulator'}
                onClick={() => onMobileViewChange('emulator')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  mobileView === 'emulator'
                    ? 'bg-sky-600 dark:bg-[#7C3AED] text-white shadow-sm'
                    : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Emulator</span>
              </button>
            </div>
          )}

          {/* Theme Toggle (R-21, R-34) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#221F33] bg-slate-100 dark:bg-[#12101B] hover:bg-slate-200 dark:hover:bg-[#1C172E] text-slate-700 dark:text-[#C4B5FD] transition-colors"
            title={`Beralih ke mode ${theme === 'dark' ? 'Terang (Light)' : 'Gelap (Dark)'}`}
            aria-label={`Beralih ke mode ${theme === 'dark' ? 'Terang' : 'Gelap'}`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4 text-sky-600" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
