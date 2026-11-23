import React, { useState } from 'react';
import { 
  Play, Pause, Sliders, Zap, Database, Server, Layers, 
  ShieldCheck, AlertTriangle, ArrowRight, RefreshCw, Cpu
} from 'lucide-react';
import IsometricCanvas from './IsometricCanvas';

/**
 * 🛠️ INTERACTIVE DESIGN LAB & TRAFFIC STRESS SIMULATOR
 * ============================================================================
 * Cho phép người dùng tự lắp ghép kiến trúc hệ thống và kéo thanh trượt
 * lưu lượng từ 1,000 QPS đến 200,000 QPS để tận mắt quan sát cách hệ thống
 * chống đỡ hoặc bị sập khi thiếu Cache / Read Replicas!
 */
export default function DesignLab({ isDarkMode = true }) {
  // Trạng thái bật/tắt các thành phần kiến trúc
  const [enabledComponents, setEnabledComponents] = useState({
    cdn: true,
    lb: true,
    cache: true,
    readReplica: false,
    kafka: false
  });

  // Thanh trượt lưu lượng (Traffic QPS)
  const [trafficQps, setTrafficQps] = useState(25000); // 25k QPS
  const [isRunning, setIsRunning] = useState(true);

  // Toggle thành phần
  const toggleComponent = (key) => {
    setEnabledComponents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Tính toán chỉ số hiệu năng theo cấu hình kiến trúc thực tế
  const calculateSystemHealth = () => {
    const hasCdn = enabledComponents.cdn;
    const hasCache = enabledComponents.cache;
    const hasReplica = enabledComponents.readReplica;
    const hasKafka = enabledComponents.kafka;

    // Tỷ lệ request chạm tới Database
    let dbTrafficRatio = 1.0;
    if (hasCdn) dbTrafficRatio *= 0.65; // CDN giảm 35% static assets
    if (hasCache) dbTrafficRatio *= 0.12; // Cache gánh 88% read queries
    if (hasReplica) dbTrafficRatio *= 0.5; // Replica gánh 50% read load
    if (hasKafka) dbTrafficRatio *= 0.7; // Queue làm mịn đợt ghi đột biến

    const directDbQps = Math.round(trafficQps * dbTrafficRatio);

    // Database quá tải nếu nhận trên 8,000 QPS trực tiếp
    const isDbOverheated = directDbQps > 8000;
    const isDbCrashed = directDbQps > 18000;

    // Tính độ trễ (Latency)
    let latency = 4; // base 4ms
    if (!hasCdn) latency += 35;
    if (!hasCache) latency += 120;
    if (isDbOverheated) latency += 450;
    if (isDbCrashed) latency += 1200;

    const dbCpu = Math.min(100, Math.round((directDbQps / 8000) * 85));

    return {
      directDbQps,
      isDbOverheated,
      isDbCrashed,
      latency: `${latency}ms`,
      dbCpu: `${dbCpu}%`,
      cacheHitRate: hasCache ? '91%' : '0%',
      status: isDbCrashed ? 'CRITICAL FAILURE' : (isDbOverheated ? 'OVERLOAD WARNING' : 'HEALTHY & SCALABLE')
    };
  };

  const health = calculateSystemHealth();

  // Dựng danh sách Nodes hiển thị trên 2.5D Canvas
  const buildNodes = () => {
    const nodes = [
      { id: 'client', name: 'Users Fleet', type: 'client', x: 80, y: 180, status: 'active', desc: `${(trafficQps/1000).toFixed(0)}k Concurrent QPS` }
    ];

    let lastX = 240;

    if (enabledComponents.cdn) {
      nodes.push({ id: 'cdn', name: 'Cloudflare CDN', type: 'dns', x: lastX, y: 180, status: 'active', desc: 'Edge Caching (35% absorbed)' });
      lastX += 160;
    }

    if (enabledComponents.lb) {
      nodes.push({ id: 'lb', name: 'Nginx Load Balancer', type: 'lb', x: lastX, y: 180, status: 'active', desc: 'L7 Round Robin' });
      lastX += 160;
    }

    nodes.push({ id: 'api', name: 'API Cluster', type: 'app', x: lastX, y: 180, status: 'active', desc: 'Auto-scaled Fleet' });

    if (enabledComponents.cache) {
      nodes.push({ id: 'cache', name: 'Redis Cache', type: 'cache', x: lastX + 160, y: 80, status: 'active', desc: 'RAM (0.2ms Latency)' });
    }

    if (enabledComponents.kafka) {
      nodes.push({ id: 'kafka', name: 'Kafka Queue', type: 'queue', x: lastX + 160, y: 280, status: 'active', desc: 'Async Buffer' });
    }

    nodes.push({ 
      id: 'db', 
      name: 'Primary SQL DB', 
      type: 'db', 
      x: lastX + 300, 
      y: 180, 
      status: health.isDbCrashed ? 'dead' : (health.isDbOverheated ? 'overheat' : 'active'),
      desc: `CPU: ${health.dbCpu} (${health.directDbQps} QPS)` 
    });

    if (enabledComponents.readReplica) {
      nodes.push({ 
        id: 'replica', 
        name: 'Read Replica', 
        type: 'db', 
        x: lastX + 300, 
        y: 290, 
        status: 'active', 
        desc: 'Replication Sync' 
      });
    }

    return nodes;
  };

  // Dựng đường truyền dữ liệu
  const buildTraffic = () => {
    const list = [];
    const hasCdn = enabledComponents.cdn;
    const hasLb = enabledComponents.lb;
    const hasCache = enabledComponents.cache;
    const hasKafka = enabledComponents.kafka;
    const hasReplica = enabledComponents.readReplica;

    let prevNode = 'client';

    if (hasCdn) {
      list.push({ from: prevNode, to: 'cdn', label: `${(trafficQps/1000).toFixed(0)}k QPS`, active: isRunning, color: '#06b6d4' });
      prevNode = 'cdn';
    }

    if (hasLb) {
      list.push({ from: prevNode, to: 'lb', label: 'Proxy', active: isRunning, color: '#f59e0b' });
      prevNode = 'lb';
    }

    list.push({ from: prevNode, to: 'api', label: 'Forward', active: isRunning, color: '#10b981' });

    if (hasCache) {
      list.push({ from: 'api', to: 'cache', label: 'Cache (91%)', active: isRunning, color: '#06b6d4' });
    }

    if (hasKafka) {
      list.push({ from: 'api', to: 'kafka', label: 'Async Queue', active: isRunning, color: '#a855f7' });
      list.push({ from: 'kafka', to: 'db', label: 'Smooth Write', active: isRunning, color: '#10b981' });
    }

    list.push({ 
      from: 'api', 
      to: 'db', 
      label: `${health.directDbQps} QPS`, 
      active: isRunning, 
      color: health.isDbOverheated ? '#f43f5e' : '#f59e0b' 
    });

    if (hasReplica) {
      list.push({ from: 'db', to: 'replica', label: 'Binlog Sync', active: isRunning, color: '#06b6d4' });
    }

    return list;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Live Health Status Bar */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 backdrop-blur-md ${
        health.isDbCrashed 
          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200' 
          : health.isDbOverheated 
            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200' 
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            health.isDbCrashed ? 'bg-rose-500/20 text-rose-400' : (health.isDbOverheated ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400')
          }`}>
            {health.isDbCrashed || health.isDbOverheated ? (
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            ) : (
              <ShieldCheck className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider">Hệ thống:</span>
              <span className="font-bold text-sm tracking-wide">{health.status}</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {health.isDbCrashed 
                ? 'Lưu lượng trực tiếp quá cao đã đánh sập Database! Hãy bật Redis Cache hoặc Read Replica.' 
                : health.isDbOverheated 
                  ? 'Database đang nóng lên (CPU > 85%). Cần thêm bộ đệm hoặc phân tán đọc!' 
                  : 'Kiến trúc được phân tải hoàn hảo, độ trễ cực thấp và chịu tải an toàn.'}
            </p>
          </div>
        </div>

        {/* Live Metrics Counters */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase">Latency</span>
            <span className="font-bold text-amber-400 text-sm">{health.latency}</span>
          </div>
          <div className="text-right border-l border-slate-700/50 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase">DB CPU</span>
            <span className={`font-bold text-sm ${health.isDbOverheated ? 'text-rose-400' : 'text-emerald-400'}`}>
              {health.dbCpu}
            </span>
          </div>
          <div className="text-right border-l border-slate-700/50 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase">DB Reads</span>
            <span className="font-bold text-slate-200 text-sm">{health.directDbQps} /s</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Isometric Canvas */}
      <IsometricCanvas
        nodes={buildNodes()}
        traffic={buildTraffic()}
        metrics={{
          qps: `${(trafficQps / 1000).toFixed(0)}k /s`,
          latency: health.latency,
          dbCpu: health.dbCpu,
          cacheHit: health.cacheHitRate
        }}
        isDarkMode={isDarkMode}
      />

      {/* 3. Traffic Stress Slider & Component Toggle Toolbar */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-[#121722] border-[#1f293d]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* A. Traffic Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Mô phỏng Lưu lượng (Traffic Load):</span>
              </label>
              <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-lg">
                {trafficQps.toLocaleString()} QPS
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="200000"
              step="5000"
              value={trafficQps}
              onChange={(e) => setTrafficQps(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>1k (Nhẹ)</span>
              <span>25k (Vừa)</span>
              <span>80k (Cao)</span>
              <span>200k QPS (Flash Sale)</span>
            </div>
          </div>

          {/* B. Modular Component Toggles */}
          <div>
            <span className="text-sm font-semibold block mb-3 text-slate-300">
              Bật / Tắt các thành phần kiến trúc:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {[
                { key: 'cdn', name: 'CDN Edge', icon: Layers },
                { key: 'lb', name: 'Load Balancer', icon: RefreshCw },
                { key: 'cache', name: 'Redis Cache', icon: Zap },
                { key: 'readReplica', name: 'Read Replica', icon: Database },
                { key: 'kafka', name: 'Kafka Queue', icon: Cpu }
              ].map(comp => {
                const active = enabledComponents[comp.key];
                const Icon = comp.icon;
                return (
                  <button
                    key={comp.key}
                    onClick={() => toggleComponent(comp.key)}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-medium flex items-center gap-2 border transition-all ${
                      active
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                        : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{comp.name}</span>
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
