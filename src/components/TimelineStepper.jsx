import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause } from 'lucide-react';

/**
 * ⏱️ TIMELINE STEPPER COMPONENT
 * ============================================================================
 * Thanh điều hướng dòng thời gian từng bước của hệ thống.
 */
export default function TimelineStepper({ 
  steps = [], 
  currentStepIndex = 0, 
  onSelectStep = () => {},
  onNext = () => {},
  onPrev = () => {},
  onReplay = () => {},
  isDarkMode = true 
}) {
  const total = steps.length;
  const current = steps[currentStepIndex] || steps[0];

  return (
    <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4 ${
      isDarkMode ? 'bg-[#121722] border-[#1f293d]' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Left: Step Indicators */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 md:pb-0">
        {steps.map((st, idx) => {
          const isActive = idx === currentStepIndex;
          const isPassed = idx < currentStepIndex;

          return (
            <button
              key={st.step}
              onClick={() => onSelectStep(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 border ${
                isActive
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold shadow-sm'
                  : isPassed
                    ? 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:border-slate-500'
                    : 'bg-transparent border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isActive 
                  ? 'bg-amber-400 text-slate-900' 
                  : isPassed 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {st.step}
              </span>
              <span className="hidden sm:inline">{st.badge || `Bước ${st.step}`}</span>
            </button>
          );
        })}
      </div>

      {/* Right: Step Playback Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onReplay}
          className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 border border-slate-700/60 transition"
          title="Replay animation (Phím R)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          disabled={currentStepIndex === 0}
          onClick={onPrev}
          className="px-3 py-1.5 rounded-xl border border-slate-700/60 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition flex items-center gap-1 text-xs font-mono"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Trước</span>
        </button>

        <span className="text-xs font-mono text-slate-400 px-2">
          {currentStepIndex + 1} / {total}
        </span>

        <button
          disabled={currentStepIndex === total - 1}
          onClick={onNext}
          className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-xs font-mono shadow-sm"
        >
          <span>Tiếp theo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
