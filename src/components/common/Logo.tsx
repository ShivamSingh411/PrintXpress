import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link to="/" className="flex items-center gap-2.5 group select-none">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center`}>
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-[#FFCC00] rounded-xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* Custom Printer & Paper SVG Icon */}
        <div className="relative w-full h-full bg-[#131B23] border border-[#29333E] rounded-xl flex items-center justify-center p-1.5 shadow-lg group-hover:border-[#FFCC00]/50 transition-colors duration-200">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {/* Paper coming out from top */}
            <path
              d="M10 4C10 3.44772 10.4477 3 11 3H21C21.5523 3 22 3.44772 22 4V9H10V4Z"
              fill="#F7F8FA"
              opacity="0.9"
            />
            {/* Paper content lines */}
            <line x1="13" y1="5.5" x2="19" y2="5.5" stroke="#131B23" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="13" y1="7.5" x2="17" y2="7.5" stroke="#131B23" strokeWidth="1.2" strokeLinecap="round" />

            {/* Printer Main Body */}
            <rect
              x="5"
              y="9"
              width="22"
              height="14"
              rx="3"
              fill="#18232F"
              stroke="#FFCC00"
              strokeWidth="1.5"
            />

            {/* Print status LED */}
            <circle cx="8.5" cy="12.5" r="1.2" fill="#22C55E" />
            <circle cx="11.5" cy="12.5" r="1.2" fill="#FFCC00" />

            {/* Laser output paper tray */}
            <rect
              x="8"
              y="18"
              width="16"
              height="10"
              rx="1.5"
              fill="#FFCC00"
            />
            {/* Print lines on bottom paper */}
            <line x1="11" y1="21" x2="21" y2="21" stroke="#0B1016" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="11" y1="23.5" x2="19" y2="23.5" stroke="#0B1016" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="11" y1="26" x2="16" y2="26" stroke="#0B1016" strokeWidth="1.3" strokeLinecap="round" />

            {/* Speed spark line */}
            <path
              d="M23 13.5L25 15.5L23 17.5"
              stroke="#FFCC00"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`font-black tracking-tight ${textSizes[size]} leading-none`}>
          <span className="text-white">Print</span>
          <span className="text-[#FFCC00]">Xpress</span>
        </div>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase font-semibold text-[#A7B0BB] mt-0.5">
            Campus Print & Stationery
          </span>
        )}
      </div>
    </Link>
  );
};
