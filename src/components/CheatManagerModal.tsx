import React, { useState, useEffect } from 'react';
import { ConsoleConfig } from '../types';
import { CheatItem, CheatType } from '../types/cheats';
import {
  getStoredCheats,
  saveCheatItem,
  toggleCheatItem,
  deleteCustomCheat,
} from '../utils/cheatManager';
import {
  Sparkles,
  X,
  Plus,
  Trash2,
  Check,
  Shield,
  Zap,
  Info,
  Code2,
  Terminal,
} from 'lucide-react';

interface CheatManagerModalProps {
  consoleConfig: ConsoleConfig;
  gameName?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyCheat: (cheat: CheatItem) => void;
}

export const CheatManagerModal: React.FC<CheatManagerModalProps> = ({
  consoleConfig,
  gameName,
  isOpen,
  onClose,
  onApplyCheat,
}) => {
  const [cheats, setCheats] = useState<CheatItem[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<CheatType>('gameshark');
  const [newDesc, setNewDesc] = useState('');

  // Load cheats on open or console change
  const reloadCheats = () => {
    const list = getStoredCheats(consoleConfig.id, gameName);
    setCheats(list);
  };

  useEffect(() => {
    if (isOpen) {
      reloadCheats();
    }
  }, [isOpen, consoleConfig.id, gameName]);

  if (!isOpen) return null;

  const handleToggle = (cheat: CheatItem) => {
    const nextVal = !cheat.enabled;
    toggleCheatItem(cheat.id, nextVal);
    const updatedCheat = { ...cheat, enabled: nextVal };
    onApplyCheat(updatedCheat);
    reloadCheats();
  };

  const handleCreateCheat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCode.trim()) return;

    const newCheat: CheatItem = {
      id: `custom-${Date.now()}`,
      consoleId: consoleConfig.id,
      gameName: gameName || 'Personalizado',
      title: newTitle.trim(),
      code: newCode.trim().toUpperCase(),
      type: newType,
      description: newDesc.trim() || undefined,
      enabled: true,
      isPreset: false,
    };

    saveCheatItem(newCheat);
    onApplyCheat(newCheat);
    setNewTitle('');
    setNewCode('');
    setNewDesc('');
    setIsAddingNew(false);
    reloadCheats();
  };

  const handleDelete = (id: string) => {
    deleteCustomCheat(id);
    reloadCheats();
  };

  const activeCheatsCount = cheats.filter((c) => c.enabled).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Gestor de Trucos & Cheats</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold">
                  GameShark / Game Genie / Action Replay
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {consoleConfig.name} {gameName ? `• ${gameName}` : ''} ({activeCheatsCount} activos)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action button bar */}
        <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Los códigos se inyectan en tiempo real en la memoria RAM del juego.</span>
          </div>

          {!isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Código Personalizado</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* New Cheat Form */}
          {isAddingNew && (
            <form
              onSubmit={handleCreateCheat}
              className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 shadow-lg space-y-3 animate-in fade-in duration-150"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  Nuevo Código de Truco
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Título / Efecto:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Vidas Infinitas, Invencible..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Tipo de Código:
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CheatType)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="gameshark">GameShark</option>
                    <option value="game-genie">Game Genie</option>
                    <option value="action-replay">Action Replay</option>
                    <option value="raw">Dirección RAM Raw</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Código Hexadecimal / Alfanumérico:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 7E149020 o C264-64DD"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs focus:outline-none focus:border-indigo-500 uppercase"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Descripción opcional:
                </label>
                <input
                  type="text"
                  placeholder="Instrucciones o detalles de funcionamiento..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20"
                >
                  Guardar y Activar Truco
                </button>
              </div>
            </form>
          )}

          {/* List of Cheats */}
          {cheats.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Zap className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">No hay trucos registrados todavía</p>
              <p className="text-xs text-slate-500 mt-1">
                Haz clic en "Agregar Código Personalizado" para añadir tus códigos de GameShark o Game Genie.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {cheats.map((cheat) => {
                const badgeColor =
                  cheat.type === 'gameshark'
                    ? 'bg-purple-950/60 text-purple-300 border-purple-500/30'
                    : cheat.type === 'game-genie'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30';

                return (
                  <div
                    key={cheat.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      cheat.enabled
                        ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/5'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {cheat.title}
                        </span>
                        <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${badgeColor}`}>
                          {cheat.type}
                        </span>
                        {cheat.isPreset && (
                          <span className="text-[10px] text-slate-500 font-sans">
                            (Preset Clásico)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 tracking-wider">
                          {cheat.code}
                        </code>
                        {cheat.description && (
                          <span className="text-[11px] text-slate-400 truncate">
                            {cheat.description}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle On/Off Switch */}
                      <button
                        onClick={() => handleToggle(cheat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          cheat.enabled
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                        }`}
                      >
                        {cheat.enabled ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Activado</span>
                          </>
                        ) : (
                          <span>Inactivo</span>
                        )}
                      </button>

                      {/* Delete button for user custom cheats */}
                      {!cheat.isPreset && (
                        <button
                          onClick={() => handleDelete(cheat.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Eliminar truco personalizado"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Compatible con códigos universales para {consoleConfig.name}.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-md shadow-indigo-600/20"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
