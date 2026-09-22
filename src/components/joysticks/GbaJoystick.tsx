import React from 'react';

interface JoystickProps {
  className?: string;
  isInteractive?: boolean;
}

export const GbaJoystick: React.FC<JoystickProps> = ({ className = '', isInteractive = true }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 200"
        className="w-full h-auto drop-shadow-xl transition-transform duration-300 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gbaIndigo" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
          <linearGradient id="gbaScreenBezel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <linearGradient id="gbaLcd" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="gbaButton" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
          <linearGradient id="gbaTrigger" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>

        {/* L and R Triggers */}
        <path d="M 50 40 C 50 25, 90 20, 120 22 L 115 40 Z" fill="url(#gbaTrigger)" stroke="#64748b" strokeWidth="1.5" />
        <text x="80" y="32" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">L</text>
        <path d="M 350 40 C 350 25, 310 20, 280 22 L 285 40 Z" fill="url(#gbaTrigger)" stroke="#64748b" strokeWidth="1.5" />
        <text x="315" y="32" fill="#475569" fontSize="8" fontWeight="bold" fontFamily="monospace">R</text>

        {/* GBA Ergonomic Curved Body */}
        <path
          d="M 60 35 
             C 120 30, 280 30, 340 35 
             C 385 40, 395 100, 380 150 
             C 370 175, 335 185, 300 185 
             C 240 188, 160 188, 100 185 
             C 65 185, 30 175, 20 150 
             C 5 100, 15 40, 60 35 Z"
          fill="url(#gbaIndigo)"
          stroke="#4338ca"
          strokeWidth="2.5"
        />

        {/* Side Grip Ridges */}
        <g stroke="#3730a3" strokeWidth="2" strokeLinecap="round">
          <line x1="28" y1="95" x2="38" y2="100" />
          <line x1="26" y1="105" x2="36" y2="110" />
          <line x1="26" y1="115" x2="36" y2="120" />
          
          <line x1="372" y1="95" x2="362" y2="100" />
          <line x1="374" y1="105" x2="364" y2="110" />
          <line x1="374" y1="115" x2="364" y2="120" />
        </g>

        {/* Central Screen Bezel */}
        <rect x="125" y="45" width="150" height="110" rx="14" fill="url(#gbaScreenBezel)" stroke="#374151" strokeWidth="2" />

        {/* LCD Display */}
        <rect x="140" y="55" width="120" height="80" rx="4" fill="url(#gbaLcd)" stroke="#1e293b" strokeWidth="1.5" />

        {/* Screen Glare & Grid Accent */}
        <path d="M 142 57 L 210 57 L 160 133 L 142 133 Z" fill="#ffffff" opacity="0.04" />
        
        {/* Screen Logo Simulation */}
        <text
          x="200"
          y="98"
          textAnchor="middle"
          fill="#38bdf8"
          fontSize="10"
          fontWeight="900"
          letterSpacing="2"
          fontFamily="sans-serif"
          opacity="0.8"
        >
          ADVANCE
        </text>

        {/* Power LED */}
        <circle cx="260" cy="50" r="3" fill="#22c55e" />
        <circle cx="260" cy="50" r="1.5" fill="#86efac" />

        {/* "GAME BOY ADVANCE" bezel text */}
        <text
          x="200"
          y="148"
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="7"
          fontWeight="bold"
          letterSpacing="2"
          fontFamily="sans-serif"
        >
          GAME BOY ADVANCE
        </text>

        {/* D-PAD (Left) */}
        <g id="gba-dpad" className={isInteractive ? 'cursor-pointer' : ''}>
          <rect x="67" y="78" width="18" height="56" rx="3" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.5" />
          <rect x="48" y="97" width="56" height="18" rx="3" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.5" />
          <circle cx="76" cy="106" r="6" fill="#0f172a" />
          {/* Subtle directional marks */}
          <polygon points="76,82 72,87 80,87" fill="#6366f1" />
          <polygon points="76,130 72,125 80,125" fill="#6366f1" />
          <polygon points="52,106 57,102 57,110" fill="#6366f1" />
          <polygon points="100,106 95,102 95,110" fill="#6366f1" />
        </g>

        {/* START & SELECT (Bottom Center/Left) */}
        <g id="gba-start-select" className={isInteractive ? 'cursor-pointer' : ''}>
          <g transform="rotate(30 95 160)">
            <rect x="85" y="157" width="20" height="6" rx="3" fill="#1e1b4b" />
          </g>
          <text x="80" y="176" fill="#c7d2fe" fontSize="6" fontWeight="bold">SELECT</text>

          <g transform="rotate(30 120 160)">
            <rect x="110" y="157" width="20" height="6" rx="3" fill="#1e1b4b" />
          </g>
          <text x="114" y="176" fill="#c7d2fe" fontSize="6" fontWeight="bold">START</text>
        </g>

        {/* A and B BUTTONS (Right - Angled) */}
        <g id="gba-buttons" className={isInteractive ? 'cursor-pointer' : ''}>
          {/* B BUTTON */}
          <g>
            <circle cx="308" cy="116" r="14" fill="url(#gbaButton)" stroke="#581c87" strokeWidth="2" />
            <text x="308" y="120" textAnchor="middle" fill="#fdf4ff" fontSize="11" fontWeight="bold">B</text>
          </g>

          {/* A BUTTON */}
          <g>
            <circle cx="338" cy="94" r="14" fill="url(#gbaButton)" stroke="#581c87" strokeWidth="2" />
            <text x="338" y="98" textAnchor="middle" fill="#fdf4ff" fontSize="11" fontWeight="bold">A</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
