import React, { useState, useEffect } from 'react';
import type { FlutterTopic, EmulatorRuntimeState } from '../../types/flutter';
import { WidgetTreeInspector } from './WidgetTreeInspector';
import {
  Wifi,
  Battery,
  Smartphone,
  Layers,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  Send,
  Trash2,
  CheckCircle2,
  Volume2,
  AlertOctagon,
  Zap,
} from 'lucide-react';

interface PhoneEmulatorProps {
  topic: FlutterTopic;
  state: EmulatorRuntimeState;
  onUpdateState: (updates: Partial<EmulatorRuntimeState>) => void;
  onReset: () => void;
}

export const PhoneEmulator: React.FC<PhoneEmulatorProps> = ({
  topic,
  state,
  onUpdateState,
  onReset,
}) => {
  const [viewMode, setViewMode] = useState<'app' | 'tree'>('app');
  const [currentTime, setCurrentTime] = useState('09:41');
  const [rippleActive, setRippleActive] = useState(false);
  const [hotReloadNotice, setHotReloadNotice] = useState(false);

  // Update clock every 10 seconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Show hot reload notice when hotReloadTriggered changes
  useEffect(() => {
    if (state.hotReloadTriggered) {
      setHotReloadNotice(true);
      const timer = setTimeout(() => {
        setHotReloadNotice(false);
        onUpdateState({ hotReloadTriggered: false });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.hotReloadTriggered, onUpdateState]);

  // Clear snackbar after 3 seconds
  useEffect(() => {
    if (state.activeSnackbar) {
      const timer = setTimeout(() => {
        onUpdateState({ activeSnackbar: null });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state.activeSnackbar, onUpdateState]);

  const handleButtonClick = () => {
    setRippleActive(true);
    setTimeout(() => setRippleActive(false), 300);
    const newCount = state.buttonClicks + 1;
    onUpdateState({
      buttonClicks: newCount,
      activeSnackbar: `Tombol ditekan ${newCount} kali! (SnackBar)`,
    });
  };

  const handleAddItem = () => {
    const nextNum = state.listItems.length + 1;
    onUpdateState({
      listItems: [...state.listItems, `Modul ${nextNum}: Fitur Flutter Lanjutan`],
    });
  };

  const handleDeleteItem = (index: number) => {
    const updated = state.listItems.filter((_, i) => i !== index);
    onUpdateState({ listItems: updated });
  };

  // Resolve custom texts from live code editor or fall back to defaults
  const displayAppBarTitle = state.customAppBarTitle || topic.title;
  const displayBodyText =
    state.customBodyText ||
    (topic.id === 'what-is-widget'
      ? 'Halo! Semuanya di Flutter adalah Widget.'
      : 'Container Cantik');
  const displayButtonLabel = state.customButtonLabel || 'ElevatedButton (Tap Saya!)';
  const displayInputLabel = state.customInputLabel || 'TextField (Ketik di bawah):';

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      {/* Emulator Mode Selector & Controls */}
      <div className="flex items-center justify-between w-full mb-3 px-1 text-xs">
        <div className="inline-flex p-1 bg-slate-100 dark:bg-[#12101B] border border-slate-200 dark:border-[#221F33] rounded-xl">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'app'}
            onClick={() => setViewMode('app')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              viewMode === 'app'
                ? 'bg-sky-600 dark:bg-[#7C3AED] text-white shadow-xs'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
            <span>App Preview</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'tree'}
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium ${
              viewMode === 'tree'
                ? 'bg-sky-600 dark:bg-[#7C3AED] text-white shadow-xs'
                : 'text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Widget Tree</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 dark:text-[#8E8C9A] hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#12101B] hover:bg-slate-200 dark:hover:bg-[#1C172E] border border-slate-200 dark:border-[#221F33] rounded-lg transition-colors font-medium"
          title="Reset interaksi emulator ke awal"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Reset</span>
        </button>
      </div>

      {/* Realistic Smartphone Chassis */}
      <div className="relative w-[340px] h-[670px] bg-slate-950 dark:bg-[#0B0A11] rounded-[48px] p-3.5 border-4 border-slate-800 dark:border-[#221F33] shadow-2xl ring-1 ring-slate-700/50 dark:ring-[#2A253D] flex flex-col select-none">
        {/* Hardware Buttons Simulated on Sides */}
        <div className="absolute -left-[7px] top-24 w-1 h-12 bg-slate-700 dark:bg-[#2A253D] rounded-l-md" />
        <div className="absolute -left-[7px] top-40 w-1 h-12 bg-slate-700 dark:bg-[#2A253D] rounded-l-md" />
        <div className="absolute -right-[7px] top-28 w-1 h-16 bg-slate-700 dark:bg-[#2A253D] rounded-r-md" />

        {/* Screen Bezel & Dynamic Display Container */}
        <div className="relative flex-1 w-full bg-slate-900 dark:bg-[#0E0C17] rounded-[38px] overflow-hidden flex flex-col border border-slate-800/80 dark:border-[#221F33]">
          {/* Top Status Bar with Punch-hole Camera */}
          <div className="h-10 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-300 bg-slate-950/90 z-20 shrink-0">
            {/* Clock */}
            <span className="tracking-tight">{currentTime}</span>

            {/* Front Camera Island / Punch-hole */}
            <div className="w-4 h-4 rounded-full bg-black ring-1 ring-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* Network & Battery Status */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-widest text-slate-400">5G</span>
              <Wifi className="w-3.5 h-3.5" aria-hidden="true" />
              <Battery className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>

          {/* SCREEN CONTENT AREA */}
          <div className="relative flex-1 flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
            {/* Hot Reload Subtle Notification Banner */}
            {hotReloadNotice && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 bg-sky-600 text-white font-mono text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-lg border border-sky-400 flex items-center gap-1 animate-fade-in">
                <Zap className="w-3 h-3 fill-current" />
                <span>Hot Reload Selesai</span>
              </div>
            )}

            {/* ERROR VIEW: Flutter Iconic Red Screen of Death */}
            {state.compileError ? (
              <div className="flex-1 bg-red-900 text-yellow-300 p-5 font-mono text-xs flex flex-col justify-between overflow-y-auto">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-yellow-400/40 pb-2">
                    <AlertOctagon className="w-6 h-6 text-yellow-300 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-sm tracking-wide text-yellow-300">
                        FlutterError
                      </h4>
                      <p className="text-[10px] text-yellow-200">
                        Kompilasi Dart/Flutter Gagal
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-xs leading-relaxed text-yellow-100">
                    {state.compileError.message}
                  </p>

                  {state.compileError.line && (
                    <div className="bg-red-950 p-2 rounded border border-red-700 text-[10px] text-yellow-300">
                      <span>Error pada file widget_demo.dart: baris {state.compileError.line}</span>
                      {state.compileError.snippet && (
                        <pre className="mt-1 text-white bg-black/40 p-1 rounded overflow-x-auto">
                          {state.compileError.snippet}
                        </pre>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-yellow-200/80 leading-normal font-sans">
                    Periksa kembali tanda kurung, petik string, atau struktur widget pada editor kode di sebelah kiri.
                  </p>
                </div>

                <div className="pt-4 border-t border-yellow-400/30">
                  <button
                    type="button"
                    onClick={() => onUpdateState({ compileError: null })}
                    className="w-full py-2 bg-yellow-400 hover:bg-yellow-300 text-red-950 font-bold rounded-xl text-xs transition-colors shadow-md"
                  >
                    Tutup Notifikasi Error
                  </button>
                </div>
              </div>
            ) : viewMode === 'tree' ? (
              <div className="flex-1 p-2 overflow-hidden">
                <WidgetTreeInspector tree={topic.treeData} />
              </div>
            ) : (
              /* Simulated Flutter Native App View */
              <div className="flex-1 flex flex-col bg-slate-950 overflow-y-auto">
                {/* Flutter Simulated AppBar */}
                <div
                  className="h-14 px-4 text-white flex items-center justify-between shadow-md shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: state.appBarColor || (topic.id === 'what-is-widget' ? '#0284c7' : '#0369a1') }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-6 h-6 flex flex-col justify-center gap-1 shrink-0">
                      <div className="w-4 h-0.5 bg-white rounded-full" />
                      <div className="w-4 h-0.5 bg-white rounded-full" />
                      <div className="w-3 h-0.5 bg-white rounded-full" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold truncate leading-tight">
                        {displayAppBarTitle}
                      </h3>
                      <p className="text-[10px] text-sky-200">Flutter App</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold shrink-0">
                    FR
                  </div>
                </div>

                {/* Main Dynamic Flutter Widget Body */}
                <div className="flex-1 p-4 flex flex-col justify-center items-center overflow-y-auto relative">
                  {/* Topic 1: What is a Widget */}
                  {topic.id === 'what-is-widget' && (
                    <div className="w-full flex flex-col items-center justify-center space-y-4">
                      <div
                        className="p-5 border-2 border-dashed border-sky-400/50 rounded-2xl bg-sky-950/30 w-full transition-all duration-300"
                        style={{
                          borderRadius: `${state.containerRadius}px`,
                          padding: `${state.containerPadding}px`,
                        }}
                      >
                        <span className="text-[10px] uppercase tracking-wider text-sky-400 font-mono block mb-1.5 text-center">
                          Widget: Center &gt; Text
                        </span>
                        <p
                          className="break-words transition-all duration-200 leading-relaxed"
                          style={{
                            fontSize: state.fontSize ? `${state.fontSize}px` : '15px',
                            fontWeight: state.fontWeight || '500',
                            textAlign: state.textAlign || 'center',
                            color: state.textColor || '#e2e8f0',
                          }}
                        >
                          {displayBodyText}
                        </p>
                      </div>

                      <div className="bg-slate-900 dark:bg-[#12101B] p-3 rounded-xl border border-slate-800 dark:border-[#221F33] text-left w-full text-xs space-y-1.5">
                        <div className="flex items-center gap-2 text-sky-400 dark:text-[#A78BFA] font-semibold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Hierarki Dasar:</span>
                        </div>
                        <p className="text-slate-400 dark:text-[#8E8C9A] text-[11px] font-mono leading-relaxed">
                          MaterialApp ➔ Scaffold ➔ AppBar + Center ➔ Text
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Topic 2: Stateless vs Stateful (Interactive Counter) */}
                  {topic.id === 'stateless-vs-stateful' && (
                    <div className="w-full flex flex-col items-center justify-center space-y-6 text-center">
                      <div className="bg-slate-900 dark:bg-[#12101B] border border-slate-800 dark:border-[#221F33] rounded-2xl p-6 w-full shadow-lg">
                        <span className="text-xs text-slate-400 dark:text-[#8E8C9A] block mb-1">
                          State internal counter:
                        </span>
                        <span className="text-5xl font-mono font-extrabold text-sky-400 dark:text-[#A78BFA]">
                          {state.counter}
                        </span>
                        <p className="text-[11px] text-slate-500 dark:text-[#6C687E] mt-2">
                          setState() dipanggil saat tombol ditekan
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateState({ counter: Math.max(0, state.counter - 1) })
                          }
                          className="w-12 h-12 rounded-full bg-slate-800 dark:bg-[#1C172E] hover:bg-slate-700 dark:hover:bg-[#282142] text-white flex items-center justify-center border border-slate-700 dark:border-[#3B2D5C] shadow active:scale-95 transition-transform"
                          aria-label="Kurangi counter"
                        >
                          <Minus className="w-5 h-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onUpdateState({ counter: state.counter + 1 })}
                          className="w-14 h-14 rounded-full bg-sky-600 dark:bg-[#7C3AED] hover:bg-sky-500 dark:hover:bg-[#6D28D9] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform ring-4 ring-sky-600/30 dark:ring-[#9353FF]/40"
                          aria-label="Tambah counter"
                        >
                          <Plus className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Topic 3: Container Widget */}
                  {topic.id === 'container' && (
                    <div className="w-full flex flex-col items-center justify-center space-y-4">
                      <div
                        className="transition-all duration-200 flex items-center justify-center shadow-lg border border-white/20 text-center"
                        style={{
                          backgroundColor: state.containerColor,
                          borderRadius: `${state.containerRadius}px`,
                          padding: `${state.containerPadding}px`,
                          width: state.containerWidth ? `${state.containerWidth}px` : '210px',
                          minHeight: state.containerHeight ? `${state.containerHeight}px` : '130px',
                        }}
                      >
                        <span
                          className="drop-shadow-xs break-words px-2 transition-all duration-200 block"
                          style={{
                            fontSize: state.fontSize ? `${state.fontSize}px` : '14px',
                            fontWeight: state.fontWeight || '700',
                            textAlign: state.textAlign || 'center',
                            color: state.textColor || '#ffffff',
                          }}
                        >
                          {displayBodyText}
                        </span>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 dark:text-[#8E8C9A] bg-slate-900/90 dark:bg-[#12101B] px-3 py-1.5 rounded-lg border border-slate-800 dark:border-[#221F33] text-center">
                        radius: {state.containerRadius}px | padding: {state.containerPadding}px
                      </div>
                    </div>
                  )}

                  {/* Topic 4: Row & Column */}
                  {topic.id === 'row-and-column' && (
                    <div className="w-full h-full flex flex-col justify-center items-center py-2">
                      <div
                        className={`w-full p-3 bg-slate-900 dark:bg-[#12101B] border border-slate-800 dark:border-[#221F33] rounded-2xl min-h-[220px] flex ${
                          state.flexDirection === 'row' ? 'flex-row' : 'flex-col'
                        } ${
                          state.mainAxisAlignment === 'center'
                            ? 'justify-center'
                            : state.mainAxisAlignment === 'end'
                            ? 'justify-end'
                            : state.mainAxisAlignment === 'spaceBetween'
                            ? 'justify-between'
                            : 'justify-start'
                        } ${
                          state.crossAxisAlignment === 'center'
                            ? 'items-center'
                            : state.crossAxisAlignment === 'end'
                            ? 'items-end'
                            : 'items-start'
                        } gap-2 transition-all duration-300`}
                      >
                        <div className="bg-sky-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow">
                          Item 1
                        </div>
                        <div className="bg-teal-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow">
                          Item 2
                        </div>
                        <div className="bg-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold shadow">
                          Item 3
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 dark:text-[#8E8C9A] mt-2">
                        {state.flexDirection.toUpperCase()} • mainAxis: {state.mainAxisAlignment}
                      </span>
                    </div>
                  )}

                  {/* Topic 5: Stack & Positioned */}
                  {topic.id === 'stack-positioned' && (
                    <div className="w-full flex items-center justify-center">
                      <div className="relative w-64 h-40 bg-gradient-to-br from-sky-700 to-sky-950 dark:from-[#5B21B6] dark:to-[#181126] rounded-2xl p-4 shadow-xl border border-sky-600/40 dark:border-[#7C3AED]/40 flex flex-col justify-end">
                        {/* Positioned Badge on Top Right */}
                        <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                          {state.customBadgeText || 'PRO'}
                        </div>

                        {/* Top Left Icon */}
                        <div className="absolute top-3 left-3 text-sky-300">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>

                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-sky-200">
                            Flutter Membership
                          </span>
                          <h4 className="text-base font-bold text-white tracking-wide">
                            ALEXANDER DEV
                          </h4>
                          <span className="text-[9px] text-sky-300/80 font-mono">
                            ID: #FL-2026-88
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Topic 6: Interactive Buttons */}
                  {topic.id === 'interactive-buttons' && (
                    <div className="w-full flex flex-col items-center justify-center space-y-4">
                      <button
                        type="button"
                        onClick={handleButtonClick}
                        style={{
                          backgroundColor: state.buttonBgColor || undefined,
                          color: state.buttonFgColor || undefined,
                          fontSize: state.fontSize ? `${state.fontSize}px` : undefined,
                          fontWeight: state.fontWeight || undefined,
                        }}
                        className={`w-full py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 ${
                          rippleActive ? 'ring-4 ring-sky-400/50' : ''
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span className="truncate">{displayButtonLabel}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleButtonClick}
                        className="w-full py-2.5 px-4 bg-transparent hover:bg-slate-900 dark:hover:bg-[#12101B] text-sky-400 dark:text-[#A78BFA] border border-sky-500 dark:border-[#7C3AED] font-medium rounded-xl transition-all"
                      >
                        OutlinedButton
                      </button>

                      <div className="text-center text-xs text-slate-400 dark:text-[#8E8C9A]">
                        Total klik:{' '}
                        <span className="font-bold text-sky-400 dark:text-[#A78BFA]">{state.buttonClicks}</span> kali
                      </div>
                    </div>
                  )}

                  {/* Topic 7: TextField Input */}
                  {topic.id === 'text-field-input' && (
                    <div className="w-full flex flex-col space-y-4">
                      <div className="space-y-1">
                        <label
                          htmlFor="emulator-input"
                          className="text-[11px] font-medium text-slate-400"
                        >
                          {displayInputLabel}
                        </label>
                        <input
                          id="emulator-input"
                          type="text"
                          value={state.inputText}
                          onChange={(e) => onUpdateState({ inputText: e.target.value })}
                          placeholder="Masukkan teks nama..."
                          className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors"
                        />
                      </div>

                      <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                        <span className="text-slate-400 block mb-0.5">Teks yang dihasilkan:</span>
                        <p className="font-semibold text-sky-300 break-words">
                          {state.inputText ? `Halo, ${state.inputText}!` : '(Belum ada input)'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Topic 8: Switch & Slider */}
                  {topic.id === 'switch-and-slider' && (
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-xl">
                        <div>
                          <span className="text-xs font-semibold text-slate-200 block">
                            SwitchListTile
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Status: {state.isSwitchOn ? 'Aktif (ON)' : 'Mati (OFF)'}
                          </span>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={state.isSwitchOn}
                          onClick={() => onUpdateState({ isSwitchOn: !state.isSwitchOn })}
                          className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                            state.isSwitchOn ? 'bg-sky-600 justify-end' : 'bg-slate-700 justify-start'
                          }`}
                        >
                          <div className="bg-white w-4 h-4 rounded-full shadow-md" />
                        </button>
                      </div>

                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                            <Volume2 className="w-3.5 h-3.5 text-sky-400" />
                            Slider Volume
                          </span>
                          <span className="font-mono text-sky-400 font-bold">
                            {state.sliderValue}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={state.sliderValue}
                          onChange={(e) =>
                            onUpdateState({ sliderValue: Number(e.target.value) })
                          }
                          className="w-full accent-sky-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Topic 9: ListView */}
                  {topic.id === 'listview' && (
                    <div className="w-full h-full flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300">
                          Item ({state.listItems.length})
                        </span>
                        <button
                          type="button"
                          onClick={handleAddItem}
                          className="text-[11px] px-2 py-0.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md flex items-center gap-1 font-medium"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Tambah</span>
                        </button>
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[260px]">
                        {state.listItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="w-5 h-5 rounded-full bg-sky-600/30 text-sky-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                                {idx + 1}
                              </div>
                              <span className="truncate text-slate-200">{item}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(idx)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded"
                              aria-label={`Hapus item ${idx + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Simulated Floating SnackBar Toast */}
                  {state.activeSnackbar && (
                    <div className="absolute bottom-4 left-3 right-3 bg-slate-800 text-slate-100 text-xs px-3.5 py-2.5 rounded-xl shadow-2xl border border-slate-700 flex items-center justify-between animate-fade-in z-30">
                      <span className="truncate">{state.activeSnackbar}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateState({ activeSnackbar: null })}
                        className="text-sky-400 text-[10px] font-bold ml-2 hover:underline"
                      >
                        TUTUP
                      </button>
                    </div>
                  )}
                </div>

                {/* Floating Action Button (FAB) simulation for Stateful/Counter topic */}
                {topic.id === 'stateless-vs-stateful' && (
                  <div className="absolute bottom-6 right-5 z-20">
                    <button
                      type="button"
                      onClick={() => onUpdateState({ counter: state.counter + 1 })}
                      className="w-12 h-12 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl shadow-xl flex items-center justify-center ring-2 ring-sky-400/40 active:scale-95 transition-transform"
                      title="FloatingActionButton: Tambah Counter"
                      aria-label="Floating Action Button Tambah Counter"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Gesture Bar Navigation Pill */}
          <div className="h-6 bg-slate-950 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
