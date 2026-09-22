import React from 'react';

interface JoystickProps {
  className?: string;
  isInteractive?: boolean;
}

export const N64Joystick: React.FC<JoystickProps> = ({ className = '', isInteractive = true }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 230"
        className="w-full h-auto drop-shadow-xl transition-transform duration-300 hover:scale-[1.02]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="n64Grey" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <radialGradient id="n64Stick" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="70%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </radialGradient>
          <linearGradient id="n64ButtonShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Cable */}
        <path d="M 200 20 L 200 0" stroke="#334155" strokeWidth="10" strokeLinecap="round" />
        <rect x="192" y="15" width="16" height="12" rx="3" fill="#1e293b" />

        {/* L and R Shoulders */}
        <path d="M 75 35 C 100 26, 130 28, 150 35" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
        <text x="110" y="32" fill="#475569" fontSize="6" fontWeight="bold">L</text>
        <path d="M 250 35 C 270 28, 300 26, 325 35" stroke="#94a3b8" strokeWidth="8" strokeLinecap="round" />
        <text x="285" y="32" fill="#475569" fontSize="6" fontWeight="bold">R</text>

        {/* 3-Prong Trident N64 Body */}
        <path
          d="M 120 38 
             C 160 30, 240 30, 280 38 
             C 330 45, 365 75, 370 120 
             C 375 165, 350 220, 320 220 
             C 295 220, 285 180, 275 135 
             C 265 125, 250 115, 235 120 
             C 230 160, 225 225, 200 225 
             C 175 225, 170 160, 165 120 
             C 150 115, 135 125, 125 135 
             C 115 180, 105 220, 80 220 
             C 50 220, 25 165, 30 120 
             C 35 75, 70 45, 120 38 Z"
          fill="url(#n64Grey)"
          stroke="#64748b"
          strokeWidth="2"
        />

        {/* N64 3D Jewel Logo Center Top */}
        <g transform="translate(193, 44) scale(0.65)">
          <path d="M0 5 L10 0 L20 5 L20 16 L10 21 L0 16 Z" fill="#2563eb" />
          <path d="M10 0 L20 5 L10 10 L0 5 Z" fill="#ef4444" />
          <path d="M10 10 L20 5 L20 16 L10 21 Z" fill="#22c55e" />
          <path d="M0 5 L10 10 L10 21 L0 16 Z" fill="#eab308" />
        </g>

        {/* D-PAD on Left Prong */}
        <g id="n64-dpad" className={isInteractive ? 'cursor-pointer' : ''}>
          <rect x="71" y="65" width="18" height="54" rx="3" fill="#1e293b" />
          <rect x="53" y="83" width="54" height="18" rx="3" fill="#1e293b" />
          <circle cx="80" cy="92" r="5" fill="#0f172a" />
          <polygon points="80,69 76,74 84,74" fill="#64748b" />
          <polygon points="80,115 76,110 84,110" fill="#64748b" />
          <polygon points="57,92 62,88 62,96" fill="#64748b" />
          <polygon points="103,92 98,88 98,96" fill="#64748b" />
        </g>

        {/* CENTER PRONG: Analog Stick & Start */}
        <g id="n64-center">
          {/* Red START Button */}
          <circle cx="200" cy="74" r="9" fill="#dc2626" stroke="#991b1b" strokeWidth="1.5" className={isInteractive ? 'cursor-pointer' : ''} />
          <circle cx="200" cy="74" r="9" fill="url(#n64ButtonShine)" />
          <text x="200" y="88" textAnchor="middle" fill="#64748b" fontSize="5" fontWeight="bold">START</text>

          {/* Octagonal Gate Recess for Analog */}
          <polygon
            points="188,110 212,110 225,123 225,147 212,160 188,160 175,147 175,123"
            fill="#475569"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* Analog Thumbstick Head with concentric grip rings */}
          <circle cx="200" cy="135" r="16" fill="url(#n64Stick)" stroke="#334155" strokeWidth="1.5" className={isInteractive ? 'cursor-pointer' : ''} />
          <circle cx="200" cy="135" r="11" fill="none" stroke="#64748b" strokeWidth="1" />
          <circle cx="200" cy="135" r="6" fill="none" stroke="#64748b" strokeWidth="1" />
          <circle cx="200" cy="135" r="2.5" fill="#334155" />
        </g>

        {/* RIGHT PRONG: A, B, and 4 Yellow C Buttons */}
        <g id="n64-buttons" className={isInteractive ? 'cursor-pointer' : ''}>
          {/* B BUTTON (Green) */}
          <g>
            <circle cx="280" cy="120" r="10" fill="#16a34a" stroke="#15803d" strokeWidth="1.5" />
            <circle cx="280" cy="120" r="10" fill="url(#n64ButtonShine)" />
            <text x="280" y="124" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="900">B</text>
          </g>

          {/* A BUTTON (Blue) */}
          <g>
            <circle cx="304" cy="136" r="12" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.5" />
            <circle cx="304" cy="136" r="12" fill="url(#n64ButtonShine)" />
            <text x="304" y="140" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">A</text>
          </g>

          {/* 4 YELLOW C BUTTONS (Diamond Cluster) */}
          <g transform="translate(325, 80)">
            <circle cx="0" cy="0" r="25" fill="#64748b" opacity="0.15" />

            {/* C-UP */}
            <g>
              <circle cx="0" cy="-14" r="7.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
              <polygon points="0,-17 -3,-12 3,-12" fill="#713f12" />
            </g>

            {/* C-DOWN */}
            <g>
              <circle cx="0" cy="14" r="7.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
              <polygon points="0,17 -3,12 3,12" fill="#713f12" />
            </g>

            {/* C-LEFT */}
            <g>
              <circle cx="-14" cy="0" r="7.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
              <polygon points="-17,0 -12,-3 -12,3" fill="#713f12" />
            </g>

            {/* C-RIGHT */}
            <g>
              <circle cx="14" cy="0" r="7.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
              <polygon points="17,0 12,-3 12,3" fill="#713f12" />
            </g>

            {/* Center C letter */}
            <text x="0" y="3" textAnchor="middle" fill="#713f12" fontSize="7" fontWeight="900">C</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
