import React, { useState } from 'react';
import { 
  Layers, Zap, Database, Globe, ChevronDown, ChevronRight, 
  Search, Sun, Moon, Sliders, Calculator, BookOpen, Sparkles
} from 'lucide-react';
import { MODULES, LESSONS } from '../data/lessons';

export default function Sidebar({ 
  currentLessonId, 
  onSelectLesson, 
  activeTab, 
  onSelectTab,
  onOpenSearch, 
  isDarkMode, 
  onToggleTheme 
}) {
  const [collapsedModules, setCollapsedModules] = useState({});

  const toggleModule = (modId) => {
    setCollapsedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const getModuleIcon = (iconName) => {
    switch (iconName) {
      case 'Layers': return Layers;
      case 'Zap': return Zap;
      case 'Database': return Database;
      case 'Globe': return Globe;
      default: return BookOpen;
    }
  };

  return (
    <aside className={`w-80 h-screen flex flex-col border-r transition-colors shrink-0 ${
      isDarkMode 
        ? 'bg-[#0d111a] border-[#1e293b] text-slate-200' 
        : 'bg-[#f8f6f2] border-slate-200 text-slate-800'
    }`}>
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold font-mono text-sm shadow-glow-amber">
            2.5D
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              Designed To Scale
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">Interactive System Design</p>
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg border border-slate-700/60 hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition"
          title="Chuyển chế độ Sáng / Tối"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Tab Switches: Lessons vs Design Lab vs Calculator */}
      <div className="p-3 border-b border-slate-700/50 space-y-1">
        <button
          onClick={() => onSelectTab('lessons')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'lessons'
              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold'
              : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-500" />
          <span>Bài học Trực quan</span>
        </button>

        <button
          onClick={() => onSelectTab('lab')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'lab'
              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold'
              : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Design Lab (Kéo - Thả)</span>
          <span className="ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
            LIVE QPS
          </span>
        </button>

        <button
          onClick={() => onSelectTab('calculator')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'calculator'
              ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold'
              : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>Capacity Estimator</span>
        </button>
      </div>

      {/* Search Input Bar Trigger */}
      <div className="p-3">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 text-slate-400 text-xs transition"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Tìm nhanh khái niệm...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Module & Lessons Tree */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3">
        {MODULES.map(module => {
          const isCollapsed = collapsedModules[module.id];
          const Icon = getModuleIcon(module.icon);

          return (
            <div key={module.id} className="space-y-1">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-slate-200 uppercase tracking-wider font-mono hover:bg-slate-800/30 transition"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-amber-500" />
                  <span className="truncate">{module.title}</span>
                </div>
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {/* Lesson Items */}
              {!isCollapsed && (
                <div className="pl-4 space-y-1 border-l border-slate-800 ml-3">
                  {module.lessons.map(lessonId => {
                    const lesson = LESSONS[lessonId];
                    if (!lesson) return null;
                    const isActive = currentLessonId === lessonId && activeTab === 'lessons';

                    return (
                      <button
                        key={lessonId}
                        onClick={() => {
                          onSelectLesson(lessonId);
                          onSelectTab('lessons');
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate">{lesson.title}</span>
                        {lesson.tags.includes('Base62') || lesson.tags.includes('Lua Script') ? (
                          <Sparkles className="w-3 h-3 text-amber-400 shrink-0 ml-1" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-700/50 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>40 Lessons · 445 Steps</span>
        <span className="text-emerald-500">v2.0 Visual</span>
      </div>
    </aside>
  );
}
