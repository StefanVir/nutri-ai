'use client';

import React from 'react';
import { Flame, Dumbbell, Wheat, Droplet } from 'lucide-react';

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

  const proteinPercent = Math.min(100, Math.round((consumedProtein / (proteinTarget || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedCarbs / (carbsTarget || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((consumedFat / (fatTarget || 1)) * 100));

  const radius = 64;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (calPercent / 100) * circumference;

  return (
    <div className="macro-rings-card">
      <div className="rings-layout">
        {/* Main Calorie Circular Gauge */}
        <div className="circle-gauge-wrap">
          <svg height={radius * 2} width={radius * 2} className="gauge-svg">
            <circle
              stroke="rgba(255, 255, 255, 0.08)"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="url(#calorieGradient)"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="gauge-progress"
            />
            <defs>
              <linearGradient id="calorieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          <div className="gauge-center-content">
            <Flame size={18} className="gauge-flame-icon" />
            <span className="gauge-remaining-val tabular-num">{remainingCalories}</span>
            <span className="gauge-remaining-lbl">RĂMASE AZI</span>
          </div>
        </div>

        {/* Linear Macro Breakdown */}
        <div className="macros-linear-stack">
          {/* Protein */}
          <div className="macro-row macro-row-protein">
            <div className="macro-meta-head">
              <div className="label-with-icon">
                <Dumbbell size={13} className="text-macro-prot" />
                <span className="macro-name">Proteine</span>
              </div>
              <span className="macro-numbers tabular-num">
                <strong>{consumedProtein}</strong> / {proteinTarget}g
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill fill-protein"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="macro-row macro-row-carbs">
            <div className="macro-meta-head">
              <div className="label-with-icon">
                <Wheat size={13} className="text-macro-carb" />
                <span className="macro-name">Carbohidrați</span>
              </div>
              <span className="macro-numbers tabular-num">
                <strong>{consumedCarbs}</strong> / {carbsTarget}g
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill fill-carbs"
                style={{ width: `${carbsPercent}%` }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="macro-row macro-row-fat">
            <div className="macro-meta-head">
              <div className="label-with-icon">
                <Droplet size={13} className="text-macro-fat" />
                <span className="macro-name">Grăsimi</span>
              </div>
              <span className="macro-numbers tabular-num">
                <strong>{consumedFat}</strong> / {fatTarget}g
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill fill-fat"
                style={{ width: `${fatPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Targets Bar */}
      <div className="card-footer-stats">
        <div className="stat-sub-item">
          <span className="stat-lbl">Țintă Totală</span>
          <span className="stat-val tabular-num">{calorieTarget} kcal</span>
        </div>
        <div className="stat-sub-divider" />
        <div className="stat-sub-item">
          <span className="stat-lbl">Consumat</span>
          <span className="stat-val tabular-num">{consumedCalories} kcal</span>
        </div>
        <div className="stat-sub-divider" />
        <div className="stat-sub-item">
          <span className="stat-lbl">Progres</span>
          <span className="stat-val tabular-num text-amber">{calPercent}%</span>
        </div>
      </div>

      <style jsx>{`
        .macro-rings-card {
          background: linear-gradient(160deg, #131b2e 0%, #0d1322 100%);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-xl);
          padding: 16px 18px 14px 18px;
          margin-bottom: 16px;
          box-shadow: var(--shadow-md);
        }

        .rings-layout {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-bottom: 14px;
        }

        .circle-gauge-wrap {
          position: relative;
          width: 128px;
          height: 128px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gauge-svg {
          transform: rotate(-90deg);
        }

        .gauge-progress {
          transition: stroke-dashoffset 0.6s var(--ease-out-smooth);
        }

        .gauge-center-content {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        :global(.gauge-flame-icon) {
          color: var(--macro-calories);
          margin-bottom: 2px;
        }

        .gauge-remaining-val {
          font-size: 1.55rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1;
        }

        .gauge-remaining-lbl {
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--text-tertiary);
          margin-top: 3px;
        }

        .macros-linear-stack {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .macro-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .macro-meta-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.76rem;
        }

        .label-with-icon {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        :global(.text-macro-prot) { color: var(--macro-protein); }
        :global(.text-macro-carb) { color: var(--macro-carbs); }
        :global(.text-macro-fat) { color: var(--macro-fat); }

        .macro-name {
          font-weight: 700;
          color: var(--text-secondary);
        }

        .macro-numbers {
          color: var(--text-tertiary);
          font-size: 0.74rem;
        }

        .macro-numbers strong {
          color: var(--text-primary);
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: var(--radius-full);
          transition: width 0.5s var(--ease-out-smooth);
        }

        .fill-protein { background: var(--macro-protein); }
        .fill-carbs { background: var(--macro-carbs); }
        .fill-fat { background: var(--macro-fat); }

        .card-footer-stats {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding-top: 10px;
          border-top: 1px solid var(--border-subtle);
        }

        .stat-sub-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .stat-lbl {
          font-size: 0.65rem;
          color: var(--text-tertiary);
          font-weight: 600;
        }

        .stat-val {
          font-size: 0.84rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        :global(.text-amber) {
          color: var(--macro-calories);
        }

        .stat-sub-divider {
          width: 1px;
          height: 20px;
          background: var(--border-subtle);
        }
      `}</style>
    </div>
  );
}
