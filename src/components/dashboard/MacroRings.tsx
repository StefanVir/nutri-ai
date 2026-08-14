'use client';

import React from 'react';
import { Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';

interface MacroRingsProps {
  calorieTarget: number;
  consumedCalories: number;
  proteinTarget: number;
  consumedProtein: number;
  carbsTarget: number;
  consumedCarbs: number;
  fatTarget: number;
  consumedFat: number;
}

export function MacroRings({
  calorieTarget,
  consumedCalories,
  proteinTarget,
  consumedProtein,
  carbsTarget,
  consumedCarbs,
  fatTarget,
  consumedFat,
}: MacroRingsProps) {
  const remainingCalories = Math.max(0, calorieTarget - consumedCalories);
  const calPercent = Math.min(100, Math.round((consumedCalories / (calorieTarget || 1)) * 100));

  // Circular progress math
  const size = 150;
  const strokeWidth = 11;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  const proteinPercent = Math.min(100, Math.round((consumedProtein / (proteinTarget || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedCarbs / (carbsTarget || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((consumedFat / (fatTarget || 1)) * 100));

  return (
    <div className="macro-rings-card animate-fade-in">
      <div className="rings-layout">
        {/* Main Calorie Circular Gauge */}
        <div className="circle-gauge-wrap">
          <svg width={size} height={size} className="gauge-svg">
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Active Calorie Ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#calorieGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
            />
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          <div className="circle-content">
            <span className="circle-rem-label">RĂMASE AZI</span>
            <div className="circle-calories tabular-num">{remainingCalories}</div>
            <span className="circle-unit">kcal</span>
          </div>
        </div>

        {/* Macro Bars Breakdown */}
        <div className="macro-bars-stack">
          {/* Protein */}
          <div className="macro-bar-item">
            <div className="bar-meta">
              <div className="macro-title-icon">
                <Dumbbell size={14} className="icon-protein" />
                <span className="macro-name">Proteine</span>
              </div>
              <span className="macro-numbers tabular-num">
                <strong>{consumedProtein}</strong> / {proteinTarget}g
              </span>
            </div>
            <div className="bar-track">
              <div className="bar-fill bar-protein" style={{ width: `${proteinPercent}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="macro-bar-item">
            <div className="bar-meta">
              <div className="macro-title-icon">
                <Wheat size={14} className="icon-carbs" />
                <span className="macro-name">Carbohidrați</span>
              </div>
              <span className="macro-numbers tabular-num">
                <strong>{consumedCarbs}</strong> / {carbsTarget}g
              </span>
            </div>
            <div className="bar-track">
              <div className="bar-fill bar-carbs" style={{ width: `${carbsPercent}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div className="macro-bar-item">
            <div className="bar-meta">
              <div className="macro-title-icon">
                <Droplets size={14} className="icon-fat" />
                <span className="macro-name">Grăsimi</span>
              </div>
              <span className="macro-numbers tabular-num">
                <strong>{consumedFat}</strong> / {fatTarget}g
              </span>
            </div>
            <div className="bar-track">
              <div className="bar-fill bar-fat" style={{ width: `${fatPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="calorie-footer-stats">
        <div className="foot-stat">
          <span className="foot-label">Consumat</span>
          <strong className="foot-val tabular-num">{consumedCalories} kcal</strong>
        </div>
        <div className="foot-divider" />
        <div className="foot-stat">
          <span className="foot-label">Țintă Zilnică</span>
          <strong className="foot-val tabular-num">{calorieTarget} kcal</strong>
        </div>
        <div className="foot-divider" />
        <div className="foot-stat">
          <span className="foot-label">Progres</span>
          <strong className="foot-val tabular-num">{calPercent}%</strong>
        </div>
      </div>

      <style jsx>{`
        .macro-rings-card {
          background: linear-gradient(155deg, #162036 0%, #0e1526 100%);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 16px 14px;
          margin-bottom: 16px;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.45);
        }

        .rings-layout {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }

        .circle-gauge-wrap {
          position: relative;
          width: 150px;
          height: 150px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg {
          transform: rotate(-90deg);
        }

        .circle-content {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .circle-rem-label {
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          color: var(--text-tertiary);
        }

        .circle-calories {
          font-size: 1.85rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1;
          margin: 2px 0;
        }

        .circle-unit {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .macro-bars-stack {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .macro-bar-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bar-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
        }

        .macro-title-icon {
          display: flex;
          align-items: center;
          gap: 5px;
          font-weight: 700;
          color: var(--text-primary);
        }

        :global(.icon-protein) {
          color: var(--macro-protein);
        }

        :global(.icon-carbs) {
          color: var(--macro-carbs);
        }

        :global(.icon-fat) {
          color: var(--macro-fat);
        }

        .macro-numbers {
          color: var(--text-secondary);
          font-size: 0.75rem;
        }

        .macro-numbers strong {
          color: var(--text-primary);
        }

        .bar-track {
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s var(--ease-out-smooth);
        }

        .bar-protein {
          background: var(--macro-protein);
        }

        .bar-carbs {
          background: var(--macro-carbs);
        }

        .bar-fat {
          background: var(--macro-fat);
        }

        .calorie-footer-stats {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding-top: 12px;
          border-top: 1px solid var(--border-subtle);
        }

        .foot-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .foot-label {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .foot-val {
          font-size: 0.85rem;
          color: var(--text-primary);
          font-weight: 700;
        }

        .foot-divider {
          width: 1px;
          height: 20px;
          background: var(--border-subtle);
        }
      `}</style>
    </div>
  );
}
