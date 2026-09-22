export type CheatType = 'game-genie' | 'gameshark' | 'action-replay' | 'raw';

export interface CheatItem {
  id: string;
  consoleId: string;
  gameName: string; // Wildcard "*" or game matching title
  title: string;
  code: string;
  type: CheatType;
  description?: string;
  enabled: boolean;
  isPreset?: boolean;
}

// Built-in presets for classic games across popular consoles
export const DEFAULT_PRESET_CHEATS: CheatItem[] = [
  // Super Mario World (SNES)
  {
    id: 'snes-smw-lives',
    consoleId: 'snes',
    gameName: 'Super Mario World',
    title: 'Vidas Infinitas (99 Vidas)',
    code: 'C264-64DD',
    type: 'game-genie',
    description: 'Mantiene siempre el contador al máximo de vidas.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'snes-smw-invinc',
    consoleId: 'snes',
    gameName: 'Super Mario World',
    title: 'Estrella Invencible Permanente',
    code: '7E149020',
    type: 'gameshark',
    description: 'Mario es inmune al daño de todos los enemigos.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'snes-smw-moonjump',
    consoleId: 'snes',
    gameName: 'Super Mario World',
    title: 'Salto Lunar (Moon Jump)',
    code: 'DDE6-6FAD',
    type: 'game-genie',
    description: 'Permite elevarse manteniendo presionado el botón de salto.',
    enabled: false,
    isPreset: true,
  },

  // Sonic the Hedgehog (Genesis)
  {
    id: 'sega-sonic-rings',
    consoleId: 'sega',
    gameName: 'Sonic The Hedgehog',
    title: 'Anillos Infinitos (No mueres al recibir daño)',
    code: 'SCKA-BA10',
    type: 'game-genie',
    description: 'Tus anillos nunca disminuyen a cero.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'sega-sonic-lives',
    consoleId: 'sega',
    gameName: 'Sonic The Hedgehog',
    title: 'Vidas Infinitas',
    code: 'GJ6A-CA7A',
    type: 'game-genie',
    description: 'Vidas ilimitadas durante toda la aventura.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'sega-sonic-invincible',
    consoleId: 'sega',
    gameName: 'Sonic The Hedgehog',
    title: 'Invisibilidad / Escudo Permanente',
    code: 'ATBA-AA20',
    type: 'game-genie',
    description: 'Sonic no recibe daño de pinchos ni robots.',
    enabled: false,
    isPreset: true,
  },

  // Pokémon Esmeralda / Rojo Fuego (GBA)
  {
    id: 'gba-pokemon-rare-candy',
    consoleId: 'gba',
    gameName: 'Pokemon',
    title: 'Caramelos Raros Infinitos (PC Item)',
    code: '82003884 0044',
    type: 'gameshark',
    description: 'Coloca Caramelos Raros ilimitados en el almacén del PC.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'gba-pokemon-master-ball',
    consoleId: 'gba',
    gameName: 'Pokemon',
    title: 'Master Balls Infinitas en Tienda (Costo 0)',
    code: '82003884 0001',
    type: 'gameshark',
    description: 'Compra Master Balls gratis en cualquier tienda Pokémon.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'gba-pokemon-walk-walls',
    consoleId: 'gba',
    gameName: 'Pokemon',
    title: 'Atravesar Paredes (Walk Through Walls)',
    code: '788101EA E8EEA4A0',
    type: 'action-replay',
    description: 'Camina por cualquier terreno u obstáculo del mapa.',
    enabled: false,
    isPreset: true,
  },

  // Super Mario 64 (N64)
  {
    id: 'n64-sm64-health',
    consoleId: 'n64',
    gameName: 'Super Mario 64',
    title: 'Energía / Salud Infinita',
    code: '8133B21E 0800',
    type: 'gameshark',
    description: 'Mario nunca pierde las 8 cuñas de vida ni se ahoga bajo el agua.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'n64-sm64-lives',
    consoleId: 'n64',
    gameName: 'Super Mario 64',
    title: '99 Vidas Máximas',
    code: '8033B21D 0063',
    type: 'gameshark',
    description: 'Fija el contador de vidas en 99.',
    enabled: false,
    isPreset: true,
  },

  // Crash Bandicoot / Gran Turismo (PSX)
  {
    id: 'psx-crash-lives',
    consoleId: 'psx',
    gameName: 'Crash Bandicoot',
    title: '99 Vidas Infinitas',
    code: '800566A8 0063',
    type: 'action-replay',
    description: 'Vidas fijas en 99 para no ver nunca la pantalla de Game Over.',
    enabled: false,
    isPreset: true,
  },
  {
    id: 'psx-crash-mask',
    consoleId: 'psx',
    gameName: 'Crash Bandicoot',
    title: 'Máscara Aku Aku Dorada Permanente',
    code: '800566A4 0002',
    type: 'gameshark',
    description: 'Invulnerabilidad constante con la máscara espiritual.',
    enabled: false,
    isPreset: true,
  },
];
