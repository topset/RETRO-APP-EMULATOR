import React from 'react';

interface JoystickProps {
  className?: string;
  isInteractive?: boolean;
}

export const SegaJoystick: React.FC<JoystickProps> = ({ className = '', isInteractive = true }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 190"
        className="w-full h-auto drop-shadow-xl transition-transform duration-300 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="segaBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="40%" stopColor="#1f2937" />
            <stop offset="100%" stopColor="#111827" />
          </linearGradient>
          <radialGradient id="segaDpadDisc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1f2937" />
            <stop offset="85%" stopColor="#111827" />
            <stop offset="100%" stopColor="#374151" />
          </radialGradient>
          <linearGradient id="segaBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Cable */}
        <path d="M 200 15 L 200 0" stroke="#111827" strokeWidth="10" strokeLinecap="round" />
        <rect x="192" y="10" width="16" height="12" rx="3" fill="#1f2937" stroke="#374151" strokeWidth="1" />

        {/* Crescent Ergonomic Body */}
        <path
          d="M 60 40 
             C 120 25, 280 25, 340 40 
             C 390 60, 395 140, 350 170 
             C 320 185, 290 170, 270 145 
             C 240 120, 160 120, 130 145 
             C 110 170, 80 185, 50 170 
             C 5 140, 10 60, 60 40 Z"
          fill="url(#segaBody)"
          stroke="#4b5563"
          strokeWidth="2"
        />

        {/* Body Highlight Lines */}
        <path
          d="M 80 48 C 140 38, 260 38, 320 48"
          stroke="#4b5563"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* 16-BIT Logo */}
        <text
          x="200"
          y="52"
          textAnchor="middle"
          fill="#d1d5db"
          fontSize="10"
          fontWeight="900"
          letterSpacing="2"
          fontFamily="sans-serif"
        >
          16-BIT
        </text>
        <text
          x="200"
          y="62"
          textAnchor="middle"
          fill="#9ca3af"
          fontSize="6"
          fontWeight="bold"
          letterSpacing="4"
          fontFamily="sans-serif"
        >
          SEGA
        </text>

        {/* START Button (Red/White - Center angled) */}
        <g id="sega-start" className={isInteractive ? 'cursor-pointer' : ''}>
          <ellipse cx="200" cy="85" rx="14" ry="7" fill="#dc2626" stroke="#b91c1c" strokeWidth="1.5" />
          <ellipse cx="200" cy="85" rx="14" ry="7" fill="url(#segaBevel)" />
          <text
            x="200"
            y="102"
            textAnchor="middle"
            fill="#e5e7eb"
            fontSize="6"
            fontWeight="bold"
            letterSpacing="1"
          >
            START
          </text>
        </g>

        {/* D-PAD (Left) */}
        <g id="sega-dpad" className={isInteractive ? 'cursor-pointer' : ''}>
          {/* Circular Disc Base */}
          <circle cx="95" cy="100" r="44" fill="url(#segaDpadDisc)" stroke="#374151" strokeWidth="1.5" />
          <circle cx="95" cy="100" r="38" fill="#111827" stroke="#1f2937" strokeWidth="2" />
          
          {/* 8-Way Cross on Top */}
          <rect x="86" y="68" width="18" height="64" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <rect x="63" y="91" width="64" height="18" rx="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
          <circle cx="95" cy="100" r="7" fill="#111827" />
          
          {/* Subtle directional arrows */}
          <path d="M 95 72 L 91 76 L 99 76 Z" fill="#9ca3af" />
          <path d="M 95 128 L 91 124 L 99 124 Z" fill="#9ca3af" />
          <path d="M 67 100 L 71 96 L 71 104 Z" fill="#9ca3af" />
          <path d="M 123 100 L 119 96 L 119 104 Z" fill="#9ca3af" />
        </g>

        {/* 6-BUTTON CLUSTER (Right side) */}
        <g id="sega-buttons" className={isInteractive ? 'cursor-pointer' : ''}>
          {/* Top Row: X, Y, Z (Smaller arcade buttons) */}
          <g transform="translate(0, 0)">
            {/* X */}
            <circle cx="270" cy="75" r="9" fill="#1f2937" stroke="#4b5563" strokeWidth="1.5" />
            <circle cx="270" cy="75" r="9" fill="url(#segaBevel)" />
            <text x="270" y="78" textAnchor="middle" fill="#9ca3af" fontSize="8" fontWeight="bold">X</text>

            {/* Y */}
            <circle cx="295" cy="70" r="9" fill="#1f2937" stroke="#4b5563" strokeWidth="1.5" />
            <circle cx="295" cy="70" r="9" fill="url(#segaBevel)" />
            <text x="295" y="73" textAnchor="middle" fill="#9ca3af" fontSize="8" fontWeight="bold">Y</text>

            {/* Z */}
            <circle cx="320" cy="65" r="9" fill="#1f2937" stroke="#4b5563" strokeWidth="1.5" />
            <circle cx="320" cy="65" r="9" fill="url(#segaBevel)" />
            <text x="320" y="68" textAnchor="middle" fill="#9ca3af" fontSize="8" fontWeight="bold">Z</text>
          </g>

          {/* Bottom Row: A, B, C (Main larger buttons) */}
          <g transform="translate(0, 0)">
            {/* A */}
            <circle cx="265" cy="115" r="14" fill="#1f2937" stroke="#6b7280" strokeWidth="2" />
            <circle cx="265" cy="115" r="14" fill="url(#segaBevel)" />
            <text x="265" y="119" textAnchor="middle" fill="#f3f4f6" fontSize="11" fontWeight="900">A</text>

            {/* B */}
            <circle cx="298" cy="108" r="14" fill="#1f2937" stroke="#6b7280" strokeWidth="2" />
            <circle cx="298" cy="108" r="14" fill="url(#segaBevel)" />
            <text x="298" y="112" textAnchor="middle" fill="#f3f4f6" fontSize="11" fontWeight="900">B</text>

            {/* C */}
            <circle cx="332" cy="98" r="14" fill="#1f2937" stroke="#6b7280" strokeWidth="2" />
            <circle cx="332" cy="98" r="14" fill="url(#segaBevel)" />
            <text x="332" y="102" textAnchor="middle" fill="#f3f4f6" fontSize="11" fontWeight="900">C</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
