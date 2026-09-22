import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CONSOLES } from './data/consoles';
import { ConsoleConfig, ConsoleId, RomItem } from './types';
import { JoystickRenderer } from './components/JoystickRenderer';
import { EmulatorScreen } from './components/EmulatorScreen';
import { RomListModal } from './components/RomListModal';
import { GamepadTesterModal } from './components/GamepadTesterModal';
import { GlobalSaveManagerModal } from './components/GlobalSaveManagerModal';
import { useGamepad } from './hooks/useGamepad';
import { Play, Sparkles, Cpu, FolderOpen, Gamepad2, Save } from 'lucide-react';

export default function App() {
  const [selectedConsole, setSelectedConsole] = useState<ConsoleConfig | null>(null);
  const [activeRomToPlay, setActiveRomToPlay] = useState<RomItem | null>(null);
  const [isEmulatorRunning, setIsEmulatorRunning] = useState<boolean>(false);
  const [showGamepadModal, setShowGamepadModal] = useState<boolean>(false);
  const [showGlobalSavesModal, setShowGlobalSavesModal] = useState<boolean>(false);

  const { gamepads, activeGamepad, hasConnectedGamepad } = useGamepad();

  // When clicking on a console joystick: open the console's ROM list
  const handleSelectConsole = (consoleConfig: ConsoleConfig) => {
    setSelectedConsole(consoleConfig);
    setIsEmulatorRunning(false);
  };

  // When clicking "Play" on a specific ROM or launching clean
  const handleStartPlaying = (rom: RomItem | null) => {
    setActiveRomToPlay(rom);
    setIsEmulatorRunning(true);
  };

  // Back from Emulator to ROM List
  const handleBackToRomList = () => {
    setIsEmulatorRunning(false);
  };

  // Back to Main Joystick grid
  const handleBackToLauncher = () => {
    setSelectedConsole(null);
    setIsEmulatorRunning(false);
    setActiveRomToPlay(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <AnimatePresence mode="wait">
        {selectedConsole && isEmulatorRunning ? (
          <motion.div
            key="emulator-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full min-h-screen"
          >
            <EmulatorScreen
              consoleConfig={selectedConsole}
              initialRom={activeRomToPlay}
              onBack={handleBackToRomList}
            />
          </motion.div>
        ) : selectedConsole ? (
          <motion.div
            key={`rom-list-${selectedConsole.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="w-full min-h-screen"
          >
            <RomListModal
              consoleConfig={selectedConsole}
              onSelectRomToPlay={handleStartPlaying}
              onBack={handleBackToLauncher}
            />
          </motion.div>
        ) : (
          <motion.div
            key="launcher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen flex flex-col"
          >
            {/* Header */}
            <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm px-6 py-6 sm:py-8">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <Cpu className="w-5 h-5" />
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                      Lanzador de Consolas & Emuladores
                    </h1>
                  </div>
                  <p className="text-sm text-slate-400 max-w-2xl">
                    Toca cualquier mando para ver la lista de juegos de su carpeta <code className="text-indigo-400 font-mono">public/roms/[consola]</code> o ejecutar el emulador.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                  {/* Global Save States Manager Button */}
                  <button
                    onClick={() => setShowGlobalSavesModal(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold bg-indigo-950/50 border-indigo-500/40 text-indigo-300 hover:bg-indigo-900/60 hover:text-white transition-all shadow-sm"
                    title="Ver todas las partidas guardadas de todas las consolas"
                  >
                    <Save className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Gestor de Partidas</span>
                  </button>

                  {/* Gamepad Status Pill & Tester Trigger */}
                  <button
                    onClick={() => setShowGamepadModal(true)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                      hasConnectedGamepad
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50 shadow-sm shadow-emerald-500/10'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                    title="Ver estado y probar tus mandos conectados"
                  >
                    <Gamepad2 className={`w-3.5 h-3.5 ${hasConnectedGamepad ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>
                      {hasConnectedGamepad
                        ? `Joystick Conectado (${gamepads.length})`
                        : 'Conectar Joystick'}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        hasConnectedGamepad ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                      }`}
                    />
                  </button>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    Carpetas Sincronizadas
                  </span>
                </div>
              </div>
            </header>

            {/* Main Joystick Grid */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {CONSOLES.map((item, index) => (
                  <motion.div
                    key={item.id}
                    id={`console-card-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleSelectConsole(item)}
                    className="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-indigo-500/5"
                  >
                    {/* Top Console & Emulator Info */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {item.name}
                        </h2>
                        <span className="text-xs text-slate-400 font-medium">
                          {item.shortName}
                        </span>
                      </div>

                      {/* Designated Emulator Badge */}
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-semibold border ${item.badgeBg}`}
                      >
                        {item.emulatorName}
                      </span>
                    </div>

                    {/* Interactive Joystick Preview Area */}
                    <div className="my-3 py-4 px-2 flex items-center justify-center min-h-[160px] bg-slate-950/50 rounded-xl border border-slate-800/60 group-hover:border-slate-700/80 transition-colors">
                      <JoystickRenderer
                        consoleId={item.id}
                        className="w-full max-w-[280px] sm:max-w-[300px] transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>/roms/{item.folderName}/</span>
                      </span>

                      <button
                        id={`enter-emulator-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectConsole(item);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 group-hover:bg-indigo-500 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Ver Juegos</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </main>

            {/* Subtle Footer */}
            <footer className="border-t border-slate-900 px-6 py-4 text-center text-xs text-slate-500">
              SNES (Snes9x) · Sega Genesis (Genesis Plus GX) · Game Boy Advance (VisualBoyAdvance) · PSX (DuckStation) · N64 (Project64)
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Universal Gamepad Diagnostics and Calibration Modal */}
      <GamepadTesterModal
        isOpen={showGamepadModal}
        onClose={() => setShowGamepadModal(false)}
      />

      {/* Global Save States Manager across all consoles */}
      <GlobalSaveManagerModal
        isOpen={showGlobalSavesModal}
        onClose={() => setShowGlobalSavesModal(false)}
      />
    </div>
  );
}
