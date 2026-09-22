import React from 'react';
import { VideoShaderFilter, VIDEO_FILTERS } from '../types/filters';
import { Tv, Sparkles, Check, Sliders, Eye } from 'lucide-react';

interface VideoFilterSelectorProps {
  currentFilter: VideoShaderFilter;
  onSelectFilter: (filter: VideoShaderFilter) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const VideoFilterSelector: React.FC<VideoFilterSelectorProps> = ({
  currentFilter,
  onSelectFilter,
  isOpen,
  onToggle,
}) => {
  const activePreset = VIDEO_FILTERS.find((f) => f.id === currentFilter) || VIDEO_FILTERS[0];

  return (
    <div className="relative inline-block text-left">
      {/* Trigger button */}
      <button
        type="button"
        id="video-filters-menu-btn"
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
          currentFilter !== 'none'
            ? 'bg-cyan-950/70 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
        }`}
        title="Configuración de Filtros de Video y Shaders CRT"
      >
        <Tv className="w-3.5 h-3.5 text-cyan-400" />
        <span>Filtro: {activePreset.name}</span>
        {currentFilter !== 'none' && (
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <>
          {/* Backdrop overlay for closing */}
          <div className="fixed inset-0 z-40" onClick={onToggle} />

          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-semibold text-xs sm:text-sm">
                <Tv className="w-4 h-4 text-cyan-400" />
                <span>Filtros Visuales & Shaders CRT</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
                GPU Shader
              </span>
            </div>

            {/* List of Filters */}
            <div className="p-2 space-y-1.5 max-h-[380px] overflow-y-auto">
              {VIDEO_FILTERS.map((preset) => {
                const isSelected = currentFilter === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onSelectFilter(preset.id);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/50 border-cyan-500/50 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                        isSelected
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {isSelected ? (
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <Tv className="w-4 h-4 opacity-70" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {preset.id === 'none' ? 'Default' : 'Shader'}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-300 mt-0.5">
                        {preset.tagline}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                        {preset.description}
                      </p>
                      <div className="mt-1.5 text-[10px] text-indigo-300/80 font-mono flex items-center gap-1">
                        <span>Recomendado:</span>
                        <span className="text-slate-300">{preset.recommendedFor}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer tip */}
            <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>El filtro se aplica sin caída de FPS en tiempo real.</span>
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
