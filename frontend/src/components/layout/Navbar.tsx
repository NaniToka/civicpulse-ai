import React, { useState } from 'react';
import {
  Command,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Compass,
  LayoutDashboard,
  Search,
  Flame,
  AlertCircle,
  FileCheck,
  Network,
  TestTube2,
  Database,
  MessageSquare,
} from 'lucide-react';
import { NavTab } from './Sidebar';

import { UserProfile } from '../common/AuthModal';

interface NavbarProps {
  onOpenCommandPalette?: () => void;
  onOpenRaiseComplaint?: () => void;
  onOpenAuth?: () => void;
  currentUser?: UserProfile | null;
  activeTab?: NavTab;
  setActiveTab?: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCommandPalette,
  onOpenRaiseComplaint,
  onOpenAuth,
  currentUser,
  activeTab = 'dashboard',
  setActiveTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" />, desc: 'Summary of citizen needs & priorities' },
    { id: 'copilot', label: 'Ask AI Assistant', icon: <Sparkles className="w-4 h-4 text-indigo-400" />, desc: 'Ask questions to AI & get evidence answers' },
    { id: 'demand', label: 'Citizen Complaints', icon: <Search className="w-4 h-4" />, desc: 'Multilingual complaints & growth trends' },
    { id: 'feedback', label: 'Community Wall', icon: <MessageSquare className="w-4 h-4" />, desc: 'Public feedback wall & emojis' },
    { id: 'hotspots', label: 'Problem Hotspots', icon: <Flame className="w-4 h-4" />, desc: 'High urgency problem locations' },
    { id: 'gaps', label: 'Facility Shortfalls', icon: <AlertCircle className="w-4 h-4" />, desc: 'Missing facilities & capacity gaps' },
    { id: 'recommendations', label: 'Top Priority Projects', icon: <FileCheck className="w-4 h-4" />, desc: 'Ranked projects that need action' },
    { id: 'evidence', label: 'Proof & Evidence', icon: <Network className="w-4 h-4" />, desc: 'Evidence breakdown behind recommendations' },
    { id: 'scenarios', label: 'Budget Simulator', icon: <TestTube2 className="w-4 h-4" />, desc: 'Simulate budget allocations & impact' },
    { id: 'data', label: 'Submit & Explore Data', icon: <Database className="w-4 h-4" />, desc: 'Submit new signals & view datasets' },
  ];

  const handleSelectTab = (tab: NavTab) => {
    if (setActiveTab) setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-40 sticky top-0 shadow-xs">
        {/* Brand Identity & Mobile Menu Toggle */}
        <div className="flex items-center gap-3.5">
          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-950 transition cursor-pointer flex items-center justify-center shrink-0"
            title="Open Mobile Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0 font-extrabold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-950">
                CivicPulse <span className="text-indigo-600 font-extrabold">AI</span>
              </h1>
              <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                v2.0
              </span>
            </div>
          </div>
        </div>

        {/* Right Controls: Raise Complaint CTA, User Profile, Command Palette */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Raise Complaint CTA Button */}
          <button
            onClick={onOpenRaiseComplaint}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm font-extrabold transition shadow-md flex items-center gap-1.5 cursor-pointer font-sans"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Raise Complaint</span>
          </button>

          {/* User Auth Profile Button */}
          {currentUser ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 hover:bg-indigo-100 transition cursor-pointer text-xs font-mono font-extrabold"
              title="Click to manage profile or sign out"
            >
              <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                {currentUser.name[0]}
              </div>
              <span className="hidden md:inline font-extrabold">{currentUser.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer text-xs font-mono font-extrabold"
            >
              Sign In
            </button>
          )}

          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-800 hover:text-slate-950 hover:bg-slate-200 transition cursor-pointer font-extrabold"
          >
            <Command className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono text-slate-800 font-extrabold">
              ⌘K
            </kbd>
          </button>

          {/* Demo Synthetic Data Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 font-extrabold shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0 font-bold" />
            <span className="text-xs font-extrabold">DEMO DATA</span>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Navigation Overlay Modal */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col p-4 sm:p-6 overflow-y-auto text-slate-900">
          {/* Mobile Drawer Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0">
                <Compass className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  CivicPulse AI Navigation
                </span>
                <span className="text-[11px] text-slate-600">
                  Select a section to navigate
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer flex items-center gap-1 text-xs shrink-0"
            >
              <X className="w-4 h-4 text-slate-600" />
              <span className="hidden xs:inline">Close</span>
            </button>
          </div>

          {/* Navigation Items List */}
          <div className="flex-1 space-y-2 pb-6">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                      : 'bg-slate-50 text-slate-800 hover:bg-slate-100 hover:text-slate-950 border border-slate-200 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-md shrink-0 ${
                        isActive
                          ? 'bg-indigo-600/20 text-indigo-400'
                          : 'bg-[#121215] text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-100 truncate">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shrink-0 ml-2">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
            <span>CivicPulse AI v2.0</span>
            <span className="text-green-400 font-medium">● System Online</span>
          </div>
        </div>
      )}
    </>
  );
};
