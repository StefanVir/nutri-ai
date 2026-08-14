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

  const proteinRemaining = Math.max(0, proteinTarget - consumedProtein);
  const carbsRemaining = Math.max(0, carbsTarget - consumedCarbs);
  const fatRemaining = Math.max(0, fatTarget - consumedFat);

  const proteinPercent = Math.min(100, Math.round((consumedProtein / (proteinTarget || 1)) * 100));
  const carbsPercent = Math.min(100, Math.round((consumedCarbs / (carbsTarget || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((consumedFat / (fatTarget || 1)) * 100));

  return (
    <div className="hero-macro-card animate-fade-in">
      {/* Top Banner: Remaining Energy */}
      <div className="hero-top-row">
        <div className="hero-energy-info">
          <span className="energy-badge">
            <Flame size={14} className="flame-icon-amber" />
            <span>Buget Caloric de Azi</span>
          </span>
          <div className="energy-main-val">
            <span className="num-huge tabular-num">{remainingCalories}</span>
            <span className="unit-label">kcal rămase</span>
          </div>
        </div>

        <div className="energy-target-meta">
          <span className="meta-tag tabular-num">{consumedCalories} / {calorieTarget} kcal</span>
          <span className="meta-pct tabular-num">{calPercent}% consumat</span>
        </div>
      </div>

      {/* Main Energy Bar */}
      <div className="main-energy-track">
        <div
          className="main-energy-fill"
          style={{ width: `${calPercent}%` }}
        />
      </div>

      {/* 3 Macro Cards Grid */}
      <div className="macro-triplet-grid">
        {/* Protein */}
        <div className="macro-card-tile tile-prot">
          <div className="tile-head">
            <div className="tile-label-wrap">
              <Dumbbell size={13} className="text-prot" />
              <span className="tile-name">Proteine</span>
            </div>
            <span className="tile-rem-badge tabular-num">-{proteinRemaining}g</span>
          </div>
          <div className="tile-values tabular-num">
            <strong className="val-main text-prot">{consumedProtein}</strong>
            <span className="val-target">/{proteinTarget}g</span>
          </div>
          <div className="tile-bar-track">
            <div className="tile-bar-fill fill-prot" style={{ width: `${proteinPercent}%` }} />
          </div>
        </div>

        {/* Carbs */}
        <div className="macro-card-tile tile-carb">
          <div className="tile-head">
            <div className="tile-label-wrap">
              <Wheat size={13} className="text-carb" />
              <span className="tile-name">Carbo</span>
            </div>
            <span className="tile-rem-badge tabular-num">-{carbsRemaining}g</span>
          </div>
          <div className="tile-values tabular-num">
            <strong className="val-main text-carb">{consumedCarbs}</strong>
            <span className="val-target">/{carbsTarget}g</span>
          </div>
          <div className="tile-bar-track">
            <div className="tile-bar-fill fill-carb" style={{ width: `${carbsPercent}%` }} />
          </div>
        </div>

        {/* Fat */}
        <div className="macro-card-tile tile-fat">
          <div className="tile-head">
            <div className="tile-label-wrap">
              <Droplet size={13} className="text-fat" />
              <span className="tile-name">Grăsimi</span>
            </div>
            <span className="tile-rem-badge tabular-num">-{fatRemaining}g</span>
          </div>
          <div className="tile-values tabular-num">
            <strong className="val-main text-fat">{consumedFat}</strong>
            <span className="val-target">/{fatTarget}g</span>
          </div>
          <div className="tile-bar-track">
            <div className="tile-bar-fill fill-fat" style={{ width: `${fatPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
