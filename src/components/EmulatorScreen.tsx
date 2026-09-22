import React, { useState, useRef, useEffect } from 'react';
import { ConsoleConfig, RomItem } from '../types';
import { VideoShaderFilter } from '../types/filters';
import { BezelMode } from '../types/bezels';
import { JoystickRenderer } from './JoystickRenderer';
import { SaveStateManagerModal } from './SaveStateManagerModal';
import { VideoFilterSelector } from './VideoFilterSelector';
import { BezelSelector } from './BezelSelector';
import { RetroBezelOverlay } from './RetroBezelOverlay';
import { CheatManagerModal } from './CheatManagerModal';
import { CheatItem } from '../types/cheats';
import { addPlaytime, getPlaytimeSeconds, formatPlaytime } from '../utils/playtimeManager';
import { ArrowLeft, Play, Upload, HelpCircle, Gamepad2, Maximize2, RefreshCw, Save, Clock, Tv, Film, Volume2, VolumeX, FastForward, Zap } from 'lucide-react';

interface EmulatorScreenProps {
  consoleConfig: ConsoleConfig;
  initialRom?: RomItem | null;
  onBack: () => void;
}

export const EmulatorScreen: React.FC<EmulatorScreenProps> = ({
  consoleConfig,
  initialRom,
  onBack,
}) => {
  const [romUrl, setRomUrl] = useState<string | null>(initialRom ? (initialRom.blobUrl || initialRom.url) : null);
  const [romName, setRomName] = useState<string | null>(initialRom ? initialRom.name : null);
  const [showControls, setShowControls] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [emulatorReady, setEmulatorReady] = useState(!!initialRom);
  const [instanceKey, setInstanceKey] = useState(0);
  const [videoFilter, setVideoFilter] = useState<VideoShaderFilter>(() => {
    // Default to CRT Trinitron for 16/32 bit home consoles, Dot Matrix for GBA, or Raw
    if (consoleConfig.id === 'snes' || consoleConfig.id === 'sega' || consoleConfig.id === 'psx') {
      return 'crt-trinitron';
    } else if (consoleConfig.id === 'gba') {
      return 'gameboy-dot';
    }
    return 'none';
  });
  const [showFilterDropdown, setShowFilterDropdown] = useState<boolean>(false);
  const [bezelMode, setBezelMode] = useState<BezelMode>('console-themed');
  const [showBezelDropdown, setShowBezelDropdown] = useState<boolean>(false);
  const [showCheatModal, setShowCheatModal] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFastForward, setIsFastForward] = useState<boolean>(false);
  const [currentPlaytimeSeconds, setCurrentPlaytimeSeconds] = useState<number>(() => {
    return initialRom?.name ? getPlaytimeSeconds(consoleConfig.id, initialRom.name) : 0;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Apply cheat code to running emulator
  const handleApplyCheat = (cheat: CheatItem) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'APPLY_CHEAT',
          cheat: {
            id: cheat.id,
            code: cheat.code,
            title: cheat.title,
            type: cheat.type,
            enabled: cheat.enabled,
          },
        },
        '*'
      );
    } catch (e) {
      console.warn('Could not post cheat message to iframe:', e);
    }
  };

  // Send volume commands to the emulator iframe
  const updateIframeVolume = (newVol: number, muted: boolean) => {
    try {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'SET_VOLUME',
          volume: muted ? 0 : newVol,
        },
        '*'
      );
    } catch (e) {
      console.warn('Could not post volume message to iframe:', e);
    }
  };

  // Toggle or set fast forward in emulator
  const toggleFastForward = () => {
    const nextState = !isFastForward;
    setIsFastForward(nextState);
    try {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'SET_FAST_FORWARD',
          enabled: nextState,
          speed: nextState ? 2.5 : 1.0,
        },
        '*'
      );
    } catch (e) {
      console.warn('Could not post fast forward message to iframe:', e);
    }
  };

  const handleVolumeChange = (newVal: number) => {
    setVolume(newVal);
    if (isMuted && newVal > 0) {
      setIsMuted(false);
    }
    updateIframeVolume(newVal, false);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    updateIframeVolume(volume, nextMuted);
  };

  // Accumulate playtime every 5 seconds while emulator is running with an active ROM
  useEffect(() => {
    if (!romName || !emulatorReady) return;

    // Refresh current total
    setCurrentPlaytimeSeconds(getPlaytimeSeconds(consoleConfig.id, romName));

    const interval = setInterval(() => {
      // Record 5 seconds
      const newTotal = addPlaytime(consoleConfig.id, romName, 5);
      setCurrentPlaytimeSeconds(newTotal);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [consoleConfig.id, romName, emulatorReady]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRomUrl(url);
      setRomName(file.name);
      setEmulatorReady(true);
      setInstanceKey((prev) => prev + 1);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const url = URL.createObjectURL(file);
      setRomUrl(url);
      setRomName(file.name);
      setEmulatorReady(true);
      setInstanceKey((prev) => prev + 1);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (romUrl) {
        URL.revokeObjectURL(romUrl);
      }
    };
  }, [romUrl]);

  // Generate iframe source HTML for EmulatorJS
  const generateEmulatorIframeHtml = () => {
    const core = consoleConfig.coreKey;
    const gameUrl = romUrl ? romUrl : '';

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>${consoleConfig.name} - ${consoleConfig.emulatorName}</title>
        <style>
          * { box-sizing: border-box; }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: #030712;
            color: #f3f4f6;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #game {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loader-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #090d16;
            z-index: 10;
            text-align: center;
            padding: 20px;
          }
          .spinner {
            width: 44px;
            height: 44px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left-color: ${consoleConfig.accentColor};
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .tag {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
            color: ${consoleConfig.accentColor};
            font-weight: 600;
          }
          .hint {
            color: #9ca3af;
            font-size: 13px;
            max-width: 380px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div id="loader" class="loader-container">
          <div class="spinner"></div>
          <div class="tag">MOTOR: ${consoleConfig.emulatorName.toUpperCase()}</div>
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">Iniciando emulador de ${consoleConfig.shortName}...</h3>
          <p class="hint">Cargando núcleo WebAssembly y configurando el controlador ${consoleConfig.shortName}.</p>
        </div>

        <div id="game"></div>

        <script>
          window.EJS_player = '#game';
          window.EJS_core = '${core}';
          window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
          window.EJS_startOnLoaded = true;
          window.EJS_threads = true;
          window.EJS_volume = 1;
          window.EJS_gamepad = true; // Auto-detect any USB / Bluetooth gamepad
          ${gameUrl ? `window.EJS_gameUrl = '${gameUrl}';` : ''}
          window.EJS_onGameStart = function() {
            var loader = document.getElementById('loader');
            if (loader) loader.style.display = 'none';
          };

          // Listen for parent messages (Volume, Mute, Fast Forward)
          window.addEventListener('message', function(event) {
            if (!event.data) return;

            if (event.data.type === 'SET_VOLUME') {
              var vol = typeof event.data.volume === 'number' ? event.data.volume : 1;
              if (window.EJS_emulator && typeof window.EJS_emulator.setVolume === 'function') {
                window.EJS_emulator.setVolume(vol);
              }
              // Also adjust audio element or WebAudio context directly if present
              var audios = document.querySelectorAll('audio, video');
              for (var i = 0; i < audios.length; i++) {
                audios[i].volume = Math.max(0, Math.min(1, vol));
              }
            }

            if (event.data.type === 'SET_FAST_FORWARD') {
              var enabled = !!event.data.enabled;
              var speed = event.data.speed || (enabled ? 2.5 : 1.0);
              if (window.EJS_emulator) {
                if (typeof window.EJS_emulator.setSpeed === 'function') {
                  window.EJS_emulator.setSpeed(speed);
                } else if (typeof window.EJS_emulator.fastForward === 'function') {
                  window.EJS_emulator.fastForward(enabled);
                }
              }
            }

            if (event.data.type === 'APPLY_CHEAT') {
              var cheat = event.data.cheat;
              if (window.EJS_emulator && cheat) {
                // Try EmulatorJS cheat injection APIs
                try {
                  if (typeof window.EJS_emulator.setCheat === 'function') {
                    window.EJS_emulator.setCheat(cheat.id, cheat.code, cheat.enabled);
                  } else if (typeof window.EJS_emulator.addCheat === 'function') {
                    window.EJS_emulator.addCheat(cheat.code, cheat.enabled);
                  } else if (window.EJS_emulator.cheats && typeof window.EJS_emulator.cheats.set === 'function') {
                    window.EJS_emulator.cheats.set(cheat.code, cheat.enabled);
                  }
                } catch (err) {
                  console.warn('Cheat dispatch inside emulator core:', err);
                }
              }
            }
          });

          // Hide loader after maximum wait timeout in case user is presented with emulator menu
          setTimeout(function() {
            var loader = document.getElementById('loader');
            if (loader) {
              loader.style.opacity = '0';
              loader.style.transition = 'opacity 0.5s ease';
              setTimeout(function() { loader.style.display = 'none'; }, 500);
            }
          }, 3500);
        </script>
        <script src="https://cdn.emulatorjs.org/stable/data/loader.js"></script>
      </body>
      </html>
    `;
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="back-to-joysticks-btn"
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-sm font-medium border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Joysticks</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100 text-base sm:text-lg">
                  {consoleConfig.name}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${consoleConfig.badgeBg}`}
                >
                  {consoleConfig.emulatorName}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Emulador ejecutándose en el navegador mediante núcleo WebAssembly
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Fast Forward Mode Button */}
            <button
              id="fast-forward-btn"
              onClick={toggleFastForward}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isFastForward
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isFastForward ? 'Desactivar Avance Rápido (2.5x)' : 'Activar Avance Rápido (Fast-Forward 2.5x)'}
            >
              <FastForward className={`w-3.5 h-3.5 ${isFastForward ? 'fill-current' : ''}`} />
              <span>{isFastForward ? '2.5x Rápido' : 'Avance Rápido'}</span>
            </button>

            {/* Volume Control and Quick Mute Button */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300">
              <button
                id="toggle-mute-btn"
                onClick={toggleMute}
                className="hover:text-white transition-colors"
                title={isMuted ? 'Desmutear audio' : 'Silenciar audio (Mute)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                )}
              </button>

              <input
                id="volume-slider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-14 sm:w-20 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                title={`Volumen: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
              />
              <span className="text-[10px] font-mono text-slate-400 w-7 text-right">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Bezel / Retro Frames Menu */}
            <BezelSelector
              currentMode={bezelMode}
              onSelectMode={(newMode) => {
                setBezelMode(newMode);
                setShowBezelDropdown(false);
              }}
              isOpen={showBezelDropdown}
              onToggle={() => setShowBezelDropdown(!showBezelDropdown)}
            />

            {/* Video Filters and CRT Shaders Menu */}
            <VideoFilterSelector
              currentFilter={videoFilter}
              onSelectFilter={(newFilter) => {
                setVideoFilter(newFilter);
                setShowFilterDropdown(false);
              }}
              isOpen={showFilterDropdown}
              onToggle={() => setShowFilterDropdown(!showFilterDropdown)}
            />

            {romName && emulatorReady && (
              <div
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800/90 border border-slate-700 text-amber-300"
                title="Tiempo total jugado en este juego"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Tiempo Jugado: {formatPlaytime(currentPlaytimeSeconds)}</span>
              </div>
            )}

            <button
              id="cheats-btn"
              onClick={() => setShowCheatModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white border border-amber-500 shadow-md shadow-amber-600/20 transition-all hover:scale-[1.02]"
              title="Gestor de Trucos (GameShark, Game Genie, Action Replay)"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Trucos</span>
            </button>

            <button
              id="save-states-btn"
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              title="Guardar y Cargar Partidas (Save States)"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar / Cargar Partida</span>
            </button>

            <button
              id="toggle-controls-btn"
              onClick={() => setShowControls(!showControls)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                showControls
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showControls ? 'Ocultar Controles' : 'Ver Controles'}</span>
            </button>

            <button
              id="fullscreen-toggle-btn"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Pantalla Completa"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        {/* Controls Info Banner (Collapsible) */}
        {showControls && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 transition-all animate-fadeIn">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Mini Joystick Reference */}
              <div className="w-48 sm:w-60 flex-shrink-0 flex flex-col items-center">
                <span className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                  Mando {consoleConfig.shortName}
                </span>
                <JoystickRenderer consoleId={consoleConfig.id} className="w-full" isInteractive={false} />
              </div>

              {/* Mappings */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full text-xs">
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-400 font-medium mb-1">Cruceta / Dirección</div>
                  <div className="text-slate-200 font-mono font-medium">{consoleConfig.controls.dpad}</div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                  <div className="text-slate-400 font-medium mb-1">Start & Select</div>
                  <div className="text-slate-200 font-mono font-medium">
                    {consoleConfig.controls.startSelect}
                  </div>
                </div>

                {consoleConfig.controls.triggers && (
                  <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                    <div className="text-slate-400 font-medium mb-1">Gatillos L / R</div>
                    <div className="text-slate-200 font-mono font-medium">
                      {consoleConfig.controls.triggers}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 sm:col-span-2 md:col-span-3">
                  <div className="text-slate-400 font-medium mb-2">Botones de Acción en Teclado:</div>
                  <div className="flex flex-wrap gap-2">
                    {consoleConfig.controls.actionButtons.map((btn, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: btn.color || consoleConfig.accentColor }}
                        />
                        <span className="font-bold">{btn.label}:</span>
                        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-600 text-slate-300 font-bold">
                          {btn.key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Joystick Hardware Support Banner */}
                <div className="p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/30 sm:col-span-2 md:col-span-3 flex items-center justify-between gap-3 text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Soporte para Mando Físico Activo:</strong> Conecta cualquier mando (Xbox, PS5/PS4, Switch Pro, 8BitDo o USB) y presiona cualquier botón. El emulador lo mapeará de forma nativa.
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-900/50 rounded border border-emerald-500/40 text-emerald-300 shrink-0">
                    Plug & Play
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ROM Upload / Load Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">
                {romName ? (
                  <span className="text-emerald-400 flex items-center gap-2 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ROM cargada: {romName}
                  </span>
                ) : (
                  <span>Emulador listo para ejecutar</span>
                )}
              </div>
              <div className="text-xs text-slate-400">
                Formatos soportados: {consoleConfig.romExtensions.join(', ')} o arrastra el archivo directamente.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={consoleConfig.romExtensions.join(',')}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              id="upload-rom-btn"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              <Upload className="w-4 h-4" />
              <span>Cargar ROM propia</span>
            </button>

            {romUrl && (
              <button
                onClick={() => setInstanceKey((k) => k + 1)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Reiniciar emulador"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* The Emulator Viewport Container */}
        <div
          ref={containerRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative flex-1 min-h-[480px] sm:min-h-[580px] w-full rounded-2xl overflow-hidden bg-black border border-slate-800 flex flex-col shadow-2xl ${
            videoFilter !== 'none' ? `retro-filter-${videoFilter}` : ''
          } ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''}`}
        >
          {/* Retro Bezel & Cinema Overlay Frame */}
          <RetroBezelOverlay
            mode={bezelMode}
            consoleConfig={consoleConfig}
            gameTitle={romName}
          />

          {/* Emulator Iframe */}
          <iframe
            ref={iframeRef}
            key={`${consoleConfig.id}-${instanceKey}`}
            id={`emulator-frame-${consoleConfig.id}`}
            title={`${consoleConfig.name} - ${consoleConfig.emulatorName}`}
            srcDoc={generateEmulatorIframeHtml()}
            className="w-full h-full flex-1 border-0 bg-black"
            allow="autoplay; gamepad; fullscreen"
          />

          {/* Retro CRT Screen Glass Reflections and Bezel Shadow */}
          {videoFilter.startsWith('crt') && (
            <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_80px_rgba(0,0,0,0.85)] border border-white/5 rounded-2xl" />
          )}

          {/* Fast-Forward Active HUD Indicator */}
          {isFastForward && (
            <div className="absolute top-4 right-4 z-40 bg-amber-500/90 text-slate-950 font-black font-mono text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-lg shadow-amber-500/30 animate-pulse pointer-events-none">
              <FastForward className="w-4 h-4 fill-current" />
              <span>FAST FORWARD 2.5X</span>
            </div>
          )}

          {/* Quick Overlay when no ROM is yet provided */}
          {!romName && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-3 text-xs text-slate-300 pointer-events-auto">
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>
                Arrastra tu archivo <strong>{consoleConfig.romExtensions[0]}</strong> aquí o presiona{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="underline text-indigo-400 font-semibold hover:text-indigo-300"
                >
                  Cargar ROM
                </button>{' '}
                para jugar.
              </span>
            </div>
          )}
        </div>
      </main>

      {/* Save States Manager Modal */}
      <SaveStateManagerModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        consoleId={consoleConfig.id}
        gameTitle={romName || consoleConfig.name}
      />

      {/* Cheat & GameShark Manager Modal */}
      <CheatManagerModal
        isOpen={showCheatModal}
        onClose={() => setShowCheatModal(false)}
        consoleConfig={consoleConfig}
        gameName={romName}
        onApplyCheat={handleApplyCheat}
      />
    </div>
  );
};
