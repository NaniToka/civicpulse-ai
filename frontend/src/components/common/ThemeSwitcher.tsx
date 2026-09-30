import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useTheme, THEME_OPTIONS, Theme } from '../../context/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themeOption } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id: Theme) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative" id="theme-switcher-root">
      {/* Trigger Button */}
      <button
        id="theme-switcher-btn"
        onClick={() => setOpen((v) => !v)}
        title={`Theme: ${themeOption.label}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer text-xs font-bold font-mono select-none
          var-btn-bg var-btn-border var-btn-text hover:var-btn-hover"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-primary)',
        }}
      >
        <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
        <span className="hidden sm:inline">{themeOption.emoji} {themeOption.label}</span>
        <span className="sm:hidden">{themeOption.emoji}</span>
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          id="theme-switcher-dropdown"
          className="absolute right-0 top-full mt-2 w-52 rounded-2xl border shadow-2xl z-[999] overflow-hidden"
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: 'var(--border)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
          }}
        >
          {/* Header */}
          <div
            className="px-3 py-2.5 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Choose Theme
            </p>
          </div>

          {/* Theme Options */}
          <div className="p-1.5 space-y-0.5">
            {THEME_OPTIONS.map((opt) => {
              const isActive = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`theme-option-${opt.id}`}
                  onClick={() => handleSelect(opt.id)}
                  className="w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer group"
                  style={{
                    backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--surface-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                  }}
                >
                  {/* Color Preview Swatch */}
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 relative overflow-hidden border"
                    style={{
                      backgroundColor: opt.preview.bg,
                      borderColor: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
                    }}
                  >
                    <div
                      className="absolute bottom-1 right-1 w-3 h-3 rounded-full"
                      style={{ backgroundColor: opt.preview.accent }}
                    />
                    <div
                      className="absolute top-1 left-1 w-4 h-2 rounded-sm"
                      style={{ backgroundColor: opt.preview.surface }}
                    />
                  </div>

                  {/* Label & Description */}
                  <div className="flex-1 min-w-0">
                    <div
                      className="text-xs font-bold leading-none"
                      style={{ color: isActive ? 'var(--accent)' : 'var(--text-primary)' }}
                    >
                      {opt.emoji} {opt.label}
                    </div>
                    <div className="text-[10px] mt-0.5 truncate" style={{ color: 'var(--text-muted)' }}>
                      {opt.description}
                    </div>
                  </div>

                  {/* Active checkmark */}
                  {isActive && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]"
                      style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
