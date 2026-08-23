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
    <div className="relative flex flex-col items-center justify-between w-full min-h-[460px] p-6 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm space-y-6 text-slate-950 font-bold">
      {/* Top Header & 3D Control Bar */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 z-20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-2xs font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight">
                Dataset Volume & Coverage
              </h2>
              <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                3D ISOMETRIC MATRIX
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 mt-0.5 font-bold">
              Interactive 3D isometric cylinder matrix visualizing core system datasets.
            </p>
          </div>
        </div>

        {/* 3D Control Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono text-xs font-bold">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer font-extrabold"
            title={isRotating ? 'Pause 3D Spin' : 'Spin 3D Chart'}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRotating ? 'Pause 3D' : 'Spin 3D'}</span>
          </button>

          <button
            onClick={() => setTiltAngle((prev) => (prev === 55 ? 35 : prev === 35 ? 70 : 55))}
            className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer font-extrabold"
            title="Toggle 3D Tilt Angle"
          >
            <Layers className="w-4 h-4" />
            <span>Tilt ({tiltAngle}°)</span>
          </button>

          <button
            onClick={() => setRotationDeg(0)}
            className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-950 transition cursor-pointer"
            title="Reset Rotation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3D Viewport Box */}
      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center my-auto cursor-grab active:cursor-grabbing z-10">
        {/* 3D Floor Grid Radial Glow */}
        <div
          className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none transition-transform duration-300"
          style={{
            transform: `perspective(900px) rotateX(${tiltAngle}deg) scaleY(0.35) translateY(120px)`,
          }}
        />

        {/* 3D Isometric Bar Grid Container */}
        <div
          className="relative w-full max-w-lg h-60 flex items-end justify-between px-6 transition-transform duration-75 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${tiltAngle}deg) rotateZ(${rotationDeg}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {chartData.map((item, idx) => {
            const heightPx = Math.max(30, (item.value / 100) * 160);
            const isHovered = activePillar === idx;

            return (
              <div
                key={item.label}
                onMouseEnter={() => setActivePillar(idx)}
                onMouseLeave={() => setActivePillar(null)}
                className="relative flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
                style={{
                  transform: `translateZ(${idx * 15}px)`,
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
                      className="w-12 h-3.5 rounded-full border border-white/20 transition-all duration-200"
                      style={{
                        backgroundColor: item.color,
                        opacity: 0.4 + (layerIdx / 14) * 0.6,
                        filter: isHovered ? 'brightness(1.2)' : 'none',
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
          <div className="absolute top-4 z-30 px-4 py-2 rounded-xl bg-white border border-slate-300 text-center font-mono shadow-md animate-in fade-in duration-150 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartData[activePillar].color }} />
              <span className="text-slate-950 font-extrabold text-xs sm:text-sm">{chartData[activePillar].label}:</span>
              <span className="text-indigo-700 font-extrabold text-sm sm:text-base">{chartData[activePillar].displayVal}</span>
              <span className="text-slate-700 text-xs font-bold">({chartData[activePillar].category})</span>
            </div>
          </div>
        )}
      </div>

      {/* Category Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 w-full pt-4 border-t border-slate-200 font-mono text-xs font-bold">
        {chartData.map((item, idx) => {
          const isSelected = activePillar === idx;
          return (
            <button
              key={item.label}
              onMouseEnter={() => setActivePillar(idx)}
              onMouseLeave={() => setActivePillar(null)}
              className={`p-3 rounded-xl border text-center transition-colors duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-extrabold shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-100 font-bold'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-950 font-extrabold truncate">{item.label}</span>
              </div>
              <div className="text-indigo-700 font-extrabold text-sm">{item.displayVal}</div>
              <div className="text-xs text-slate-700 mt-0.5 font-sans font-bold">{item.category}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
