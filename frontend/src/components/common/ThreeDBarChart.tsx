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
    { label: 'Citizen Demands', value: 92, displayVal: '24,680', color: '#6366f1', category: 'Signals Ingested' },
    { label: 'Indian Districts', value: 85, displayVal: '35 Districts', color: '#6366f1', category: 'Census Covered' },
    { label: 'Sector Indicators', value: 98, displayVal: '210 Matrix', color: '#22c55e', category: 'Gaps Measured' },
    { label: 'Capital Projects', value: 78, displayVal: '35 Projects', color: '#f59e0b', category: 'Investments Tracked' },
    { label: 'Evidence Trails', value: 90, displayVal: '100% Traceable', color: '#22c55e', category: '6-Step Audit' },
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
    <div className="relative flex flex-col items-center justify-between w-full min-h-[460px] p-6 rounded-xl bg-[#0A0A0C] border border-white/[0.08] overflow-hidden shadow-sm space-y-6">
      {/* Top Header & 3D Control Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 shadow-sm">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-100 tracking-tight">
                Dataset Volume & Coverage
              </h2>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                3D ISOMETRIC MATRIX
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Interactive 3D isometric cylinder matrix visualizing core system datasets.
            </p>
          </div>
        </div>

        {/* 3D Control Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono text-[10px] font-medium">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-1.5 rounded-lg bg-[#121215] border border-white/[0.08] text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            title={isRotating ? 'Pause 3D Spin' : 'Spin 3D Chart'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? 'Pause 3D' : 'Spin 3D'}</span>
          </button>

          <button
            onClick={() => setTiltAngle((prev) => (prev === 55 ? 38 : prev === 38 ? 68 : 55))}
            className="px-3 py-1.5 rounded-lg bg-[#121215] border border-white/[0.08] text-slate-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
            title="Toggle 3D Tilt Angle"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tilt ({tiltAngle}°)</span>
          </button>

          <button
            onClick={() => setRotationDeg(0)}
            className="p-1.5 rounded-lg bg-[#121215] border border-white/[0.08] text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Reset Angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport with Isometric Floor Grid & Solid 3D Cylinder Pillars */}
      <div className="relative w-full h-80 flex items-center justify-center my-auto cursor-grab active:cursor-grabbing z-10">
        {/* 3D Floor Grid Plane */}
        <div
          className="absolute w-80 h-80 rounded-full bg-indigo-500/10 border border-indigo-500/20 blur-[1px] pointer-events-none transition-transform duration-300"
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
            const radius = 105;
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
                  className="w-14 h-14 rounded-full blur-md opacity-40 pointer-events-none"
                  style={{ backgroundColor: item.color }}
                />

                {/* Solid 3D Extruded Cylinder Bar */}
                <div
                  className="relative w-12 flex flex-col-reverse items-center justify-end rounded-t-full transition-all duration-300"
                  style={{ height: `${heightPx}px` }}
                >
                  {[...Array(14)].map((_, layerIdx) => (
                    <div
                      key={layerIdx}
                      className="w-12 h-3.5 rounded-full border border-white/10 transition-all duration-200"
                      style={{
                        backgroundColor: item.color,
                        opacity: 0.3 + (layerIdx / 14) * 0.7,
                        filter: isHovered ? 'brightness(1.3)' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Upright Popover Badge */}
        {activePillar !== null && chartData[activePillar] && (
          <div className="absolute top-4 z-30 px-4 py-2 rounded-xl bg-[#121215] border border-white/[0.16] text-center font-mono shadow-md animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartData[activePillar].color }} />
              <span className="text-slate-100 font-semibold text-xs">{chartData[activePillar].label}:</span>
              <span className="text-indigo-400 font-bold text-sm">{chartData[activePillar].displayVal}</span>
              <span className="text-slate-400 text-xs">({chartData[activePillar].category})</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full pt-4 border-t border-white/[0.08] font-mono text-xs">
        {chartData.map((item, idx) => {
          const isSelected = activePillar === idx;
          return (
            <button
              key={item.label}
              onMouseEnter={() => setActivePillar(idx)}
              onMouseLeave={() => setActivePillar(null)}
              className={`p-3 rounded-lg border text-center transition-colors duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400'
                  : 'bg-[#121215] border-white/[0.08] text-slate-300 hover:border-white/[0.16]'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-200 font-semibold truncate">{item.label}</span>
              </div>
              <div className="text-indigo-400 font-bold text-sm">{item.displayVal}</div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-sans">{item.category}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
