import React from 'react';
import type { FlutterTopic, EmulatorRuntimeState } from '../../types/flutter';
import { LiveCodeEditor } from './LiveCodeEditor';
import {
  Sliders,
  BookOpen,
  Info,
  ArrowRight,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';

interface TopicContentProps {
  topic: FlutterTopic;
  emulatorState: EmulatorRuntimeState;
  onUpdateState: (updates: Partial<EmulatorRuntimeState>) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isChallengeCompleted: boolean;
  onChallengeCompleted: (topicId: string, nextTopicId?: string) => void;
  onNavigateTopic?: (topicId: string) => void;
  isTopicCompleted: boolean;
  onToggleTopicCompletion: (topicId: string) => void;
}

export const TopicContent: React.FC<TopicContentProps> = ({
  topic,
  emulatorState,
  onUpdateState,
  isBookmarked,
  onToggleBookmark,
  isChallengeCompleted,
  onChallengeCompleted,
  onNavigateTopic,
  isTopicCompleted,
  onToggleTopicCompletion,
}) => {
  const COLOR_OPTIONS = [
    { label: 'Sky Blue', value: '#0284c7' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Amber', value: '#d97706' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Indigo', value: '#4f46e5' },
  ];

  return (
    <article className="space-y-6">
      {/* Topic Title & Metadata Header */}
      <div className="space-y-3 border-b border-slate-200 dark:border-[#202025] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-sky-600 dark:text-[#38BDF8] uppercase tracking-wider font-mono">
              {topic.categoryLabel}
            </span>
            <span className="text-slate-400 dark:text-[#52525B]">•</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#18181F] border border-slate-200 dark:border-[#262630] text-slate-700 dark:text-[#D4D4D8] font-mono text-[10px]">
              Tingkat: {topic.difficulty}
            </span>
          </div>

          {/* Action Buttons: Tandai Selesai & Bookmark */}
          <div className="flex items-center gap-2">
            {/* Mark Complete Button */}
            <button
              type="button"
              onClick={() => onToggleTopicCompletion(topic.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isTopicCompleted
                  ? 'bg-emerald-50 dark:bg-[#122419] text-emerald-700 dark:text-[#34D399] border-emerald-300 dark:border-[#1E4D33] shadow-xs'
                  : 'bg-slate-100 dark:bg-[#16161B] text-slate-700 dark:text-[#A1A1AA] border-slate-200 dark:border-[#26262E] hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#1F1F26]'
              }`}
              aria-label={isTopicCompleted ? 'Batalkan tanda selesai' : 'Tandai materi ini telah selesai dipelajari'}
              title={isTopicCompleted ? 'Materi telah selesai dipelajari' : 'Tandai materi selesai'}
            >
              <CheckCircle2
                className={`w-3.5 h-3.5 ${isTopicCompleted ? 'text-emerald-500 dark:text-[#34D399]' : ''}`}
              />
              <span>{isTopicCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}</span>
            </button>

            {/* Bookmark Button */}
            <button
              type="button"
              onClick={() => onToggleBookmark(topic.id)}
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
          {topic.title}
        </h1>

        <p className="text-sm lg:text-base text-slate-600 dark:text-[#8A8A93] leading-relaxed max-w-3xl">
          {topic.subtitle}
        </p>
      </div>

      {/* Conceptual Summary */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111114] border border-slate-200 dark:border-[#202025] shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
          <BookOpen className="w-4 h-4 text-sky-600 dark:text-[#38BDF8]" />
          <span>Penjelasan Konseptual</span>
        </div>
        <p className="text-xs lg:text-sm text-slate-600 dark:text-[#8A8A93] leading-relaxed font-sans">
          {topic.summary}
        </p>
      </div>

      {/* Interactive Live Tweak Box (Controls linked to Phone Emulator) */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#111114] border border-slate-300 dark:border-[#202025] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#202025] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600 dark:text-[#38BDF8]" />
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Eksperimen Cepat (Quick Tweak)
            </h2>
          </div>
          <span className="text-[11px] text-sky-600 dark:text-[#38BDF8] font-mono flex items-center gap-1 font-medium">
            <span>Sinkron dengan HP di samping</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Dynamic Controls based on Topic */}
        {topic.id === 'container' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Color Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-700 dark:text-slate-300 font-medium block">
                Pilih Warna Container:
              </label>
              <div className="flex items-center gap-2">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => onUpdateState({ containerColor: c.value })}
                    className={`w-7 h-7 rounded-full transition-transform active:scale-95 ${
                      emulatorState.containerColor === c.value
                        ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-[#111114] scale-110'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                    aria-label={`Ubah warna container ke ${c.label}`}
                  />
                ))}
              </div>
            </div>

            {/* Radius Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <label htmlFor="radius-slider">Border Radius:</label>
                <span className="font-mono text-sky-600 dark:text-[#38BDF8] font-bold">
                  {emulatorState.containerRadius}px
                </span>
              </div>
              <input
                id="radius-slider"
                type="range"
                min="0"
                max="36"
                value={emulatorState.containerRadius}
                onChange={(e) =>
                  onUpdateState({ containerRadius: Number(e.target.value) })
                }
                className="w-full accent-sky-600 dark:accent-[#38BDF8]"
              />
            </div>

            {/* Padding Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <label htmlFor="padding-slider">Padding Konten:</label>
                <span className="font-mono text-sky-600 dark:text-[#38BDF8] font-bold">
                  {emulatorState.containerPadding}px
                </span>
              </div>
              <input
                id="padding-slider"
                type="range"
                min="8"
                max="32"
                value={emulatorState.containerPadding}
                onChange={(e) =>
                  onUpdateState({ containerPadding: Number(e.target.value) })
                }
                className="w-full accent-sky-600 dark:accent-[#38BDF8]"
              />
            </div>
          </div>
        )}

        {topic.id === 'row-and-column' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Direction Toggle */}
            <div className="space-y-1.5">
              <span className="text-slate-700 dark:text-slate-300 font-medium block">
                Arah Susunan (Flex Direction):
              </span>
              <div className="inline-flex p-1 bg-white dark:bg-[#09090B] rounded-xl border border-slate-300 dark:border-[#202025]">
                <button
                  type="button"
                  onClick={() => onUpdateState({ flexDirection: 'row' })}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    emulatorState.flexDirection === 'row'
                      ? 'bg-sky-600 dark:bg-white text-white dark:text-black font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Row (Horizontal)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateState({ flexDirection: 'column' })}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    emulatorState.flexDirection === 'column'
                      ? 'bg-sky-600 dark:bg-white text-white dark:text-black font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-[#8A8A93] hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  Column (Vertikal)
                </button>
              </div>
            </div>

            {/* MainAxisAlignment */}
            <div className="space-y-1.5">
              <label
                htmlFor="main-axis-select"
                className="text-slate-700 dark:text-slate-300 font-medium block"
              >
                MainAxisAlignment:
              </label>
              <select
                id="main-axis-select"
                value={emulatorState.mainAxisAlignment}
                onChange={(e) =>
                  onUpdateState({
                    mainAxisAlignment: e.target.value as EmulatorRuntimeState['mainAxisAlignment'],
                  })
                }
                className="w-full p-2 rounded-xl bg-white dark:bg-[#09090B] border border-slate-300 dark:border-[#202025] text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#38BDF8] font-mono text-xs"
              >
                <option value="start">start (Awal sumbu)</option>
                <option value="center">center (Tengah sumbu)</option>
                <option value="end">end (Ujung sumbu)</option>
                <option value="spaceBetween">spaceBetween (Rata tepi)</option>
              </select>
            </div>
          </div>
        )}

        {topic.id === 'stateless-vs-stateful' && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-700 dark:text-slate-300">
              Uji coba pemanggilan{' '}
              <code className="text-sky-600 dark:text-[#38BDF8] font-bold">
                setState()
              </code>
              :
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  onUpdateState({ counter: emulatorState.counter + 1 })
                }
                className="px-3 py-2 bg-sky-600 dark:bg-white text-white dark:text-black hover:opacity-90 rounded-xl font-semibold transition-all shadow-xs"
              >
                + Tambah Counter ({emulatorState.counter})
              </button>
              <button
                type="button"
                onClick={() => onUpdateState({ counter: 0 })}
                className="px-3 py-2 bg-slate-200 dark:bg-[#1E1E24] hover:bg-slate-300 dark:hover:bg-[#282830] text-slate-800 dark:text-slate-300 rounded-xl transition-colors"
              >
                Reset ke 0
              </button>
            </div>
          </div>
        )}

        {topic.id === 'what-is-widget' && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-700 dark:text-[#8A8A93]">
              Anda juga bisa langsung mengedit kode Flutter di bawah ini (misalnya mengubah teks atau judul AppBar), lalu klik{' '}
              <strong className="text-sky-600 dark:text-[#38BDF8]">"Simpan &amp; Jalankan"</strong> untuk melihat perubahannya seketika di layar HP!
            </p>
          </div>
        )}

        {topic.id === 'interactive-buttons' && (
          <div className="space-y-2 text-xs">
            <p className="text-slate-700 dark:text-[#8A8A93]">
              Tekan tombol pada layar emulator di sebelah kanan untuk melihat aksi riil
              dan kemunculan SnackBar notification di layar HP.
            </p>
          </div>
        )}

        {topic.id === 'text-field-input' && (
          <div className="space-y-2 text-xs">
            <label
              htmlFor="side-input"
              className="text-slate-700 dark:text-slate-300 font-medium block"
            >
              Ketik nama di sini atau langsung pada layar HP:
            </label>
            <input
              id="side-input"
              type="text"
              value={emulatorState.inputText}
              onChange={(e) => onUpdateState({ inputText: e.target.value })}
              className="w-full sm:w-80 px-3 py-2 bg-white dark:bg-[#09090B] border border-slate-300 dark:border-[#202025] rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-sky-500 dark:focus:border-[#38BDF8]"
              placeholder="Contoh: Siti Rahma"
            />
          </div>
        )}

        {topic.id === 'switch-and-slider' && (
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={emulatorState.isSwitchOn}
                onChange={(e) => onUpdateState({ isSwitchOn: e.target.checked })}
                className="rounded accent-sky-600 dark:accent-[#38BDF8] w-4 h-4"
              />
              <span className="font-medium">
                Toggle Switch ({emulatorState.isSwitchOn ? 'ON' : 'OFF'})
              </span>
            </label>
          </div>
        )}

        {topic.id === 'listview' && (
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() =>
                onUpdateState({
                  listItems: [
                    ...emulatorState.listItems,
                    `Topik Baru #${emulatorState.listItems.length + 1}`,
                  ],
                })
              }
              className="px-3 py-2 bg-sky-600 dark:bg-white text-white dark:text-black hover:opacity-90 rounded-xl font-semibold transition-all shadow-xs"
            >
              + Tambah Baris ke ListView
            </button>
            <span className="text-slate-500 dark:text-[#8A8A93]">
              Total {emulatorState.listItems.length} item aktif di emulator.
            </span>
          </div>
        )}
      </div>

      {/* Structured Concept Points Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-sky-600 dark:text-[#38BDF8]" />
          <span>Poin Pembelajaran Kunci</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {topic.conceptPoints.map((point, index) => (
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

      {/* Key Properties Table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Properti Kunci (Key Properties)
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#202025] bg-white dark:bg-[#111114]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#202025] bg-slate-50 dark:bg-[#09090B] text-slate-600 dark:text-[#8A8A93]">
                <th className="py-2.5 px-3 font-semibold font-mono">Property</th>
                <th className="py-2.5 px-3 font-semibold font-mono">Type</th>
                <th className="py-2.5 px-3 font-semibold">Deskripsi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#202025]">
              {topic.keyProperties.map((prop, idx) => (
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

      {/* Live Dart Code Editor with Run & Error Notifications */}
      <LiveCodeEditor
        topic={topic}
        emulatorState={emulatorState}
        onUpdateState={onUpdateState}
        isChallengeCompleted={isChallengeCompleted}
        onChallengeCompleted={onChallengeCompleted}
        onNavigateTopic={onNavigateTopic}
      />
    </article>
  );
};
