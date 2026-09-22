// Libretro Open-Source Thumbnails database (high resolution Named_Boxarts)
// Repo: https://github.com/libretro-thumbnails/
const LIBRETRO_SYSTEM_NAMES: Record<string, string> = {
  snes: 'Nintendo_-_Super_Nintendo_Entertainment_System',
  sega: 'Sega_-_Mega_Drive_-_Genesis',
  gba: 'Nintendo_-_Game_Boy_Advance',
  psx: 'Sony_-_PlayStation',
  n64: 'Nintendo_-_Nintendo_64',
};

// Clean game name to match Libretro thumbnail naming conventions
export function cleanRomTitle(rawName: string): string {
  return rawName
    // Remove extension if present
    .replace(/\.[^/.]+$/, '')
    // Remove tags like (USA), (Europe), [!], (Beta), (En,Fr,De), (v1.1)
    .replace(/\s*\([^)]*\)/g, '')
    .replace(/\s*\[[^\]]*\]/g, '')
    // Replace underscores with spaces
    .replace(/_/g, ' ')
    // Normalize spaces
    .trim();
}

/**
 * Returns thumbnail candidate URLs for a given ROM and console.
 * Tries direct local cover, Libretro boxart CDN, and fallback placeholders.
 */
export function getCoverArtUrl(consoleId: string, romName: string, localCoverUrl?: string): string {
  if (localCoverUrl) {
    return localCoverUrl;
  }

  const cleaned = cleanRomTitle(romName);
  const system = LIBRETRO_SYSTEM_NAMES[consoleId];

  if (!system || !cleaned) {
    return '';
  }

  // Libretro thumbnail standard encodes '&' as '_', and special chars
  const formattedName = encodeURIComponent(cleaned.replace(/&/g, '_'));
  
  return `https://raw.githubusercontent.com/libretro-thumbnails/${system}/master/Named_Boxarts/${formattedName}.png`;
}
