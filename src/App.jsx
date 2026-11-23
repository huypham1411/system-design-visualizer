import React, { useState, useEffect } from 'react';
import { 
  Zap, AlertTriangle, Copy, Check, BookOpen, Sliders, 
  Calculator, Sparkles, Layers, ChevronRight, ExternalLink, Activity
} from 'lucide-react';
import { LESSONS } from './data/lessons';
import Sidebar from './components/Sidebar';
import IsometricCanvas from './components/IsometricCanvas';
import TimelineStepper from './components/TimelineStepper';
import DesignLab from './components/DesignLab';
import CapacityCalculator from './components/CapacityCalculator';
import SearchModal from './components/SearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('lessons'); // 'lessons' | 'lab' | 'calculator'
  const [currentLessonId, setCurrentLessonId] = useState('request-lifecycle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChaosMode, setIsChaosMode] = useState(false);
  const [chaosNodes, setChaosNodes] = useState({});
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  const lesson = LESSONS[currentLessonId] || LESSONS['request-lifecycle'];
  const steps = lesson.steps || [];
  const currentStep = steps[currentStepIndex] || steps[0];

  // Khi đổi bài học thì reset step về 0 và reset chaos
  const handleSelectLesson = (id) => {
    setCurrentLessonId(id);
    setCurrentStepIndex(0);
    setChaosNodes({});
    setIsChaosMode(false);
  };

  // Toggle sập node trong chế độ Chaos
  const handleToggleChaosNode = (nodeId) => {
    setChaosNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeTab !== 'lessons') return;
      if (e.key === 'ArrowRight' && currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      }
      if (e.key === 'ArrowLeft' && currentStepIndex > 0) {
        setCurrentStepIndex(prev => prev - 1);
      }
      if (e.key === 'r' || e.key === 'R') {
        // Force re-render
        setCurrentStepIndex(i => i);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, currentStepIndex, steps.length]);

  // Tạo mã Mermaid.js từ sơ đồ hiện tại
  const copyMermaidCode = () => {
    let code = 'graph LR\n';
    currentStep.nodes.forEach(n => {
      code += `  ${n.id}["${n.name}\\n(${n.desc})"]\n`;
    });
    currentStep.traffic.forEach(t => {
      code += `  ${t.from} -->|${t.label}| ${t.to}\n`;
    });

    navigator.clipboard.writeText(code);
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  return (
    <div className={`flex w-screen h-screen overflow-hidden ${isDarkMode ? 'dark bg-[#0a0d14] text-slate-100' : 'bg-[#faf8f5] text-slate-900'}`}>
      {/* 1. Sidebar Navigation */}
      <Sidebar
        currentLessonId={currentLessonId}
        onSelectLesson={handleSelectLesson}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* VIEW 1: Interactive Lessons */}
        {activeTab === 'lessons' && (
          <div className="flex-1 flex flex-col p-6 space-y-6 max-w-[1600px] mx-auto w-full">
            {/* Top Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-700/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold">
                    {lesson.difficulty}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Đọc ~ {lesson.readTime}
                  </span>
                  <div className="flex items-center gap-1.5 ml-2">
                    {lesson.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  {lesson.title}
                </h2>
                <p className="text-sm text-slate-400">
                  {lesson.subtitle}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2.5">
                {/* Chaos Monkey Toggle */}
                <button
                  onClick={() => setIsChaosMode(!isChaosMode)}
                  className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 border transition ${
                    isChaosMode 
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-glow-rose' 
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                  title="Bật chế độ mô phỏng đánh sập server node"
                >
                  <AlertTriangle className={`w-4 h-4 ${isChaosMode ? 'text-rose-400' : 'text-amber-400'}`} />
                  <span>Chaos Simulator</span>
                </button>

                {/* Export Mermaid.js */}
                <button
                  onClick={copyMermaidCode}
                  className="px-3 py-2 rounded-xl text-xs font-mono border border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-300 transition flex items-center gap-2"
                  title="Copy sơ đồ dưới dạng mã Mermaid.js"
                >
                  {copiedMermaid ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedMermaid ? 'Đã chép Mermaid' : 'Mermaid Code'}</span>
                </button>
              </div>
            </div>

            {/* Canvas + Pedagogical Side Rail Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 flex-1">
              {/* Left / Center 2 Columns: 2.5D Isometric Architecture Canvas */}
              <div className="xl:col-span-2 flex flex-col space-y-4">
                <IsometricCanvas
                  nodes={currentStep.nodes}
                  traffic={currentStep.traffic}
                  metrics={currentStep.metrics}
                  isChaosMode={isChaosMode}
                  chaosNodes={chaosNodes}
                  onToggleChaosNode={handleToggleChaosNode}
                  isDarkMode={isDarkMode}
                />

                {/* Timeline Stepper */}
                <TimelineStepper
                  steps={steps}
                  currentStepIndex={currentStepIndex}
                  onSelectStep={setCurrentStepIndex}
                  onNext={() => setCurrentStepIndex(i => Math.min(steps.length - 1, i + 1))}
                  onPrev={() => setCurrentStepIndex(i => Math.max(0, i - 1))}
                  onReplay={() => {
                    const temp = currentStepIndex;
                    setCurrentStepIndex(-1);
                    setTimeout(() => setCurrentStepIndex(temp), 50);
                  }}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Right Column: Pedagogical Deep-Dive Rail */}
              <div className="space-y-4">
                {/* Step Title & Explanation Card */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#121722] border-[#1f293d]' : 'bg-white border-slate-200 shadow-sm'} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                      STEP {currentStep.step} / {steps.length} · {currentStep.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-100">
                    {currentStep.title}
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    {currentStep.explanation}
                  </p>
                </div>

                {/* "What Changed" Architectural Diff */}
                <div className={`p-5 rounded-2xl border ${isDarkMode ? 'bg-[#121722] border-[#1f293d]' : 'bg-white border-slate-200 shadow-sm'} space-y-2.5`}>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    Thay đổi trong kiến trúc:
                  </h4>
                  <div className="space-y-2">
                    {currentStep.whatChanged.map((diff, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs">
                        <span className={`font-mono font-bold px-1.5 py-0.2 rounded text-[11px] ${
                          diff.type === 'add' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : diff.type === 'alert'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {diff.type === 'add' ? '+' : diff.type === 'alert' ? '!' : '~'}
                        </span>
                        <span className="text-slate-300">{diff.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* "Good to Know" Pro-Tip */}
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>Kinh nghiệm thực chiến (Pro-Tip):</span>
                  </div>
                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    {currentStep.proTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Design Lab Sandbox */}
        {activeTab === 'lab' && (
          <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
            <div className="pb-4 border-b border-slate-700/50">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                🛠️ Interactive Design Lab
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Kéo thả các thành phần kiến trúc và kiểm tra áp lực tải (Stress Testing) thời gian thực từ 1k đến 200k QPS!
              </p>
            </div>
            <DesignLab isDarkMode={isDarkMode} />
          </div>
        )}

        {/* VIEW 3: Capacity Calculator */}
        {activeTab === 'calculator' && (
          <div className="p-6 max-w-[1600px] mx-auto w-full space-y-6">
            <div className="pb-4 border-b border-slate-700/50">
              <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                🧮 Back-of-the-Envelope Capacity Estimator
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Công cụ tính toán lưu lượng, dung lượng đĩa và RAM cache chuẩn cấu trúc phỏng vấn System Design tại Big Tech.
              </p>
            </div>
            <CapacityCalculator isDarkMode={isDarkMode} />
          </div>
        )}
      </main>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLesson={handleSelectLesson}
      />
    </div>
  );
}
