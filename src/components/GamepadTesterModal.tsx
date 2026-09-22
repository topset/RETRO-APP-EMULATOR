import React, { useState } from 'react';
import { useGamepad, GamepadInfo } from '../hooks/useGamepad';
import {
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Activity,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const STANDARD_BUTTON_NAMES = [
  'A / Cruz (X)', // 0
  'B / Círculo (O)', // 1
  'X / Cuadrado (□)', // 2
  'Y / Triángulo (Δ)', // 3
  'LB / L1 (Gatillo Sup Izq)', // 4
  'RB / R1 (Gatillo Sup Der)', // 5
  'LT / L2 (Gatillo Analógico Izq)', // 6
  'RT / R2 (Gatillo Analógico Der)', // 7
  'Select / Share / Back', // 8
  'Start / Options / Menu', // 9
  'L3 (Click Stick Izq)', // 10
  'R3 (Click Stick Der)', // 11
  'D-Pad Arriba', // 12
  'D-Pad Abajo', // 13
  'D-Pad Izquierda', // 14
  'D-Pad Derecha', // 15
  'Home / Guía Xbox / PS', // 16
];

export const GamepadTesterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { gamepads, activeGamepad } = useGamepad();
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  if (!isOpen) return null;

  const currentGp = gamepads[selectedIdx] || activeGamepad;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Diagnóstico y Soporte de Joysticks</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Universal Plug & Play
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Compatible con Xbox (Series/One/360), PlayStation (PS5/PS4/PS3), Switch Pro, 8BitDo y USBs genéricos.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {/* Status Banner */}
          {gamepads.length > 0 ? (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-emerald-300">
                  {gamepads.length} Joystick(s) detectado(s) y listo(s) para jugar
                </div>
                <div className="text-xs text-emerald-400/90 mt-0.5">
                  El emulador (Snes9x, Genesis Plus GX, VBA, DuckStation, Project64) reconoce automáticamente este mando mediante la API estándar W3C Gamepad.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-amber-300">No se detectó ningún mando activo</div>
                <div className="text-xs text-amber-400/90 mt-1 space-y-1">
                  <p>• Conecta tu mando por cable USB o emparéjalo por Bluetooth a tu PC.</p>
                  <p>• <strong>Importante:</strong> Presiona cualquier botón en el mando para que el navegador lo despierte por seguridad.</p>
                </div>
              </div>
            </div>
          )}

          {/* Active Gamepad Viewer */}
          {currentGp && (
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="text-xs text-slate-400">Controlador Reconocido:</div>
                  <div className="font-bold text-white text-base">{currentGp.vendorName}</div>
                  <div className="text-xs font-mono text-slate-400 truncate max-w-md">{currentGp.id}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 font-mono text-indigo-400">
                    Mapeo: {currentGp.mapping || 'Estándar'}
                  </span>
                </div>
              </div>

              {/* Real-time Buttons Grid */}
              <div>
                <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Monitoreo en tiempo real (Presiona los botones para probarlos):</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currentGp.buttons.slice(0, 16).map((btn, bIdx) => {
                    const label = STANDARD_BUTTON_NAMES[bIdx] || `Botón ${bIdx}`;
                    return (
                      <div
                        key={bIdx}
                        className={`px-3 py-2 rounded-lg border text-xs font-mono flex items-center justify-between transition-all ${
                          btn.pressed
                            ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20 scale-[1.03]'
                            : 'bg-slate-900/90 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="truncate pr-1 text-[11px] font-sans">{label}</span>
                        <span className="font-bold">{btn.pressed ? 'ON' : '0'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Joysticks / Analog Sticks */}
              {currentGp.axes.length >= 2 && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Ejes Analógicos (Sticks L y R):</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {currentGp.axes.map((val, aIdx) => (
                      <div
                        key={aIdx}
                        className="bg-slate-900 border border-slate-800 p-2 rounded-lg text-xs"
                      >
                        <div className="text-slate-400 text-[10px]">Eje {aIdx}</div>
                        <div className="font-mono font-bold text-slate-200">
                          {val > 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
                        </div>
                        {/* Visual bar */}
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-indigo-500 h-full transition-all"
                            style={{ width: `${Math.min(100, Math.max(0, (val + 1) * 50))}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compatibility List */}
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Soporte nativo garantizado para:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>Xbox:</strong> Series X|S, Xbox One, Xbox 360 (Inalámbrico y USB)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>PlayStation:</strong> PS5 DualSense, PS4 DualShock 4, PS3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>Nintendo:</strong> Switch Pro Controller, Joy-Cons emparejados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span><strong>Retro & Terceros:</strong> 8BitDo, Logitech F310/F710, Mandos USB SNES/N64</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-colors"
          >
            Entendido, volver a la app
          </button>
        </div>
      </div>
    </div>
  );
};
