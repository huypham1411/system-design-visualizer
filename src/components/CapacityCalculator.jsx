import React, { useState } from 'react';
import { Calculator, HardDrive, Cpu, Activity, Database, Server, RefreshCw } from 'lucide-react';

/**
 * 🧮 BACK-OF-THE-ENVELOPE CAPACITY ESTIMATOR
 * ============================================================================
 * Bộ công cụ tính toán dung lượng, băng thông và bộ nhớ RAM theo quy chuẩn
 * phỏng vấn High-Level Design (HLD) chuẩn FAANG/Big Tech.
 */
export default function CapacityCalculator({ isDarkMode = true }) {
  const [dau, setDau] = useState(50000000); // 50 triệu DAU
  const [readsPerUser, setReadsPerUser] = useState(25); // 25 reads / ngày
  const [writesPerUser, setWritesPerUser] = useState(2); // 2 writes / ngày
  const [mediaSizeKb, setMediaSizeKb] = useState(150); // 150 KB / write

  // Tính toán các đại lượng toán học
  const SECONDS_PER_DAY = 86400;

  // 1. QPS (Queries Per Second)
  const totalReadsPerDay = dau * readsPerUser;
  const totalWritesPerDay = dau * writesPerUser;

  const avgReadQps = Math.round(totalReadsPerDay / SECONDS_PER_DAY);
  const avgWriteQps = Math.round(totalWritesPerDay / SECONDS_PER_DAY);
  const peakReadQps = avgReadQps * 2; // Peak factor 2x
  const peakWriteQps = avgWriteQps * 2;

  // 2. Storage Estimation (Lưu trữ)
  const bytesPerDay = totalWritesPerDay * (mediaSizeKb * 1024);
  const tbPerDay = bytesPerDay / (1024 ** 4);
  const tbPerYear = tbPerDay * 365;
  const tb5Years = tbPerYear * 5;

  // 3. Network Bandwidth (Băng thông)
  // Giả sử mỗi read payload trung bình 10 KB, write payload mediaSizeKb
  const readBandwidthBytesSec = avgReadQps * (10 * 1024);
  const writeBandwidthBytesSec = avgWriteQps * (mediaSizeKb * 1024);
  const totalBandwidthGbps = ((readBandwidthBytesSec + writeBandwidthBytesSec) * 8) / (1000 ** 3);

  // 4. Memory Cache Estimation (Quy tắc 80/20)
  // Lưu 20% dữ liệu đọc hot nhất trong 1 ngày vào RAM
  const cacheRamGb = Math.round((totalReadsPerDay * 0.20 * (10 * 1024)) / (1024 ** 3));

  return (
    <div className={`p-6 rounded-2xl border ${
      isDarkMode ? 'bg-[#121722] border-[#1f293d]' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Title Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              Back-of-the-Envelope Capacity Estimator
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                FAANG Interview Ready
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Ước tính tải lượng QPS, ổ cứng lưu trữ, băng thông mạng và dung lượng RAM cần thiết.
            </p>
          </div>
        </div>

        <button 
          onClick={() => { setDau(50000000); setReadsPerUser(25); setWritesPerUser(2); setMediaSizeKb(150); }}
          className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-600 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Đặt lại chuẩn</span>
        </button>
      </div>

      {/* Input Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-slate-700/50">
        {/* DAU */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Người dùng hàng ngày (DAU):</span>
            <span className="font-mono font-bold text-amber-400">{(dau / 1000000).toFixed(0)} Triệu</span>
          </div>
          <input
            type="range"
            min="1000000"
            max="500000000"
            step="5000000"
            value={dau}
            onChange={(e) => setDau(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Reads / User */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Lượt đọc / người / ngày:</span>
            <span className="font-mono font-bold text-cyan-400">{readsPerUser} reads</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            value={readsPerUser}
            onChange={(e) => setReadsPerUser(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Writes / User */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Lượt ghi / người / ngày:</span>
            <span className="font-mono font-bold text-emerald-400">{writesPerUser} writes</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            value={writesPerUser}
            onChange={(e) => setWritesPerUser(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Payload Size */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Dung lượng mỗi lần ghi:</span>
            <span className="font-mono font-bold text-purple-400">{mediaSizeKb} KB</span>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={mediaSizeKb}
            onChange={(e) => setMediaSizeKb(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </div>

      {/* Output Results Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
        {/* Card 1: QPS Breakdown */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-mono font-semibold">
            <Activity className="w-4 h-4" />
            <span>THROUGHPUT (QPS)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {avgReadQps.toLocaleString()} <span className="text-xs text-slate-400 font-normal">Read QPS</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Peak (2x):</span>
            <span className="text-amber-300 font-bold">{peakReadQps.toLocaleString()} QPS</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Write QPS:</span>
            <span className="text-slate-300 font-bold">{avgWriteQps.toLocaleString()} QPS</span>
          </div>
        </div>

        {/* Card 2: Storage Per Year */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono font-semibold">
            <HardDrive className="w-4 h-4" />
            <span>STORAGE (LƯU TRỮ)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {tbPerYear.toFixed(1)} TB <span className="text-xs text-slate-400 font-normal">/ Năm</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Mỗi ngày:</span>
            <span className="text-cyan-300 font-bold">{tbPerDay.toFixed(2)} TB/ngày</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>5 Năm (Long-term):</span>
            <span className="text-slate-300 font-bold">{(tb5Years / 1000).toFixed(1)} PB</span>
          </div>
        </div>

        {/* Card 3: RAM for 80/20 Caching */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono font-semibold">
            <Cpu className="w-4 h-4" />
            <span>RAM CACHE (80/20)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {cacheRamGb} GB <span className="text-xs text-slate-400 font-normal">RAM</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Quy tắc:</span>
            <span className="text-emerald-300 font-bold">Top 20% Hot Data</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Cần khoảng:</span>
            <span className="text-slate-300 font-bold">{Math.ceil(cacheRamGb / 64)} server Redis (64GB)</span>
          </div>
        </div>

        {/* Card 4: Bandwidth Gbps */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono font-semibold">
            <Server className="w-4 h-4" />
            <span>BANDWIDTH (BĂNG THÔNG)</span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalBandwidthGbps.toFixed(2)} <span className="text-xs text-slate-400 font-normal">Gbps</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Read Flow:</span>
            <span className="text-purple-300 font-bold">{((readBandwidthBytesSec * 8) / (1000 ** 2)).toFixed(0)} Mbps</span>
          </div>
          <div className="text-xs font-mono text-slate-400 flex justify-between">
            <span>Write Flow:</span>
            <span className="text-slate-300 font-bold">{((writeBandwidthBytesSec * 8) / (1000 ** 2)).toFixed(0)} Mbps</span>
          </div>
        </div>
      </div>
    </div>
  );
}
