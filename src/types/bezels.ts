export type BezelMode = 
  | 'none'          // Sin marcos (Pantalla completa / bordes negros estándar)
  | 'arcade-cabinet'// Mueble Arcade Neo-Geo / Madera y altavoces estéreo
  | 'console-themed'// Marco oficial temático con logos y textura de la consola (SNES, Genesis, GBA, PSX, N64)
  | 'ambient-glow'  // Fondo difuminado dinámico / Iluminación ambiental estilo Ambilight de TV
  | 'crt-monitor';  // Monitor de tubo retro gris clásico de los años 90 con rejilla de ventilación

export interface BezelPreset {
  id: BezelMode;
  name: string;
  tagline: string;
  description: string;
}

export const BEZEL_PRESETS: BezelPreset[] = [
  {
    id: 'none',
    name: 'Sin marco (Puro)',
    tagline: 'Barras negras clásicas',
    description: 'Relación de aspecto original sin ningún adorno lateral.',
  },
  {
    id: 'console-themed',
    name: 'Marco Temático de Consola',
    tagline: 'Logo e insignias de la consola',
    description: 'Marcos laterales personalizados con texturas auténticas, logos y detalles de hardware de la consola en juego.',
  },
  {
    id: 'arcade-cabinet',
    name: 'Mueble Recreativa (Arcade)',
    tagline: 'Rejillas de audio + Remaches',
    description: 'Sensación de estar frente al mueble arcade con parlantes estéreo retro y acabados metálicos.',
  },
  {
    id: 'ambient-glow',
    name: 'Ambilight / Cine Glow',
    tagline: 'Iluminación ambiental dinámica',
    description: 'Halo de luz atmosférico cálido en los bordes que expande la inmersión de la pantalla en la oscuridad.',
  },
  {
    id: 'crt-monitor',
    name: 'Monitor de Tubo 90s',
    tagline: 'Carcasa beige de PC y ranuras',
    description: 'Chasis de monitor CRT de sobremesa con rejillas de ventilación y botón de encendido.',
  },
];
