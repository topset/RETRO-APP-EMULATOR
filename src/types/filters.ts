export type VideoShaderFilter = 
  | 'none'          // Píxel Perfecto Nativo (Crisp sharp pixels)
  | 'crt-trinitron' // CRT Sony Trinitron (Scanlines finas + Phosphor Glow + Máscara de apertura)
  | 'crt-arcade'    // Arcade CRT Clásico (Scanlines gruesas + Curvatura de tubo bombée + Vignette)
  | 'vhs-warm'      // VHS / TV Color Cálido 90s (Leve aberración cromática + saturación retro)
  | 'gameboy-dot'   // LCD Dot-Matrix Vintage (Retícula de matriz de puntos + tono fósforo retro);

export interface VideoFilterPreset {
  id: VideoShaderFilter;
  name: string;
  tagline: string;
  description: string;
  recommendedFor: string;
  accentColor: string;
}

export const VIDEO_FILTERS: VideoFilterPreset[] = [
  {
    id: 'none',
    name: 'Píxel Nítido',
    tagline: 'Sin filtro (Raw Pixels)',
    description: 'Renderizado digital puro 1:1 sin modificación visual ni scanlines.',
    recommendedFor: 'GBA, N64 y jugadores competitivos',
    accentColor: 'text-slate-300',
  },
  {
    id: 'crt-trinitron',
    name: 'Sony Trinitron CRT',
    tagline: 'Scanlines de Apertura + Glow',
    description: 'Líneas de barrido ópticas horizontales con leve resplandor de fósforo y viñeta sutil. Aspecto auténtico de TV de gama alta de los 90s.',
    recommendedFor: 'SNES, PS1, Sega Genesis',
    accentColor: 'text-cyan-400',
  },
  {
    id: 'crt-arcade',
    name: 'Arcade TV Curvo',
    tagline: 'Tubo Abombado + Scanlines Pesadas',
    description: 'Imita la curvatura física del vidrio convexo de una máquina recreativa arcade con sombras periféricas y líneas marcadas.',
    recommendedFor: 'Juegos arcade de Sega y acción SNES',
    accentColor: 'text-amber-400',
  },
  {
    id: 'vhs-warm',
    name: 'VHS Retro Color',
    tagline: 'Cálido Vintage + Leve Blur',
    description: 'Calidez nostálgica con ligero sangrado de color (color bleed) y difusión suave que suaviza los polígonos tempranos.',
    recommendedFor: 'PlayStation 1 y N64',
    accentColor: 'text-rose-400',
  },
  {
    id: 'gameboy-dot',
    name: 'LCD Grid Matrix',
    tagline: 'Retícula de Píxeles Portátil',
    description: 'Malla microscópica de matriz de puntos tipo pantalla LCD retroiluminada de consolas portátiles.',
    recommendedFor: 'Game Boy Advance',
    accentColor: 'text-emerald-400',
  },
];
