import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

const ROMS_DIR = path.join(process.cwd(), 'public', 'roms');

// Ensure roms directory and console subdirectories exist
const CONSOLES = ['snes', 'sega', 'gba', 'psx', 'n64'];
if (!fs.existsSync(ROMS_DIR)) {
  fs.mkdirSync(ROMS_DIR, { recursive: true });
}
CONSOLES.forEach((c) => {
  const dir = path.join(ROMS_DIR, c);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Extensions map per console
const VALID_EXTENSIONS: Record<string, string[]> = {
  snes: ['.smc', '.sfc', '.fig', '.zip'],
  sega: ['.bin', '.gen', '.md', '.smd', '.zip'],
  gba: ['.gba', '.bin', '.zip'],
  psx: ['.iso', '.cue', '.bin', '.chd', '.pbp'],
  n64: ['.z64', '.n64', '.v64', '.zip'],
};

// API: List ROMs for a specific console or all consoles
app.get('/api/roms/:consoleId?', (req, res) => {
  try {
    const { consoleId } = req.params;
    const consolesToScan = consoleId ? [consoleId] : CONSOLES;

    const results: Record<
      string,
      Array<{ name: string; fileName: string; size: number; url: string; addedAt: string }>
    > = {};

    consolesToScan.forEach((c) => {
      const consolePath = path.join(ROMS_DIR, c);
      if (!fs.existsSync(consolePath)) {
        results[c] = [];
        return;
      }

      const files = fs.readdirSync(consolePath);
      const allowedExts = VALID_EXTENSIONS[c] || [];

      results[c] = files
        .filter((file) => {
          const ext = path.extname(file).toLowerCase();
          return allowedExts.includes(ext) && file !== 'LEEME.txt';
        })
        .map((file) => {
          const filePath = path.join(consolePath, file);
          const stats = fs.statSync(filePath);
          const rawBaseName = path.basename(file, path.extname(file));
          const cleanName = rawBaseName.replace(/_/g, ' ');

          // Check if user placed a companion image in the same folder with the same name (.png, .jpg, .webp, .jpeg)
          const imageExts = ['.png', '.jpg', '.jpeg', '.webp'];
          let localCoverUrl: string | undefined = undefined;
          for (const imgExt of imageExts) {
            const coverPath = path.join(consolePath, `${rawBaseName}${imgExt}`);
            if (fs.existsSync(coverPath)) {
              localCoverUrl = `/roms/${c}/${encodeURIComponent(`${rawBaseName}${imgExt}`)}`;
              break;
            }
          }

          return {
            name: cleanName,
            fileName: file,
            size: stats.size,
            url: `/roms/${c}/${encodeURIComponent(file)}`,
            coverUrl: localCoverUrl,
            addedAt: stats.mtime.toISOString(),
          };
        });
    });

    if (consoleId) {
      return res.json({ success: true, consoleId, roms: results[consoleId] || [] });
    }

    res.json({ success: true, romsByConsole: results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Emulator Launcher server running at http://0.0.0.0:${PORT}`);
  });
}

start();
