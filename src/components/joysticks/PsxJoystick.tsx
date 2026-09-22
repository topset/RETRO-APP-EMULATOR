import React from 'react';

interface JoystickProps {
  className?: string;
  isInteractive?: boolean;
}

export const PsxJoystick: React.FC<JoystickProps> = ({ className = '', isInteractive = true }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 220"
        className="w-full h-auto drop-shadow-xl transition-transform duration-300 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="psxGrey" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="psxGrip" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="psxButtonShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Cable */}
        <path d="M 200 20 L 200 0" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
        <rect x="192" y="15" width="16" height="12" rx="3" fill="#1e293b" />

        {/* L1 / L2 / R1 / R2 Shoulders */}
        <path d="M 80 32 C 100 24, 130 26, 145 32" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
        <text x="110" y="30" fill="#475569" fontSize="6" fontWeight="bold">L1</text>
        <path d="M 255 32 C 270 26, 300 24, 320 32" stroke="#64748b" strokeWidth="8" strokeLinecap="round" />
        <text x="285" y="30" fill="#475569" fontSize="6" fontWeight="bold">R1</text>

        {/* Dual Handle PS1 Controller Shell */}
        <path
          d="M 120 35 
             C 160 30, 240 30, 280 35 
             C 320 40, 350 75, 360 110 
             C 375 160, 355 210, 325 210 
             C 300 210, 285 165, 275 130 
             C 255 125, 225 120, 200 120 
             C 175 120, 145 125, 125 130 
             C 115 165, 100 210, 75 210 
             C 45 210, 25 160, 40 110 
             C 50 75, 80 40, 120 35 Z"
          fill="url(#psxGrey)"
          stroke="#64748b"
          strokeWidth="2"
        />

        {/* Center Panel Inset */}
        <path
          d="M 140 45 C 170 42, 230 42, 260 45 C 270 70, 260 110, 200 115 C 140 110, 130 70, 140 45 Z"
          fill="#cbd5e1"
          opacity="0.5"
        />

        {/* SONY Text */}
        <text
          x="200"
          y="48"
          textAnchor="middle"
          fill="#334155"
          fontSize="9"
          fontWeight="900"
          letterSpacing="2"
          fontFamily="serif"
        >
          SONY
        </text>

        {/* PlayStation Logo */}
        <g transform="translate(192, 54) scale(0.7)">
          <path d="M11 2 L11 22 L16 19 L16 8 Z" fill="#ef4444" />
          <path d="M11 12 C18 10, 24 16, 17 21 C11 25, 5 22, 1 19 L6 16 C9 18, 14 20, 15 17 C16 14, 13 12, 11 12 Z" fill="#3b82f6" />
          <path d="M16 8 C20 7, 24 9, 23 13 L19 14 C19 11, 17 10, 16 10 Z" fill="#eab308" />
          <path d="M6 16 L1 19 C0 18, 1 15, 4 14 L6 16 Z" fill="#22c55e" />
        </g>
        <text
          x="200"
          y="77"
          textAnchor="middle"
          fill="#475569"
          fontSize="6"
          fontWeight="bold"
          letterSpacing="1"
        >
          PlayStation
        </text>

        {/* SELECT & START Buttons */}
        <g id="psx-select-start" className={isInteractive ? 'cursor-pointer' : ''}>
          <rect x="156" y="85" width="18" height="8" rx="4" fill="#475569" stroke="#334155" strokeWidth="1" />
          <text x="165" y="100" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="bold">SELECT</text>

          <rect x="226" y="85" width="18" height="8" rx="4" fill="#475569" stroke="#334155" strokeWidth="1" />
          <text x="235" y="100" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="bold">START</text>
        </g>

        {/* D-PAD (Left) - 4 Separate Independent Direction Keys */}
        <g id="psx-dpad" className={isInteractive ? 'cursor-pointer' : ''}>
          <circle cx="100" cy="88" r="42" fill="#94a3b8" opacity="0.3" />

          {/* UP */}
          <rect x="92" y="55" width="16" height="24" rx="4" fill="#1e293b" />
          <polygon points="100,60 95,67 105,67" fill="#64748b" />

          {/* DOWN */}
          <rect x="92" y="97" width="16" height="24" rx="4" fill="#1e293b" />
          <polygon points="100,116 95,109 105,109" fill="#64748b" />

          {/* LEFT */}
          <rect x="67" y="80" width="24" height="16" rx="4" fill="#1e293b" />
          <polygon points="72,88 79,83 79,93" fill="#64748b" />

          {/* RIGHT */}
          <rect x="109" y="80" width="24" height="16" rx="4" fill="#1e293b" />
          <polygon points="128,88 121,83 121,93" fill="#64748b" />

          <circle cx="100" cy="88" r="6" fill="#334155" />
        </g>

        {/* 4 GEOMETRIC ACTION BUTTONS (Right) */}
        <g id="psx-buttons" className={isInteractive ? 'cursor-pointer' : ''}>
          <circle cx="300" cy="88" r="42" fill="#94a3b8" opacity="0.3" />

          {/* TRIANGLE (Top - Green) */}
          <g>
            <circle cx="300" cy="62" r="13" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="300" cy="62" r="13" fill="url(#psxButtonShine)" />
            <polygon points="300,56 293,67 307,67" stroke="#22c55e" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
          </g>

          {/* CIRCLE (Right - Red) */}
          <g>
            <circle cx="326" cy="88" r="13" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="326" cy="88" r="13" fill="url(#psxButtonShine)" />
            <circle cx="326" cy="88" r="6.5" stroke="#ef4444" strokeWidth="2.5" fill="none" />
          </g>

          {/* CROSS (Bottom - Blue) */}
          <g>
            <circle cx="300" cy="114" r="13" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="300" cy="114" r="13" fill="url(#psxButtonShine)" />
            <line x1="294" y1="108" x2="306" y2="120" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="306" y1="108" x2="294" y2="120" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* SQUARE (Left - Pink) */}
          <g>
            <circle cx="274" cy="88" r="13" fill="#1e293b" stroke="#334155" strokeWidth="1.5" />
            <circle cx="274" cy="88" r="13" fill="url(#psxButtonShine)" />
            <rect x="268" y="82" width="12" height="12" stroke="#ec4899" strokeWidth="2.5" fill="none" rx="1" />
          </g>
        </g>
      </svg>
    </div>
  );
};
