import React, { useState } from 'react';
import { 
  Server, Database, HardDrive, Cpu, Shield, Globe, 
  Layers, MessageSquare, Cloud, Activity, AlertTriangle, 
  Zap, CheckCircle2, XCircle, RotateCcw, ZoomIn, ZoomOut, Sliders
} from 'lucide-react';

/**
 * 🎨 2.5D ISOMETRIC ARCHITECTURE CANVAS
 * ============================================================================
 * Vẽ các thành phần hệ thống dưới góc nhìn 2.5D Isometric với hiệu ứng
 * luồng gói tin chuyển động phát quang và mô phỏng sự cố thời gian thực.
 */

// Hàm biến đổi tọa độ 2D mặt phẳng sang 2.5D Isometric
function toIso(x, y, z = 0) {
  const angle = Math.PI / 6; // 30 độ
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const isoX = (x - y) * cos;
  const isoY = (x + y) * sin - z;
  return { x: isoX + 460, y: isoY + 120 };
}

export default function IsometricCanvas({ 
  nodes = [], 
  traffic = [], 
  metrics = {}, 
  isChaosMode = false,
  chaosNodes = {},
  onToggleChaosNode = () => {},
  isDarkMode = true 
}) {
  const [zoom, setZoom] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);

  // Icon ánh xạ theo loại Node
  const getNodeIcon = (type) => {
    switch (type) {
      case 'client': return Globe;
      case 'dns': return Cloud;
      case 'lb': return Layers;
      case 'app': return Server;
      case 'cache': return Zap;
      case 'db': return Database;
      case 'queue': return MessageSquare;
      case 'service': return Cpu;
      case 'auth': return Shield;
      case 'control-plane': return Sliders;
      default: return HardDrive;
    }
  };

  // Màu sắc theo loại Node
  const getNodeColors = (type, isDead, isOverheated) => {
    if (isDead) {
      return {
        top: isDarkMode ? '#2d1519' : '#fee2e2',
        left: isDarkMode ? '#1f0d10' : '#fca5a5',
        right: isDarkMode ? '#17090b' : '#ef4444',
        border: '#ef4444',
        text: '#ef4444'
      };
    }
    if (isOverheated) {
      return {
        top: isDarkMode ? '#3b180d' : '#ffedd5',
        left: isDarkMode ? '#291008' : '#fdba74',
        right: isDarkMode ? '#1e0b05' : '#f97316',
        border: '#f97316',
        text: '#f97316'
      };
    }

    switch (type) {
      case 'client':
        return {
          top: isDarkMode ? '#132338' : '#e0f2fe',
          left: isDarkMode ? '#0d1827' : '#bae6fd',
          right: isDarkMode ? '#08101a' : '#7dd3fc',
          border: '#38bdf8',
          text: '#38bdf8'
        };
      case 'cache':
        return {
          top: isDarkMode ? '#281c0b' : '#fef3c7',
          left: isDarkMode ? '#1b1307' : '#fde68a',
          right: isDarkMode ? '#110c04' : '#fcd34d',
          border: '#f59e0b',
          text: '#f59e0b'
        };
      case 'db':
        return {
          top: isDarkMode ? '#0d2822' : '#d1fae5',
          left: isDarkMode ? '#091c18' : '#a7f3d0',
          right: isDarkMode ? '#061310' : '#6ee7b7',
          border: '#10b981',
          text: '#10b981'
        };
      case 'queue':
        return {
          top: isDarkMode ? '#231433' : '#f3e8ff',
          left: isDarkMode ? '#180d24' : '#e9d5ff',
          right: isDarkMode ? '#100818' : '#d8b4fe',
          border: '#a855f7',
          text: '#a855f7'
        };
      case 'auth':
        return {
          top: isDarkMode ? '#162038' : '#e0e7ff',
          left: isDarkMode ? '#0f1628' : '#c7d2fe',
          right: isDarkMode ? '#0a0f1c' : '#a5b4fc',
          border: '#6366f1',
          text: '#818cf8'
        };
      case 'control-plane':
        return {
          top: isDarkMode ? '#0f2733' : '#cffafe',
          left: isDarkMode ? '#0a1b24' : '#a5f3fc',
          right: isDarkMode ? '#061218' : '#67e8f9',
          border: '#06b6d4',
          text: '#22d3ee'
        };
      default:
        return {
          top: isDarkMode ? '#1a2333' : '#f1f5f9',
          left: isDarkMode ? '#131924' : '#e2e8f0',
          right: isDarkMode ? '#0d111a' : '#cbd5e1',
          border: '#64748b',
          text: '#94a3b8'
        };
    }
  };

  return (
    <div className={`relative w-full h-[520px] rounded-2xl border overflow-hidden transition-colors ${
      isDarkMode 
        ? 'bg-[#0d121d] border-[#1e293b] bg-isometric-grid-dark' 
        : 'bg-[#faf8f5] border-[#e2e8f0] bg-isometric-grid-light'
    }`}>
      {/* Top HUD: Real-time Metric Indicators */}
      <div className="absolute top-4 left-4 right-36 z-20 flex flex-wrap gap-2 pointer-events-none">
        {Object.entries(metrics).map(([key, val]) => (
          <div 
            key={key}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono backdrop-blur-md shadow-sm flex items-center gap-1.5 ${
              isDarkMode 
                ? 'bg-slate-900/85 border-slate-700/60 text-slate-200' 
                : 'bg-white/90 border-slate-200 text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="text-slate-400 uppercase text-[10px]">{key}:</span>
            <span className="font-bold text-amber-400">{val}</span>
          </div>
        ))}
      </div>

      {/* Top Right: Zoom & Reset Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-1.5 rounded-xl">
        <button 
          onClick={() => setZoom(z => Math.max(0.7, z - 0.1))} 
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-slate-400 px-1">{Math.round(zoom * 100)}%</span>
        <button 
          onClick={() => setZoom(z => Math.min(1.4, z + 0.1))} 
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setZoom(1)} 
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition border-l border-slate-700 ml-1"
          title="Reset Zoom"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Chaos Monkey Mode Hint Badge */}
      {isChaosMode && (
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-rose-500/15 border border-rose-500/40 text-rose-300 px-3 py-1.5 rounded-xl text-xs font-mono animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>CHAOS MODE ON: Click on any server node to kill or revive it!</span>
        </div>
      )}

      {/* Main Isometric SVG Stage */}
      <svg 
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        viewBox="0 0 920 520"
        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
      >
        <defs>
          {/* Neon Glow Filters */}
          <filter id="glow-amber" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glow-rose" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Gradients */}
          <linearGradient id="wire-gradient-amber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 1. Traffic Connection Lines & Animated Flow Packets */}
        {traffic.map((t, idx) => {
          const fromNode = nodes.find(n => n.id === t.from);
          const toNode = nodes.find(n => n.id === t.to);
          if (!fromNode || !toNode) return null;

          const p1 = toIso(fromNode.x, fromNode.y);
          const p2 = toIso(toNode.x, toNode.y);

          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2 - 25;
          const pathD = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;

          const isSevered = chaosNodes[fromNode.id] || chaosNodes[toNode.id];

          return (
            <g key={`traffic-${idx}`}>
              {/* Underlying Static Track */}
              <path
                d={pathD}
                fill="none"
                stroke={isSevered ? '#475569' : (isDarkMode ? '#1e293b' : '#cbd5e1')}
                strokeWidth={isSevered ? 1.5 : 2.5}
                strokeDasharray={isSevered ? '4 4' : 'none'}
              />

              {/* Glowing Animated Pulse Stream */}
              {!isSevered && t.active && (
                <path
                  d={pathD}
                  fill="none"
                  stroke={t.color || '#f59e0b'}
                  strokeWidth={t.plane === 'control' ? '2' : '2.5'}
                  strokeDasharray={t.plane === 'control' ? '4 6' : '8 6'}
                  className="animate-flow-dash"
                  filter={t.color === '#06b6d4' ? 'url(#glow-cyan)' : 'url(#glow-amber)'}
                />
              )}

              {/* Traffic Label */}
              {t.label && (
                <g transform={`translate(${midX}, ${midY - 4})`}>
                  <rect
                    x="-45"
                    y="-10"
                    width="90"
                    height="18"
                    rx="9"
                    fill={isDarkMode ? '#0f172a' : '#ffffff'}
                    stroke={isSevered ? '#ef4444' : (t.color || '#f59e0b')}
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isSevered ? '#ef4444' : (isDarkMode ? '#f1f5f9' : '#1e293b')}
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    fontWeight="600"
                  >
                    {isSevered ? 'LINK SEVERED' : t.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* 2. 2.5D Isometric Node Tiles */}
        {nodes.map(node => {
          const pt = toIso(node.x, node.y);
          const isDead = chaosNodes[node.id] || node.status === 'dead';
          const isOverheated = node.status === 'overheat';
          const colors = getNodeColors(node.type, isDead, isOverheated);
          const IconComponent = getNodeIcon(node.type);

          const W = 64; // Bán kính ngang tile
          const H = 34; // Chiều cao mặt trên
          const D = 28; // Chiều dày 3D (Extrusion depth)

          return (
            <g 
              key={node.id} 
              transform={`translate(${pt.x}, ${pt.y})`}
              className={`cursor-pointer transition-transform duration-300 ${isOverheated ? 'animate-overheat' : ''}`}
              onClick={() => {
                if (isChaosMode) {
                  onToggleChaosNode(node.id);
                } else {
                  setSelectedNode(node);
                }
              }}
            >
              {/* Thân bên trái khối 3D (Left Extrusion Face) */}
              <polygon
                points={`-${W},0 0,${H} 0,${H + D} -${W},${D}`}
                fill={colors.left}
                stroke={colors.border}
                strokeWidth="1"
              />

              {/* Thân bên phải khối 3D (Right Extrusion Face) */}
              <polygon
                points={`0,${H} ${W},0 ${W},${D} 0,${H + D}`}
                fill={colors.right}
                stroke={colors.border}
                strokeWidth="1"
              />

              {/* Mặt trên khối 3D (Top Face) */}
              <polygon
                points={`0,-${H} ${W},0 0,${H} -${W},0`}
                fill={colors.top}
                stroke={colors.border}
                strokeWidth="1.5"
                filter={isDead ? 'url(#glow-rose)' : undefined}
              />

              {/* Biểu tượng trung tâm (Centered Icon) */}
              <foreignObject x="-14" y="-20" width="28" height="28" className="pointer-events-none">
                <div className="w-full h-full flex items-center justify-center">
                  <IconComponent className={`w-5 h-5 ${isDead ? 'text-rose-400' : colors.text}`} />
                </div>
              </foreignObject>

              {/* Tên thành phần (Node Title) */}
              <text
                x="0"
                y={H + D + 16}
                textAnchor="middle"
                fill={isDarkMode ? '#e2e8f0' : '#1e293b'}
                fontSize="11"
                fontWeight="700"
                fontFamily="Inter"
              >
                {node.name}
              </text>

              {/* Mô tả phụ / Trạng thái */}
              <text
                x="0"
                y={H + D + 30}
                textAnchor="middle"
                fill={isDead ? '#ef4444' : (isOverheated ? '#f97316' : '#64748b')}
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="600"
              >
                {isDead ? '● CRASHED' : (isOverheated ? '🔥 99% CPU' : node.desc)}
              </text>

              {/* Chaos Mode Target Crosshair Icon */}
              {isChaosMode && (
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="animate-spin"
                  style={{ animationDuration: '6s' }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
