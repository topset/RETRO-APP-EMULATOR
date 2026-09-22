import React, { useState, useEffect } from 'react';
import { SaveStateRecord, deleteSaveState } from '../utils/saveStateManager';
import { getPlaytimeSeconds, formatPlaytime } from '../utils/playtimeManager';
import { CONSOLES } from '../data/consoles';
import { Save, Trash2, Clock, HardDrive, Filter, FolderOpen, Gamepad2 } from 'lucide-react';

const DB_NAME = 'RetroEmulatorSaveDB';
const STORE_NAME = 'save_states';
const DB_VERSION = 1;

interface GlobalSaveManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchGameWithSave?: (consoleId: string, gameName: string) => void;
}

export const GlobalSaveManagerModal: React.FC<GlobalSaveManagerModalProps> = ({
  isOpen,
  onClose,
  onLaunchGameWithSave,
}) => {
  const [allSaves, setAllSaves] = useState<SaveStateRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsoleFilter, setSelectedConsoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllSaves = async () => {
    setLoading(true);
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onsuccess = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          setAllSaves([]);
          setLoading(false);
          return;
        }
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getAllReq = store.getAll();
        getAllReq.onsuccess = () => {
          const list: SaveStateRecord[] = getAllReq.result || [];
          setAllSaves(list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
          setLoading(false);
        };
        getAllReq.onerror = () => {
          setAllSaves([]);
          setLoading(false);
        };
      };
      req.onerror = () => {
        setAllSaves([]);
        setLoading(false);
      };
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAllSaves();
    }
  }, [isOpen]);

  const handleDelete = async (id: string) => {
    await deleteSaveState(id);
    await fetchAllSaves();
  };

  const filtered = allSaves.filter((item) => {
    const matchesConsole = selectedConsoleFilter === 'all' || item.consoleId === selectedConsoleFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      item.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesConsole && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Save className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Gestor Universal de Partidas Guardadas</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                  {allSaves.length} Guardadas
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Controla y administra todos tus Save States de SNES, Sega Genesis, GBA, PSX y Nintendo 64.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedConsoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedConsoleFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Todas las consolas
            </button>
            {CONSOLES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedConsoleFilter(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedConsoleFilter === c.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {c.shortName}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por juego o nota..."
              className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs">Cargando partidas...</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center">
              <HardDrive className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-sm font-semibold text-slate-300">No hay partidas guardadas</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Cuando estés jugando a cualquier consola, haz clic en el botón <strong>"Guardar / Cargar Partida"</strong> en la barra superior para registrar tu progreso.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((save) => {
                const conf = CONSOLES.find((c) => c.id === save.consoleId);
                return (
                  <div
                    key={save.id}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 font-mono font-bold flex flex-col items-center justify-center text-xs shrink-0">
                        <span className="text-[9px] text-indigo-400">SLOT</span>
                        <span>#{save.slot}</span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">
                            {save.gameTitle}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                              conf?.badgeBg || 'bg-slate-800 text-slate-400 border-slate-700'
                            }`}
                          >
                            {conf?.shortName || save.consoleId.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 font-mono flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="text-slate-300">{save.notes || `Ranura #${save.slot}`}</span>
                          <span>•</span>
                          <span>{save.formattedDate}</span>
                          <span>•</span>
                          <span className="text-amber-300/90 inline-flex items-center gap-1 font-sans text-[11px] bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                            <Clock className="w-3 h-3 text-amber-400" />
                            {formatPlaytime(getPlaytimeSeconds(save.consoleId, save.gameTitle))} jugados
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(save.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 border border-slate-700 transition-colors"
                        title="Eliminar partida guardada"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>Almacenamiento persistente en navegador (IndexedDB)</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors border border-slate-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
