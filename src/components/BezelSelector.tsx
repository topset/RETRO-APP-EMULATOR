import React from 'react';
import { BezelMode, BEZEL_PRESETS } from '../types/bezels';
import { Film, Check } from 'lucide-react';

interface BezelSelectorProps {
  currentMode: BezelMode;
  onSelectMode: (mode: BezelMode) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const BezelSelector: React.FC<BezelSelectorProps> = ({
  currentMode,
  onSelectMode,
  isOpen,
  onToggle,
}) => {
  const activePreset = BEZEL_PRESETS.find((b) => b.id === currentMode) || BEZEL_PRESETS[0];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        id="bezel-mode-btn"
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
          currentMode !== 'none'
            ? 'bg-purple-950/70 border-purple-500/50 text-purple-300 shadow-md shadow-purple-500/10'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
        }`}
        title="Marcos Retro (Bezels) y Modo Pantalla de Cine"
      >
        <Film className="w-3.5 h-3.5 text-purple-400" />
        <span>Marco: {activePreset.name}</span>
        {currentMode !== 'none' && (
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                <Film className="w-4 h-4 text-purple-400" />
                <span>Marcos Retro (Bezels) & Cine</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                Modo 4:3 / 16:9
              </span>
            </div>

            <div className="p-2 space-y-1.5 max-h-[380px] overflow-y-auto">
              {BEZEL_PRESETS.map((preset) => {
                const isSelected = currentMode === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => onSelectMode(preset.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-950/50 border-purple-500/50 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <Film className="w-4 h-4 opacity-70" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-white'}`}>
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {preset.id === 'none' ? 'Raw' : 'Bezel'}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-300 mt-0.5">
                        {preset.tagline}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Ajusta las franjas laterales en pantallas anchas.</span>
              <button
                onClick={onToggle}
                className="text-xs font-semibold text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Listo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
