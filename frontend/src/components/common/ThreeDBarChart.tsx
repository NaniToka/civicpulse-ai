import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Layers, BarChart3 } from 'lucide-react';

interface MetricBarData {
  label: string;
  value: number;
  displayVal: string;
  color: string;
  category: string;
}

interface ThreeDBarChartProps {
  metrics?: MetricBarData[];
}

export const ThreeDBarChart: React.FC<ThreeDBarChartProps> = ({ metrics }) => {
  const [isRotating, setIsRotating] = useState(true);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [tiltAngle, setTiltAngle] = useState(55);
  const [activePillar, setActivePillar] = useState<number | null>(null);

  const defaultMetrics: MetricBarData[] = [
    { label: 'Citizen Demands', value: 92, displayVal: '24,680', color: '#06b6d4', category: 'Signals Ingested' },
    { label: 'Indian Districts', value: 85, displayVal: '35 Districts', color: '#38bdf8', category: 'Census Covered' },
    { label: 'Sector Indicators', value: 98, displayVal: '210 Matrix', color: '#6366f1', category: 'Gaps Measured' },
    { label: 'Capital Projects', value: 78, displayVal: '35 Projects', color: '#f59e0b', category: 'Investments Tracked' },
    { label: 'Evidence Trails', value: 90, displayVal: '100% Traceable', color: '#10b981', category: '6-Step Audit' },
  ];

  const chartData = metrics || defaultMetrics;

  // Smooth 3D rotation animation
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationDeg((prev) => (prev + 0.8) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isRotating]);

  return (
    <div className="relative flex flex-col items-center justify-between w-full min-h-[460px] p-6 rounded-2xl bg-gradient-to-b from-slate-950/95 via-[#070e1c] to-slate-950/95 border border-cyan-900/50 overflow-hidden shadow-2xl space-y-6">
      {/* Decorative Ambient Lighting Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Top Header & 3D Control Bar (Clean Layout) */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/90 border border-cyan-700/80 text-cyan-400 shadow-md">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-100 font-mono tracking-tight">
                Dataset Volume & Coverage
              </h2>
              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700">
                3D ISOMETRIC MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Interactive 3D isometric cylinder matrix visualizing core system datasets.
            </p>
          </div>
        </div>

        {/* 3D Control Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono text-[10px] font-bold">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title={isRotating ? 'Pause 3D Spin' : 'Spin 3D Chart'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? 'Pause 3D' : 'Spin 3D'}</span>
          </button>

          <button
            onClick={() => setTiltAngle((prev) => (prev === 55 ? 38 : prev === 38 ? 68 : 55))}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-indigo-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            title="Toggle 3D Tilt Angle"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tilt ({tiltAngle}°)</span>
          </button>

          <button
            onClick={() => setRotationDeg(0)}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Reset Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport with Isometric Floor Grid & Solid 3D Cylinder Pillars */}
      <div className="relative w-full h-80 flex items-center justify-center my-auto cursor-grab active:cursor-grabbing z-10">
        {/* 3D Floor Grid Plane with Glowing Rings */}
        <div
          className="absolute w-80 h-80 rounded-full bg-cyan-950/20 border-2 border-cyan-500/30 blur-[1px] pointer-events-none transition-transform duration-300"
          style={{
            transform: `perspective(900px) rotateX(${tiltAngle}deg) scaleY(0.4) translateY(90px)`,
          }}
        />

        {/* 3D Rotating Isometric Cylinder Matrix */}
        <div
          className="relative w-80 h-80 flex items-center justify-center transition-transform duration-75 ease-out"
          style={{
            transform: `perspective(900px) rotateX(${tiltAngle}deg) rotateZ(${rotationDeg}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {chartData.map((item, idx) => {
            const angleStep = (360 / chartData.length) * idx;
            const radius = 105; // px distance from center
            const rad = (angleStep * Math.PI) / 180;
            const x = Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;

            const isHovered = activePillar === idx;
            const heightPx = Math.max(45, Math.round((item.value / 100) * 125));

            return (
              <div
                key={item.label}
                onMouseEnter={() => setActivePillar(idx)}
                onMouseLeave={() => setActivePillar(null)}
                className="absolute transition-all duration-300 cursor-pointer group"
                style={{
                  transform: `translate3d(${x}px, ${y}px, 0px) ${isHovered ? 'scale(1.18)' : 'scale(1)'}`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* 3D Floor Shadow Disc */}
                <div
                  className="w-14 h-14 rounded-full blur-md opacity-70 pointer-events-none"
                  style={{ backgroundColor: item.color }}
                />

                {/* Solid Sleek 3D Extruded Cylinder Bar */}
                <div
                  className="relative w-12 flex flex-col-reverse items-center justify-end rounded-t-full transition-all duration-300"
                  style={{ height: `${heightPx}px` }}
                >
                  {/* Layered Glass Cylinder Rings */}
                  {[...Array(14)].map((_, layerIdx) => (
                    <div
                      key={layerIdx}
                      className="w-12 h-3.5 rounded-full border border-white/20 transition-all duration-200"
                      style={{
                        backgroundColor: item.color,
                        opacity: 0.3 + (layerIdx / 14) * 0.7,
                        filter: isHovered ? 'brightness(1.4)' : 'none',
                        boxShadow: layerIdx === 13 ? `0 0 20px ${item.color}` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Crisp Upright Glass Hover Popover Badge (Never upside-down or skewed!) */}
        {activePillar !== null && chartData[activePillar] && (
          <div className="absolute top-4 z-30 px-5 py-2.5 rounded-2xl bg-slate-950/95 border-2 border-cyan-400 text-center font-mono shadow-[0_0_30px_rgba(6,182,212,0.6)] animate-in fade-in zoom-in duration-200 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full animate-ping" style={{ backgroundColor: chartData[activePillar].color }} />
              <span className="text-slate-100 font-extrabold text-sm">{chartData[activePillar].label}:</span>
              <span className="text-cyan-300 font-black text-base">{chartData[activePillar].displayVal}</span>
              <span className="text-slate-400 text-xs">({chartData[activePillar].category})</span>
            </div>
          </div>
        )}
      </div>

      {/* 3D Category Legend Grid (Clean Desktop & Mobile Layout) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full pt-4 border-t border-slate-800/80 z-20 font-mono text-xs">
        {chartData.map((item, idx) => {
          const isSelected = activePillar === idx;
          return (
            <button
              key={item.label}
              onMouseEnter={() => setActivePillar(idx)}
              onMouseLeave={() => setActivePillar(null)}
              className={`p-3.5 rounded-2xl border text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/90 border-cyan-400 scale-105 shadow-xl shadow-cyan-950 glow-cyan'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-200 font-extrabold truncate">{item.label}</span>
              </div>
              <div className="text-cyan-300 font-black text-base">{item.displayVal}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-sans font-medium">{item.category}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
