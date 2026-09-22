import React from 'react';
import { ConsoleConfig } from '../types';
import { BezelMode } from '../types/bezels';
import { Sparkles, Gamepad2, Volume2, Cpu, Radio, Shield } from 'lucide-react';

interface RetroBezelOverlayProps {
  mode: BezelMode;
  consoleConfig: ConsoleConfig;
  gameTitle?: string | null;
}

export const RetroBezelOverlay: React.FC<RetroBezelOverlayProps> = ({
  mode,
  consoleConfig,
  gameTitle,
}) => {
  if (mode === 'none') return null;

  // 1. CONSOLE THEMED BEZEL
  if (mode === 'console-themed') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 flex justify-between select-none overflow-hidden">
        {/* Left Side Bezel */}
        <div className="hidden lg:flex w-24 xl:w-36 h-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/80 shadow-2xl flex-col items-center justify-between py-6 px-3 relative">
          <div className="w-full flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 text-center font-mono">
              {consoleConfig.shortName}
            </span>
          </div>

          {/* Vertical decorative vent stripes & audio grille */}
          <div className="flex flex-col gap-1.5 w-full items-center my-auto opacity-40">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="h-[2px] w-12 bg-slate-600 rounded-full" />
            ))}
          </div>

          <div className="text-center">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">
              16/32-BIT ARCH
            </span>
          </div>
        </div>

        {/* Right Side Bezel */}
        <div className="hidden lg:flex w-24 xl:w-36 h-full bg-gradient-to-l from-slate-950 via-slate-900 to-slate-950 border-l border-slate-800/80 shadow-2xl flex-col items-center justify-between py-6 px-3 relative">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[9px] font-mono font-bold text-emerald-400">POWER</span>
          </div>

          {/* Console badge & Game title */}
          <div className="my-auto flex flex-col items-center gap-3 text-center px-1">
            <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center p-2 text-indigo-400 shadow-inner">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wider">
              {consoleConfig.name}
            </div>
            {gameTitle && (
              <div className="text-[10px] text-amber-300 font-mono line-clamp-2 px-1 py-0.5 bg-amber-950/40 rounded border border-amber-500/20">
                {gameTitle}
              </div>
            )}
          </div>

          <div className="text-[9px] font-mono text-slate-500">
            60 FPS SYNC
          </div>
        </div>
      </div>
    );
  }

  // 2. ARCADE CABINET BEZEL
  if (mode === 'arcade-cabinet') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 flex justify-between select-none overflow-hidden">
        {/* Left Side Cabinet Pillar */}
        <div className="hidden lg:flex w-28 xl:w-40 h-full bg-gradient-to-r from-amber-950/90 via-slate-950 to-black border-r-2 border-amber-600/40 shadow-2xl flex-col justify-between py-5 px-3 relative">
          <div className="flex items-center gap-2 text-amber-400">
            <Radio className="w-4 h-4" />
            <span className="text-[11px] font-black tracking-widest uppercase font-mono">ARCADE</span>
          </div>

          {/* Stereo Speaker Holes Grille */}
          <div className="my-auto grid grid-cols-3 gap-2 p-3 bg-black/60 rounded-xl border border-amber-500/20">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 shadow-inner" />
            ))}
          </div>

          <div className="text-[9px] font-mono text-amber-500/70 text-center font-bold">
            INSERT COIN 1P
          </div>
        </div>

        {/* Right Side Cabinet Pillar */}
        <div className="hidden lg:flex w-28 xl:w-40 h-full bg-gradient-to-l from-amber-950/90 via-slate-950 to-black border-l-2 border-amber-600/40 shadow-2xl flex-col justify-between py-5 px-3 relative">
          <div className="flex items-center justify-end gap-2 text-amber-400">
            <Volume2 className="w-4 h-4" />
            <span className="text-[11px] font-black tracking-widest uppercase font-mono">HI-FI</span>
          </div>

          {/* Stereo Speaker Holes Grille */}
          <div className="my-auto grid grid-cols-3 gap-2 p-3 bg-black/60 rounded-xl border border-amber-500/20">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700 shadow-inner" />
            ))}
          </div>

          <div className="text-[9px] font-mono text-amber-500/70 text-center font-bold">
            CREDITS: 09
          </div>
        </div>
      </div>
    );
  }

  // 3. AMBIENT GLOW / CINE AMBILIGHT
  if (mode === 'ambient-glow') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden">
        {/* Soft Dynamic Lighting Halo around edges */}
        <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/15 via-transparent to-indigo-500/15 animate-pulse" />
        <div className="absolute -inset-2 bg-gradient-to-b from-amber-500/10 via-transparent to-purple-500/15" />
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(99,102,241,0.25)]" />
      </div>
    );
  }

  // 4. CLASSIC 90S CRT DESKTOP MONITOR BEZEL
  if (mode === 'crt-monitor') {
    return (
      <div className="absolute inset-0 pointer-events-none z-10 flex justify-between select-none overflow-hidden">
        {/* Left plastic casing */}
        <div className="hidden lg:flex w-20 xl:w-32 h-full bg-[#1c1d22] border-r border-[#31343c] shadow-2xl flex-col justify-between py-6 px-3">
          <div className="flex flex-col gap-1 opacity-50">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-1 bg-[#2e313a] rounded-sm" />
            ))}
          </div>
          <div className="text-[9px] font-mono text-slate-400 text-center font-bold tracking-widest">
            RGB MULTISYNC
          </div>
        </div>

        {/* Right plastic casing with power and buttons */}
        <div className="hidden lg:flex w-20 xl:w-32 h-full bg-[#1c1d22] border-l border-[#31343c] shadow-2xl flex-col justify-between py-6 px-3">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-[8px] font-mono text-slate-400">ON</span>
          </div>

          <div className="flex flex-col gap-2 items-center my-auto">
            <div className="w-5 h-2 bg-[#2d3038] rounded-sm border border-[#444854]" />
            <div className="w-5 h-2 bg-[#2d3038] rounded-sm border border-[#444854]" />
            <div className="w-5 h-2 bg-[#2d3038] rounded-sm border border-[#444854]" />
          </div>

          <div className="text-[8px] font-mono text-slate-500 text-center">
            0.24mm DOT PITCH
          </div>
        </div>
      </div>
    );
  }

  return null;
};
