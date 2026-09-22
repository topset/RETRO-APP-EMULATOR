import React, { useState, useEffect } from 'react';
import {
  SaveStateRecord,
  getSaveStatesForGame,
  saveGameState,
  deleteSaveState,
} from '../utils/saveStateManager';
import {
  Save,
  Download,
  Trash2,
  Clock,
  CheckCircle2,
  HardDrive,
  Info,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface SaveStateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  consoleId: string;
  gameTitle: string;
  onTriggerIframeSave?: () => void;
  onTriggerIframeLoad?: () => void;
}

export const SaveStateManagerModal: React.FC<SaveStateManagerModalProps> = ({
  isOpen,
  onClose,
  consoleId,
  gameTitle,
  onTriggerIframeSave,
  onTriggerIframeLoad,
}) => {
  const [saves, setSaves] = useState<SaveStateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');
  const [notification, setNotification] = useState<string | null>(null);

  const loadSaves = async () => {
    setLoading(true);
    const data = await getSaveStatesForGame(consoleId, gameTitle);
    setSaves(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadSaves();
    }
  }, [isOpen, consoleId, gameTitle]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveNewState = async () => {
    try {
      if (onTriggerIframeSave) {
        onTriggerIframeSave();
      }
      await saveGameState(consoleId, gameTitle, selectedSlot, notes);
      showNotification(`¡Partida guardada con éxito en Ranura #${selectedSlot}!`);
      setNotes('');
      await loadSaves();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadState = (slot: number) => {
    if (onTriggerIframeLoad) {
      onTriggerIframeLoad();
    }
    showNotification(`Cargando estado de la Ranura #${slot}...`);
  };

  const handleDelete = async (id: string) => {
    await deleteSaveState(id);
    showNotification('Punto de guardado eliminado.');
    await loadSaves();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Gestor de Partidas Guardadas</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Save States
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Juego actual: <strong className="text-slate-200">{gameTitle || 'Juego Retro'}</strong> ({consoleId.toUpperCase()})
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-sm">
          {notification && (
            <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {/* Create New Save Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Guardar Estado Actual (Quick Save)</span>
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSlot(s)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                      selectedSlot === s
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    #{s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Nota opcional (ej: Jefe final, Nivel 3, Antes de saltar)..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSaveNewState}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all shrink-0"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Estado</span>
              </button>
            </div>
          </div>

          {/* Saved States List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Historial de Puntos Guardados ({saves.length})</span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">Guardado local seguro (IndexedDB)</span>
            </div>

            {loading ? (
              <div className="text-center py-6 text-slate-500 text-xs">Cargando partidas...</div>
            ) : saves.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-center text-slate-400 text-xs">
                No hay puntos de guardado registrados para este juego aún.
                <p className="mt-1 text-slate-500 text-[11px]">
                  Presiona <strong>"Guardar Estado"</strong> arriba en cualquier momento para capturar tu progreso exacto.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {saves.map((save) => (
                  <div
                    key={save.id}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono font-bold flex items-center justify-center text-xs shrink-0">
                        #{save.slot}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-white truncate">
                          {save.notes || `Ranura #${save.slot}`}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                          <span>{save.formattedDate}</span>
                          <span>•</span>
                          <span className="text-slate-500">{save.consoleId.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleLoadState(save.slot)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 transition-colors shadow-sm"
                        title="Cargar partida"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Cargar</span>
                      </button>
                      <button
                        onClick={() => handleDelete(save.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 transition-colors"
                        title="Eliminar punto de guardado"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts Hint */}
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Atajos rápidos en el emulador:</span>
            </div>
            <p>
              • También puedes usar la barra inferior nativa de EmulatorJS tocando el icono de <strong>Disquete (Save State)</strong> o los atajos de teclado configurados.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
