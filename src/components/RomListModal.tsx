import React, { useState, useEffect, useRef } from 'react';
import { ConsoleConfig, RomItem } from '../types';
import { JoystickRenderer } from './JoystickRenderer';
import { GameCover } from './GameCover';
import { getPlaytimeSeconds, formatPlaytime } from '../utils/playtimeManager';
import {
  ArrowLeft,
  Play,
  FolderOpen,
  RefreshCw,
  Upload,
  HardDrive,
  CheckCircle2,
  Sparkles,
  Info,
  Image as ImageIcon,
  Clock,
  LayoutGrid,
  List,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

interface RomListModalProps {
  consoleConfig: ConsoleConfig;
  onSelectRomToPlay: (rom: RomItem | null) => void;
  onBack: () => void;
}

export const RomListModal: React.FC<RomListModalProps> = ({
  consoleConfig,
  onSelectRomToPlay,
  onBack,
}) => {
  const [roms, setRoms] = useState<RomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRom, setSelectedRom] = useState<RomItem | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'playtime' | 'size'>('name');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format bytes to human readable format
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Fetch ROMs from the server's public/roms/:consoleId folder
  const fetchRoms = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      const res = await fetch(`/api/roms/${consoleConfig.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.roms)) {
          setRoms(data.roms);
          setLastUpdated(new Date());
          if (data.roms.length > 0 && !selectedRom) {
            setSelectedRom(data.roms[0]);
          }
        }
      }
    } catch (err) {
      console.warn('Could not auto-fetch local folder ROMs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and periodic poll to detect newly placed files
  useEffect(() => {
    fetchRoms();
    const interval = setInterval(() => {
      fetchRoms(false);
    }, 4000); // Check every 4 seconds for newly added files

    return () => clearInterval(interval);
  }, [consoleConfig.id]);

  // Handle manual browser file selection as well
  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      const customRom: RomItem = {
        name: file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        fileName: file.name,
        size: file.size,
        url: blobUrl,
        blobUrl: blobUrl,
        isCustomFile: true,
      };

      setRoms((prev) => [customRom, ...prev]);
      setSelectedRom(customRom);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors text-sm font-medium border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Consolas</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white">{consoleConfig.name}</h1>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${consoleConfig.badgeBg}`}
                >
                  {consoleConfig.emulatorName}
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Directorio sincronizado: <code className="text-indigo-400 font-mono">public/roms/{consoleConfig.folderName}/</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRoms(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
              title="Comprobar si metiste nuevos juegos a la carpeta"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar Carpeta</span>
            </button>

            <button
              onClick={() => onSelectRomToPlay(null)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors"
            >
              <span>Abrir Emulador Limpio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Sync Info Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <span>Carpeta local de ROMs vinculada:</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-mono border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Auto-Sincronización Activa
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cualquier archivo que pegues en <strong className="text-slate-300">/public/roms/{consoleConfig.folderName}/</strong> aparecerá aquí automáticamente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              ref={fileInputRef}
              type="file"
              accept={consoleConfig.romExtensions.join(',')}
              onChange={handleManualUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>O arrastra / selecciona archivo</span>
            </button>
          </div>
        </div>

        {/* Content Section: ROM List & Details Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* ROMs List Column */}
          <div className="lg:col-span-7 flex flex-col bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
            {/* List Toolbar & View Controls */}
            <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-semibold text-white">
                  Juegos Disponibles ({roms.length})
                </h2>
              </div>

              {/* Controls: Search, View Mode Toggle & Sorter */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar juego..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500"
                  title="Ordenar juegos"
                >
                  <option value="name">Nombre (A-Z)</option>
                  <option value="playtime">Más Jugados</option>
                  <option value="size">Tamaño</option>
                </select>

                {/* View Mode Toggle: Grid vs List */}
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Vista en Cuadrícula (Carátulas grandes)"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Vista en Lista detallada"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* List / Grid Content Container */}
            <div className="flex-1 p-3.5 overflow-y-auto max-h-[520px]">
              {loading && roms.length === 0 ? (
                <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400 mb-2" />
                  <span className="text-sm font-medium">Escaneando carpeta /public/roms/{consoleConfig.folderName}/...</span>
                </div>
              ) : roms.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center">
                  <div className="p-3 rounded-full bg-slate-800/80 text-slate-400 mb-3">
                    <FolderOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200 mb-1">
                    No se encontraron ROMs en /public/roms/{consoleConfig.folderName}/
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed">
                    Coloca tus archivos con extensión {consoleConfig.romExtensions.join(', ')} en la carpeta 
                    <strong className="text-indigo-400 font-mono"> public/roms/{consoleConfig.folderName}/</strong> de la aplicación y se actualizará automáticamente.
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Cargar archivo desde mi PC</span>
                  </button>
                </div>
              ) : (
                (() => {
                  // Filter and sort roms
                  const filtered = roms
                    .filter((r) =>
                      !searchQuery.trim() ||
                      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      r.fileName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .sort((a, b) => {
                      if (sortBy === 'playtime') {
                        return (
                          getPlaytimeSeconds(consoleConfig.id, b.name) -
                          getPlaytimeSeconds(consoleConfig.id, a.name)
                        );
                      }
                      if (sortBy === 'size') {
                        return b.size - a.size;
                      }
                      return a.name.localeCompare(b.name);
                    });

                  if (filtered.length === 0) {
                    return (
                      <div className="py-12 text-center text-xs text-slate-400">
                        No hay juegos que coincidan con "{searchQuery}".
                      </div>
                    );
                  }

                  // Render Grid View (Box Art Cards Gallery)
                  if (viewMode === 'grid') {
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {filtered.map((rom, idx) => {
                          const isSelected = selectedRom?.fileName === rom.fileName;
                          const playtime = getPlaytimeSeconds(consoleConfig.id, rom.name);
                          return (
                            <div
                              key={rom.fileName + idx}
                              onClick={() => setSelectedRom(rom)}
                              className={`group relative rounded-xl border p-2.5 transition-all cursor-pointer flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                                  : 'bg-slate-900/90 hover:bg-slate-800/90 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {/* Top Cover Thumbnail with Play Overlay */}
                              <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center mb-2.5">
                                <GameCover
                                  consoleId={consoleConfig.id}
                                  romName={rom.name}
                                  localCoverUrl={rom.coverUrl}
                                  size="md"
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />

                                {/* Play button hover overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onSelectRomToPlay(rom);
                                    }}
                                    className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transition-transform hover:scale-110"
                                    title={`Jugar ${rom.name}`}
                                  >
                                    <Play className="w-5 h-5 fill-current" />
                                  </button>
                                </div>
                              </div>

                              {/* Card Game Details */}
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-white truncate group-hover:text-indigo-300 leading-tight">
                                  {rom.name}
                                </h4>
                                <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">
                                  {formatBytes(rom.size)}
                                </div>

                                {/* Playtime badge */}
                                <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-amber-300 bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded w-full truncate">
                                  <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="truncate">{formatPlaytime(playtime)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }

                  // Render List View (Detailed Rows)
                  return (
                    <div className="space-y-2">
                      {filtered.map((rom, idx) => {
                        const isSelected = selectedRom?.fileName === rom.fileName;
                        return (
                          <div
                            key={rom.fileName + idx}
                            onClick={() => setSelectedRom(rom)}
                            className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-indigo-600/15 border-indigo-500/50 shadow-md shadow-indigo-500/5'
                                : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              {/* Game Cover Art thumbnail */}
                              <div className="flex-shrink-0">
                                <GameCover
                                  consoleId={consoleConfig.id}
                                  romName={rom.name}
                                  localCoverUrl={rom.coverUrl}
                                  size="sm"
                                />
                              </div>

                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 flex items-center gap-2">
                                  <span className="truncate">{rom.name}</span>
                                </div>
                                <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono mt-0.5">
                                  <span className="truncate max-w-[140px] sm:max-w-[200px]">{rom.fileName}</span>
                                  <span>•</span>
                                  <span>{formatBytes(rom.size)}</span>
                                  {rom.isCustomFile && (
                                    <>
                                      <span>•</span>
                                      <span className="text-xs text-emerald-400 font-sans">
                                        (Memoria)
                                      </span>
                                    </>
                                  )}
                                  {/* Played time badge */}
                                  <span>•</span>
                                  <span className="text-[11px] font-sans text-amber-300/90 inline-flex items-center gap-1 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-500/20">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    {formatPlaytime(getPlaytimeSeconds(consoleConfig.id, rom.name))}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectRomToPlay(rom);
                              }}
                              className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Jugar</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()
              )}
            </div>
          </div>

          {/* Details & Joystick Preview Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Selected ROM or General Console Details */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Consola & Mando Activo
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{consoleConfig.name}</h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-medium border ${consoleConfig.badgeBg}`}
                  >
                    {consoleConfig.emulatorName}
                  </span>
                </div>

                {/* Joystick Visual preview */}
                <div className="my-2 py-4 px-3 flex items-center justify-center bg-slate-950/70 rounded-xl border border-slate-800/80">
                  <JoystickRenderer
                    consoleId={consoleConfig.id}
                    className="w-full max-w-[260px]"
                    isInteractive={false}
                  />
                </div>
              </div>

              {selectedRom ? (
                <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <GameCover
                      consoleId={consoleConfig.id}
                      romName={selectedRom.name}
                      localCoverUrl={selectedRom.coverUrl}
                      size="md"
                      className="shadow-xl"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-slate-400 mb-1">Juego Seleccionado:</div>
                      <div className="text-base font-bold text-white leading-tight truncate mb-1">
                        {selectedRom.name}
                      </div>
                      <div className="text-xs text-slate-400 font-mono mb-2 flex flex-wrap items-center gap-1.5">
                        <span>{formatBytes(selectedRom.size)}</span>
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-sans mb-1">
                        <ImageIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>Carátula auto-detectada</span>
                      </div>
                      <div className="text-xs text-amber-300 font-medium flex items-center gap-1.5 bg-amber-950/40 px-2 py-1 rounded-md border border-amber-500/20 w-fit">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{formatPlaytime(getPlaytimeSeconds(consoleConfig.id, selectedRom.name))} jugados</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectRomToPlay(selectedRom)}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Ejecutar {selectedRom.name}</span>
                  </button>
                </div>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => onSelectRomToPlay(null)}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors border border-slate-700"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Iniciar emulador sin ROM previa</span>
                  </button>
                </div>
              )}
            </div>

            {/* Folder Structure Explanation Note */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-slate-200 font-semibold mb-1.5">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Carátulas y Estructura de Carpetas:</span>
              </div>
              <p className="text-slate-400 text-xs mb-2 leading-relaxed">
                • <strong>Carátulas automáticas:</strong> La app busca automáticamente la caja oficial del juego en la base de datos de Libretro.
              </p>
              <p className="text-slate-400 text-xs mb-2.5 leading-relaxed">
                • <strong>Carátula personalizada:</strong> Si quieres una imagen específica, pon un archivo con el mismo nombre y extensión <code className="text-indigo-300 font-mono">.png</code> o <code className="text-indigo-300 font-mono">.jpg</code> junto a tu ROM (ej: <code className="text-slate-300 font-mono">mario.z64</code> + <code className="text-emerald-400 font-mono">mario.png</code>).
              </p>
              <p className="leading-relaxed font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 text-slate-300">
                /public/roms/<br />
                ├── snes/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'->'} Snes9x (.smc, .sfc)<br />
                ├── sega/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'->'} Genesis Plus GX (.bin, .md)<br />
                ├── gba/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'->'} VisualBoyAdvance (.gba)<br />
                ├── psx/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'->'} DuckStation (.iso, .bin, .cue)<br />
                └── n64/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'->'} Project64 (.z64, .n64)<br />
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
