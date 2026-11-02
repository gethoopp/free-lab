import React from 'react';
import {
  Code2,
  Smartphone,
  Layers,
  ArrowRight,
  Terminal,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface IntroductionDashboardProps {
  onSelectTrack: (track: 'dart' | 'flutter') => void;
}

export const IntroductionDashboard: React.FC<IntroductionDashboardProps> = ({
  onSelectTrack,
}) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-12 select-none">
      {/* Hero Welcome Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-[#1C172E] text-sky-700 dark:text-[#C4B5FD] border border-sky-300 dark:border-[#3B2D5C] text-xs font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Selamat Datang di FreeLab</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Pilih Jalur Belajar Anda: <br className="hidden sm:inline" />
          <span className="text-sky-600 dark:text-[#A78BFA]">Dart</span> atau{' '}
          <span className="text-indigo-600 dark:text-[#818CF8]">Flutter</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-[#8E8C9A] leading-relaxed font-sans">
          Platform pembelajaran koding interaktif gratis tanpa perlu instalasi SDK berat. Pelajari dasar bahasa Dart atau langsung rancang aplikasi dengan live emulator smartphone.
        </p>
      </div>

      {/* Two Main Track Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Track 1: Dart Track Card */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12101B] border-2 border-slate-200 dark:border-[#221F33] hover:border-sky-500/60 hover:dark:border-[#7C3AED]/70 hover:dark:bg-[#151221] shadow-sm hover:shadow-xl transition-all group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-[#1C172E] text-sky-600 dark:text-[#A78BFA] flex items-center justify-center ring-1 ring-sky-300 dark:ring-[#3B2D5C]">
                <Terminal className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-sky-50 dark:bg-[#1C172E] text-sky-700 dark:text-[#C4B5FD] border border-sky-200 dark:border-[#3B2D5C]">
                Jalur 1: Bahasa Pemrograman
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-[#A78BFA] transition-colors">
                Fondasi Bahasa Dart
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8E8C9A] mt-2 leading-relaxed">
                Kuasai sintaks, tipe data, Null Safety, fungsi, konsep OOP modern, dan asynchronous programming sebelum membuat aplikasi mobile.
              </p>
            </div>

            {/* Modules List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#221F33] text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Materi yang dipelajari:
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-[#8E8C9A]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-[#A78BFA] shrink-0" />
                  <span>Variabel, Tipe Data &amp; Sound Null Safety</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-[#A78BFA] shrink-0" />
                  <span>Named Parameters &amp; Arrow Syntax (`=&gt;`)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-[#A78BFA] shrink-0" />
                  <span>Collections: List, Set, dan Map</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-[#A78BFA] shrink-0" />
                  <span>OOP: Kelas, Konstruktor &amp; Enkapsulasi</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-[#A78BFA] shrink-0" />
                  <span>Asynchronous: Future, Async &amp; Await</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#221F33]">
            <button
              type="button"
              onClick={() => onSelectTrack('dart')}
              className="w-full py-3.5 px-5 rounded-2xl bg-sky-600 dark:bg-[#7C3AED] hover:bg-sky-500 dark:hover:bg-[#6D28D9] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all ring-1 ring-sky-400/40 dark:ring-[#9353FF]/40"
            >
              <span>Mulai Belajar Dart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Track 2: Flutter Track Card */}
        <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12101B] border-2 border-slate-200 dark:border-[#221F33] hover:border-indigo-500/60 hover:dark:border-[#6366F1]/70 hover:dark:bg-[#151221] shadow-sm hover:shadow-xl transition-all group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-[#191730] text-indigo-600 dark:text-[#818CF8] flex items-center justify-center ring-1 ring-indigo-300 dark:ring-[#332E5E]">
                <Smartphone className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-[#191730] text-indigo-700 dark:text-[#C4B5FD] border border-indigo-200 dark:border-[#332E5E]">
                Jalur 2: UI &amp; Mobile Framework
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#818CF8] transition-colors">
                Framework Flutter &amp; Widget
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8E8C9A] mt-2 leading-relaxed">
                Rancang tampilan aplikasi mobile dengan live phone emulator, inspeksi hierarki pohon widget, serta uji coba hot reload langsung di browser.
              </p>
            </div>

            {/* Modules List */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#221F33] text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                Materi yang dipelajari:
              </span>
              <ul className="space-y-1.5 text-slate-600 dark:text-[#8E8C9A]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-[#818CF8] shrink-0" />
                  <span>Konsep "Everything is a Widget" &amp; Widget Tree</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-[#818CF8] shrink-0" />
                  <span>StatelessWidget vs StatefulWidget &amp; State Counter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-[#818CF8] shrink-0" />
                  <span>Tata Letak: Container, Row, Column &amp; Stack</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-[#818CF8] shrink-0" />
                  <span>Input &amp; Tombol: ElevatedButton, TextField, Switch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 dark:text-[#818CF8] shrink-0" />
                  <span>Live Smartphone Emulator &amp; Hot Reload Editor</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#221F33]">
            <button
              type="button"
              onClick={() => onSelectTrack('flutter')}
              className="w-full py-3.5 px-5 rounded-2xl bg-indigo-600 dark:bg-[#4F46E5] hover:bg-indigo-500 dark:hover:bg-[#4338CA] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all ring-1 ring-indigo-400/40 dark:ring-[#6366F1]/40"
            >
              <span>Mulai Belajar Flutter</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-100/80 dark:bg-[#12101B]/70 border border-slate-200 dark:border-[#221F33] space-y-6">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white text-center">
          Mengapa Belajar di FreeLab?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
          <div className="space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-[#1C172E] text-sky-600 dark:text-[#A78BFA] flex items-center justify-center mx-auto sm:mx-0">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Langsung di Browser
            </h4>
            <p className="text-slate-600 dark:text-[#8E8C9A] leading-relaxed font-sans text-xs">
              Tidak perlu mengunduh Flutter SDK puluhan gigabyte atau emulator Android Studio yang berat di laptop Anda.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-[#191730] text-indigo-600 dark:text-[#818CF8] flex items-center justify-center mx-auto sm:mx-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Smartphone Emulator Nyata
            </h4>
            <p className="text-slate-600 dark:text-[#8E8C9A] leading-relaxed font-sans text-xs">
              Uji coba tombol, input teks, switch, dan penambahan counter secara langsung dengan feedback sentuhan realistis.
            </p>
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-[#15231D] text-emerald-600 dark:text-[#34D399] flex items-center justify-center mx-auto sm:mx-0">
              <Code2 className="w-4 h-4" />
            </div>
            <h4 className="font-semibold text-slate-900 dark:text-white">
              Playground &amp; Hot Reload
            </h4>
            <p className="text-slate-600 dark:text-[#8E8C9A] leading-relaxed font-sans text-xs">
              Tulis dan ubah kode Dart &amp; Flutter di tab Playground, lalu lihat hasilnya seketika dengan deteksi error otomatis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
