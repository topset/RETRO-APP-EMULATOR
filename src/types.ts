export type ConsoleId = 'snes' | 'sega' | 'gba' | 'psx' | 'n64';

export interface RomItem {
  name: string;
  fileName: string;
  size: number;
  url: string;
  coverUrl?: string;
  addedAt?: string;
  isCustomFile?: boolean;
  blobUrl?: string;
}

export interface ConsoleConfig {
  id: ConsoleId;
  name: string;
  shortName: string;
  emulatorName: string;
  coreKey: string; // for EmulatorJS
  description: string;
  folderName: string;
  romExtensions: string[];
  sampleRomUrl?: string;
  sampleRomName?: string;
  accentColor: string;
  badgeBg: string;
  controls: {
    dpad: string;
    actionButtons: { label: string; key: string; color?: string }[];
    startSelect: string;
    triggers?: string;
  };
}
