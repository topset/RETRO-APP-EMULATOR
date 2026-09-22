import React from 'react';

interface JoystickProps {
  className?: string;
  isInteractive?: boolean;
}

export const SnesJoystick: React.FC<JoystickProps> = ({ className = '', isInteractive = true }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 180"
        className="w-full h-auto drop-shadow-xl transition-transform duration-300 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="snesBody" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="60%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
          <linearGradient id="snesInnerPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
          <linearGradient id="snesButtonBevel" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </linearGradient>
          <filter id="dropGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Cable Connection */}
        <path d="M 200 15 L 200 0" stroke="#374151" strokeWidth="10" strokeLinecap="round" />
        <rect x="192" y="10" width="16" height="12" rx="3" fill="#1f2937" />

        {/* L and R Shoulders */}
        <path d="M 70 24 Q 100 18 140 22" stroke="#9ca3af" strokeWidth="8" strokeLinecap="round" />
        <text x="100" y="22" fill="#6b7280" fontSize="7" fontWeight="bold" fontFamily="monospace">L</text>
        <path d="M 260 22 Q 300 18 330 24" stroke="#9ca3af" strokeWidth="8" strokeLinecap="round" />
        <text x="295" y="22" fill="#6b7280" fontSize="7" fontWeight="bold" fontFamily="monospace">R</text>

        {/* Main Body (Classic Dogbone curve) */}
        <rect
          x="30"
          y="25"
          width="340"
          height="130"
          rx="65"
          fill="url(#snesBody)"
          stroke="#9ca3af"
          strokeWidth="2"
        />

        {/* Inner Darker Faceplate Insets */}
        {/* Left D-pad Inset */}
        <circle cx="95" cy="90" r="46" fill="#9ca3af" opacity="0.35" />
        
        {/* Right Buttons Oval Inset */}
        <g transform="rotate(-18 305 90)">
          <rect x="250" y="55" width="110" height="70" rx="35" fill="#9ca3af" opacity="0.35" />
        </g>

        {/* Center Logo Area */}
        <g id="snes-logo">
          <text
            x="200"
            y="65"
            textAnchor="middle"
            fill="#374151"
            fontSize="10"
            fontWeight="900"
            letterSpacing="2"
            fontFamily="sans-serif"
          >
            SUPER NINTENDO
          </text>
          <text
            x="200"
            y="76"
            textAnchor="middle"
            fill="#6b7280"
            fontSize="6"
            fontWeight="bold"
            letterSpacing="3"
            fontFamily="sans-serif"
          >
            ENTERTAINMENT SYSTEM
          </text>
        </g>

        {/* D-PAD (Left) */}
        <g id="snes-dpad" className={isInteractive ? 'cursor-pointer' : ''}>
          {/* Base */}
          <rect x="85" y="55" width="20" height="70" rx="4" fill="#1f2937" />
          <rect x="60" y="80" width="70" height="20" rx="4" fill="#1f2937" />
          {/* Highlights & Center Dimple */}
          <circle cx="95" cy="90" r="6" fill="#111827" />
          {/* Arrow Marks */}
          <polygon points="95,58 91,63 99,63" fill="#374151" />
          <polygon points="95,122 91,117 99,117" fill="#374151" />
          <polygon points="63,90 68,86 68,94" fill="#374151" />
          <polygon points="127,90 122,86 122,94" fill="#374151" />
        </g>

        {/* SELECT & START (Center) */}
        <g id="snes-center-buttons">
          {/* Select */}
          <g transform="rotate(-25 168 112)" className={isInteractive ? 'cursor-pointer' : ''}>
            <rect x="156" y="107" width="24" height="10" rx="5" fill="#1f2937" />
            <text x="168" y="125" textAnchor="middle" fill="#4b5563" fontSize="6" fontWeight="bold">
              SELECT
            </text>
          </g>
          {/* Start */}
          <g transform="rotate(-25 212 112)" className={isInteractive ? 'cursor-pointer' : ''}>
            <rect x="200" y="107" width="24" height="10" rx="5" fill="#1f2937" />
            <text x="212" y="125" textAnchor="middle" fill="#4b5563" fontSize="6" fontWeight="bold">
              START
            </text>
          </g>
        </g>

        {/* 4 ACTION BUTTONS (Right) - Iconic Super Famicom / EU Colors */}
        <g id="snes-buttons" className={isInteractive ? 'cursor-pointer' : ''}>
          {/* Y BUTTON (Green - Left) */}
          <g>
            <circle cx="275" cy="90" r="13" fill="#15803d" stroke="#166534" strokeWidth="2" filter="url(#dropGlow)" />
            <circle cx="275" cy="90" r="13" fill="url(#snesButtonBevel)" />
            <text x="254" y="93" fill="#4b5563" fontSize="8" fontWeight="bold">Y</text>
          </g>

          {/* X BUTTON (Blue - Top) */}
          <g>
            <circle cx="305" cy="65" r="13" fill="#2563eb" stroke="#1d4ed8" strokeWidth="2" filter="url(#dropGlow)" />
            <circle cx="305" cy="65" r="13" fill="url(#snesButtonBevel)" />
            <text x="305" y="47" textAnchor="middle" fill="#4b5563" fontSize="8" fontWeight="bold">X</text>
          </g>

          {/* B BUTTON (Yellow - Bottom) */}
          <g>
            <circle cx="305" cy="115" r="13" fill="#ca8a04" stroke="#a16207" strokeWidth="2" filter="url(#dropGlow)" />
            <circle cx="305" cy="115" r="13" fill="url(#snesButtonBevel)" />
            <text x="305" y="138" textAnchor="middle" fill="#4b5563" fontSize="8" fontWeight="bold">B</text>
          </g>

          {/* A BUTTON (Red - Right) */}
          <g>
            <circle cx="335" cy="90" r="13" fill="#dc2626" stroke="#b91c1c" strokeWidth="2" filter="url(#dropGlow)" />
            <circle cx="335" cy="90" r="13" fill="url(#snesButtonBevel)" />
            <text x="355" y="93" fill="#4b5563" fontSize="8" fontWeight="bold">A</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
