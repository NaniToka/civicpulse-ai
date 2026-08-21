import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Layers } from 'lucide-react';

interface CategoryData {
  label: string;
  count: number;
  color: string;
}

interface ThreeDDonutChartProps {
  data: CategoryData[];
  total: number;
}

export const ThreeDDonutChart: React.FC<ThreeDDonutChartProps> = ({ data, total }) => {
  const [isRotating, setIsRotating] = useState(true);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [tiltAngle, setTiltAngle] = useState(58);

  // Fast & silky smooth 60fps 3D rotation animation
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotationDeg((prev) => (prev + 1.2) % 360);
    }, 16);
    return () => clearInterval(interval);
  }, [isRotating]);

  return (
    <div className="relative flex flex-col items-center justify-between w-full min-h-[420px] p-5 rounded-2xl bg-gradient-to-b from-slate-950/95 via-[#070d1a] to-slate-950/95 border border-cyan-900/50 overflow-hidden shadow-2xl space-y-4">
      {/* Decorative 3D Ambient Lighting Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/25 via-transparent to-transparent pointer-events-none" />

      {/* Top Header & 3D Control Bar (Clean Layout without Overlap) */}
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 z-20">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/90 px-3 py-1 rounded-full border border-cyan-700/80 shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>3D ISOMETRIC CYLINDER ENGINE • FAST SHADER</span>
        </div>

        {/* 3D Control Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 hover:text-white hover:bg-slate-800 transition font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm cursor-pointer"
            title={isRotating ? 'Pause Rotation' : 'Spin 3D Ring'}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRotating ? 'Pause 3D' : 'Spin 3D'}</span>
          </button>

          <button
            onClick={() => setTiltAngle((prev) => (prev === 58 ? 40 : prev === 40 ? 70 : 58))}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-indigo-300 hover:text-white hover:bg-slate-800 transition font-mono text-[10px] font-bold flex items-center gap-1 shadow-sm cursor-pointer"
            title="Toggle 3D Tilt Angle"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tilt ({tiltAngle}°)</span>
          </button>

          <button
            onClick={() => setRotationDeg(0)}
            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 transition text-[10px] cursor-pointer"
            title="Reset Rotation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3D Isometric Viewport (Responsive Circle Size) */}
      <div className="relative w-full h-64 sm:h-72 flex items-center justify-center my-auto cursor-grab active:cursor-grabbing z-10">
        {/* 3D Floor Glow Disc */}
        <div
          className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none transition-transform duration-300"
          style={{
            transform: `perspective(800px) rotateX(${tiltAngle}deg) scaleY(0.35) translateY(90px)`,
          }}
        />

        {/* 3D Extruded Cylinder Ring Assembly */}
        <div
          className="relative w-56 h-56 sm:w-72 sm:h-72 transition-transform duration-75 ease-out"
          style={{
            transform: `perspective(900px) rotateX(${tiltAngle}deg) rotateZ(${rotationDeg}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Layer 1: Bottom Extrusion Shadow Base */}
          <svg className="absolute inset-0 w-full h-full transform translate-z-[-16px] opacity-50 blur-[1px]" viewBox="0 0 100 100">
            {(() => {
              let currentAngle = 0;
              return data.map((item, idx) => {
                const percent = (item.count / total) * 100;
                const dashArray = `${percent} ${100 - percent}`;
                const dashOffset = -currentAngle;
                currentAngle += percent;

                return (
                  <circle
                    key={`bottom-${idx}`}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#020617"
                    strokeWidth="18"
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    pathLength="100"
                  />
                );
              });
            })()}
          </svg>

          {/* Layer 2: 3D Side Wall Extrusions (Multi-layered SVG Walls) */}
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((layer) => (
            <svg
              key={`wall-${layer}`}
              className="absolute inset-0 w-full h-full pointer-events-none opacity-95"
              style={{
                transform: `translateZ(${-layer * 1.6}px)`,
              }}
              viewBox="0 0 100 100"
            >
              {(() => {
                let currentAngle = 0;
                return data.map((item, idx) => {
                  const percent = (item.count / total) * 100;
                  const dashArray = `${percent} ${100 - percent}`;
                  const dashOffset = -currentAngle;
                  currentAngle += percent;

                  return (
                    <circle
                      key={`wall-${layer}-${idx}`}
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke={item.color}
                      strokeWidth="18"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      pathLength="100"
                      style={{
                        filter: `brightness(${0.35 + layer * 0.055})`,
                      }}
                    />
                  );
                });
              })()}
            </svg>
          ))}

          {/* Layer 3: Top Shiny 3D Ring Slices */}
          <svg className="absolute inset-0 w-full h-full drop-shadow-[0_0_16px_rgba(6,182,212,0.5)]" viewBox="0 0 100 100">
            {(() => {
              let currentAngle = 0;
              return data.map((item, idx) => {
                const percent = (item.count / total) * 100;
                const dashArray = `${percent} ${100 - percent}`;
                const dashOffset = -currentAngle;
                const isHovered = activeSlice === idx;
                currentAngle += percent;

                return (
                  <circle
                    key={`top-${idx}`}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth={isHovered ? 22 : 18}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    pathLength="100"
                    onMouseEnter={() => setActiveSlice(idx)}
                    onMouseLeave={() => setActiveSlice(null)}
                    className="transition-all duration-200 cursor-pointer hover:brightness-125"
                    style={{
                      transformOrigin: 'center',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                );
              });
            })()}
          </svg>
        </div>

        {/* Compact Floating 3D Core Badge (Reduced Size for 35 SIGNALS) */}
        <div className="absolute z-20 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-slate-950/95 border border-cyan-400/80 shadow-[0_0_25px_rgba(6,182,212,0.6)] backdrop-blur-md pointer-events-none font-mono">
          <div className="w-2 h-2 rounded-full bg-cyan-400 mb-0.5 animate-ping" />
          <span className="text-xl font-extrabold tracking-tight text-slate-100 glow-cyan">{total}</span>
          <span className="text-[9px] text-cyan-300 font-extrabold uppercase tracking-widest">SIGNALS</span>
        </div>

        {/* Hovered 3D Slice Tooltip Popover */}
        {activeSlice !== null && data[activeSlice] && (
          <div className="absolute bottom-1 z-30 px-3.5 py-1.5 rounded-xl bg-slate-950/95 border border-cyan-400 text-center font-mono shadow-2xl animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data[activeSlice].color }} />
              <span className="text-slate-100 font-extrabold text-xs">{data[activeSlice].label}</span>
              <span className="text-cyan-300 font-bold text-xs">
                {data[activeSlice].count} ({Math.round((data[activeSlice].count / total) * 100)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3D Category Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 w-full pt-3 border-t border-slate-800/80 z-20 font-mono text-[11px]">
        {data.map((item, idx) => {
          const pct = Math.round((item.count / total) * 100);
          const isSelected = activeSlice === idx;
          return (
            <button
              key={item.label}
              onMouseEnter={() => setActiveSlice(idx)}
              onMouseLeave={() => setActiveSlice(null)}
              className={`p-2 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/90 border-cyan-400 scale-105 shadow-md shadow-cyan-950'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-200 font-bold truncate">{item.label}</span>
              </div>
              <div className="text-cyan-300 font-extrabold text-xs">{pct}%</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
