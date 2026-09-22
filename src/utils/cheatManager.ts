import { CheatItem, DEFAULT_PRESET_CHEATS } from '../types/cheats';

const CHEATS_STORAGE_KEY = 'retro_emulator_user_cheats';

export const getStoredCheats = (consoleId: string, gameName?: string | null): CheatItem[] => {
  let customCheats: CheatItem[] = [];
  try {
    const raw = localStorage.getItem(CHEATS_STORAGE_KEY);
    if (raw) {
      customCheats = JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Error reading stored cheats:', e);
  }

  // Filter presets that match this console
  const matchingPresets = DEFAULT_PRESET_CHEATS.filter(
    (preset) => preset.consoleId === consoleId
  );

  // Combine custom cheats + presets (custom cheats overrides preset enabled status if matching id)
  const combined: CheatItem[] = [];

  // Add presets
  matchingPresets.forEach((p) => {
    const customMatch = customCheats.find((c) => c.id === p.id);
    if (customMatch) {
      combined.push({ ...p, enabled: customMatch.enabled });
    } else {
      combined.push(p);
    }
  });

  // Add purely custom cheats added by user for this console
  customCheats
    .filter((c) => c.consoleId === consoleId && !matchingPresets.some((p) => p.id === c.id))
    .forEach((c) => combined.push(c));

  return combined;
};

export const saveCheatItem = (cheat: CheatItem): void => {
  try {
    const raw = localStorage.getItem(CHEATS_STORAGE_KEY);
    let list: CheatItem[] = raw ? JSON.parse(raw) : [];

    const existingIdx = list.findIndex((c) => c.id === cheat.id);
    if (existingIdx >= 0) {
      list[existingIdx] = cheat;
    } else {
      list.unshift(cheat);
    }

    localStorage.setItem(CHEATS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error saving cheat:', e);
  }
};

export const toggleCheatItem = (cheatId: string, enabled: boolean): void => {
  try {
    const raw = localStorage.getItem(CHEATS_STORAGE_KEY);
    let list: CheatItem[] = raw ? JSON.parse(raw) : [];

    const existingIdx = list.findIndex((c) => c.id === cheatId);
    if (existingIdx >= 0) {
      list[existingIdx].enabled = enabled;
    } else {
      // Find from presets and save with new status
      const preset = DEFAULT_PRESET_CHEATS.find((p) => p.id === cheatId);
      if (preset) {
        list.push({ ...preset, enabled });
      }
    }

    localStorage.setItem(CHEATS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error toggling cheat:', e);
  }
};

export const deleteCustomCheat = (cheatId: string): void => {
  try {
    const raw = localStorage.getItem(CHEATS_STORAGE_KEY);
    if (!raw) return;
    let list: CheatItem[] = JSON.parse(raw);
    list = list.filter((c) => c.id !== cheatId);
    localStorage.setItem(CHEATS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Error deleting cheat:', e);
  }
};
