import React, { useState, useEffect } from 'react';
import { Search, X, Layers, Clock, ArrowRight, Zap, Database, Globe } from 'lucide-react';
import { LESSONS, MODULES } from '../data/lessons';

export default function SearchModal({ isOpen, onClose, onSelectLesson }) {
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose(); else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allLessons = Object.values(LESSONS);
  const filtered = allLessons.filter(l => {
    const q = query.toLowerCase();
    return (
      l.title.toLowerCase().includes(q) ||
      l.subtitle.toLowerCase().includes(q) ||
      l.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#121722] border border-[#1f293d] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-700/60 gap-3">
          <Search className="w-5 h-5 text-amber-500" />
          <input
            type="text"
            autoFocus
            placeholder="Tìm bài học, chủ đề (DNS, Redis, Envoy, Atlassian, Kafka, Flash Sale...)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-slate-100 placeholder:text-slate-500 text-sm font-sans"
          />
          <kbd className="text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded">ESC</kbd>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              Không tìm thấy bài học nào khớp với "{query}"
            </div>
          ) : (
            filtered.map(lesson => (
              <div
                key={lesson.id}
                onClick={() => {
                  onSelectLesson(lesson.id);
                  onClose();
                }}
                className="p-3.5 rounded-xl border border-slate-800/80 hover:border-amber-500/40 bg-slate-900/40 hover:bg-slate-800/50 cursor-pointer transition flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200 group-hover:text-amber-300 transition">
                      {lesson.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {lesson.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {lesson.subtitle}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    {lesson.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-slate-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
