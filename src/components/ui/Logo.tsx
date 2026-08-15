import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  withText?: boolean;
}

export function NutriLogo({ size = 32, className = '', withText = false }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Background Canvas */}
        <rect width="120" height="120" rx="28" fill="#0D121D" />
        <rect width="120" height="120" rx="28" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1.5" />

        {/* Geometric Minimal Monogram N */}
        <path d="M34 86V34" stroke="#10B981" strokeWidth="9" strokeLinecap="round" />
        <path d="M34 38L86 82" stroke="url(#nutri-logo-grad)" strokeWidth="9" strokeLinecap="round" />
        <path d="M86 86V34" stroke="#F59E0B" strokeWidth="9" strokeLinecap="round" />
        <circle cx="60" cy="60" r="4" fill="#FFFFFF" />

        <defs>
          <linearGradient id="nutri-logo-grad" x1="34" y1="38" x2="86" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>
      </svg>

      {withText && (
        <span className="font-extrabold tracking-tight text-white text-base">
          Nutri<span className="text-emerald-400">AI</span>
        </span>
      )}
    </div>
  );
}
