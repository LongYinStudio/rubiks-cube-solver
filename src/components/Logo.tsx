import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center flex-shrink-0 cursor-pointer ${className}`}
    >
      <svg
        viewBox="0 0 256 256"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_8px_16px_rgba(99,102,241,0.35)]"
      >
        <defs>
          {/* Background Glow */}
          <radialGradient id="logoBgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </radialGradient>

          {/* Top White Gradient */}
          <linearGradient id="logoTopGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </linearGradient>

          {/* Drop Shadow */}
          <filter id="logoShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.5" />
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Ambient Backdrop Glow */}
        <circle cx="128" cy="130" r="108" fill="url(#logoBgGlow)" />

        {/* Cube Group */}
        <g filter="url(#logoShadow)">
          {/* Core Black Housing */}
          <polygon
            points="128,34 220,87 220,189 128,242 36,189 36,87"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* TOP FACE STICKERS (White/Silver) */}
          <polygon points="128,126.8 151.8,113.1 128,99.3 104.2,113.1" fill="#ffffff" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="100.3,110.8 124.1,97.1 100.3,83.3 76.5,97.1" fill="#f8fafc" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="72.6,94.8 96.4,81.1 72.6,67.3 48.8,81.1" fill="#ffffff" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="155.7,110.8 179.5,97.1 155.7,83.3 131.9,97.1" fill="#f1f5f9" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="128,94.8 151.8,81.1 128,67.3 104.2,81.1" fill="#ffffff" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="100.3,78.8 124.1,65.1 100.3,51.3 76.5,65.1" fill="#e2e8f0" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="183.4,94.8 207.2,81.1 183.4,67.3 159.6,81.1" fill="#ffffff" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="155.7,78.8 179.5,65.1 155.7,51.3 131.9,65.1" fill="#f8fafc" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="128,62.8 151.8,49.1 128,35.3 104.2,49.1" fill="#f1f5f9" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />

          {/* LEFT FACE STICKERS (Vibrant Red & Orange) */}
          <polygon points="125.2,131.6 101.4,117.9 101.4,145.4 125.2,159.1" fill="#ef4444" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="125.2,163.6 101.4,149.9 101.4,177.4 125.2,191.1" fill="#f97316" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="125.2,195.6 101.4,181.9 101.4,209.4 125.2,223.1" fill="#ef4444" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="97.5,115.6 73.7,101.9 73.7,129.4 97.5,143.1" fill="#ea580c" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="97.5,147.6 73.7,133.9 73.7,161.4 97.5,175.1" fill="#dc2626" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="97.5,179.6 73.7,165.9 73.7,193.4 97.5,207.1" fill="#f97316" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="69.8,99.6 46,85.9 46,113.4 69.8,127.1" fill="#dc2626" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="69.8,131.6 46,117.9 46,145.4 69.8,159.1" fill="#ea580c" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="69.8,163.6 46,149.9 46,177.4 69.8,191.1" fill="#ef4444" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />

          {/* RIGHT FACE STICKERS (Vibrant Blue & Electric Indigo) */}
          <polygon points="130.8,131.6 154.6,117.9 154.6,145.4 130.8,159.1" fill="#3b82f6" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="130.8,163.6 154.6,149.9 154.6,177.4 130.8,191.1" fill="#2563eb" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="130.8,195.6 154.6,181.9 154.6,209.4 130.8,223.1" fill="#1d4ed8" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="158.5,115.6 182.3,101.9 182.3,129.4 158.5,143.1" fill="#2563eb" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="158.5,147.6 182.3,133.9 182.3,161.4 158.5,175.1" fill="#1d4ed8" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="158.5,179.6 182.3,165.9 182.3,193.4 158.5,207.1" fill="#3b82f6" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="186.2,99.6 210,85.9 210,113.4 186.2,127.1" fill="#1d4ed8" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="186.2,131.6 210,117.9 210,145.4 186.2,159.1" fill="#3b82f6" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />
          <polygon points="186.2,163.6 210,149.9 210,177.4 186.2,191.1" fill="#2563eb" stroke="#090d16" strokeWidth="2" strokeLinejoin="round" />

          {/* Sparkle Diamond Accent */}
          <path
            d="M 188 52 Q 188 64 200 64 Q 188 64 188 76 Q 188 64 176 64 Q 188 64 188 52 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          <circle cx="188" cy="64" r="1.8" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
