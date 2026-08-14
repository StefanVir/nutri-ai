'use client';

import React, { useState } from 'react';
import { UserProfile, Gender, Goal, ActivityLevel } from '@/types/nutrition';
import {
  calculateMetabolicTargets,
  ACTIVITY_LABELS,
  GOAL_LABELS,
  DEFAULT_APPLIANCES,
} from '@/lib/metabolic';
import { Sparkles, ArrowRight, ArrowLeft, Check, Flame, ShieldCheck } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Alex');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState(24);
  const [heightCm, setHeightCm] = useState(180);
  const [weightKg, setWeightKg] = useState(82);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('cut');
  const [selectedAppliances, setSelectedAppliances] = useState<string[]>([
    'Airfryer / Friteuză cu aer cald',
    'Aragaz / Plită / Tigaie',
  ]);

  const totalSteps = 5;

  const targets = calculateMetabolicTargets(gender, age, heightCm, weightKg, activityLevel, goal);

  const toggleAppliance = (applianceName: string) => {
    if (selectedAppliances.includes(applianceName)) {
      setSelectedAppliances(selectedAppliances.filter((a) => a !== applianceName));
    } else {
      setSelectedAppliances([...selectedAppliances, applianceName]);
    }
  };

  const handleFinish = () => {
    const profile: UserProfile = {
      name,
      gender,
      age,
      heightCm,
      weightKg,
      activityLevel,
      goal,
      calorieTarget: targets.targetCalories,
      proteinTarget: targets.proteinGrams,
      carbsTarget: targets.carbsGrams,
      fatTarget: targets.fatGrams,
      appliances: selectedAppliances,
      dietaryRestrictions: [],
      hasCompletedOnboarding: true,
    };
    onComplete(profile);
  };

  return (
    <div className="onboarding-wrapper animate-fade-in">
      {/* Header & Step Indicator */}
      <div className="onboarding-header">
        <div className="brand-badge">
          <Sparkles size={16} className="brand-icon" />
          <span>NutriAI Metabolic Engine</span>
        </div>
        <div className="step-bar-wrap">
          <div className="step-bar-fill" style={{ width: `${(step / totalSteps) * 100}%` }} />
        </div>
        <div className="step-counter">Pasul {step} din {totalSteps}</div>
      </div>

      {/* Step 1: Nume & Sex */}
      {step === 1 && (
        <div className="step-content animate-fade-in">
          <h2 className="step-title">Hai să ne cunoaștem</h2>
          <p className="step-subtitle">Cum te cheamă și care este sexul tău biologic pentru calibrarea metabolică?</p>

          <div className="form-group">
            <label className="input-label">Prenumele tău</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-input"
              placeholder="ex: Ștefan / Alex"
            />
          </div>

          <div className="form-group">
            <label className="input-label">Sex biologic</label>
            <div className="grid-2">
              <button
                type="button"
                className={`choice-card ${gender === 'male' ? 'selected' : ''}`}
                onClick={() => setGender('male')}
              >
                <div className="choice-title">Băiat 🏃‍♂️</div>
                <div className="choice-desc">Formula metabolică ms-jeor (male)</div>
              </button>

              <button
                type="button"
                className={`choice-card ${gender === 'female' ? 'selected' : ''}`}
                onClick={() => setGender('female')}
              >
                <div className="choice-title">Fată 🏃‍♀️</div>
                <div className="choice-desc">Formula metabolică ms-jeor (female)</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Biometrice */}
      {step === 2 && (
        <div className="step-content animate-fade-in">
          <h2 className="step-title">Datele tale biometrice</h2>
          <p className="step-subtitle">Necesar pentru calculul exact al ratei metabolice bazale (BMR).</p>

          <div className="metrics-grid">
            <div className="metric-box">
              <span className="metric-label">Vârstă</span>
              <div className="metric-input-wrap">
                <input
                  type="number"
                  min="14"
                  max="90"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="metric-input"
                />
                <span className="metric-unit">ani</span>
              </div>
            </div>

            <div className="metric-box">
              <span className="metric-label">Înălțime</span>
              <div className="metric-input-wrap">
                <input
                  type="number"
                  min="130"
                  max="220"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="metric-input"
                />
                <span className="metric-unit">cm</span>
              </div>
            </div>

            <div className="metric-box">
              <span className="metric-label">Greutate</span>
              <div className="metric-input-wrap">
                <input
                  type="number"
                  min="35"
                  max="200"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="metric-input"
                />
                <span className="metric-unit">kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Activitate & Obiectiv */}
      {step === 3 && (
        <div className="step-content animate-fade-in">
          <h2 className="step-title">Nivel de activitate & Obiectiv</h2>
          <p className="step-subtitle">Cât de des te antrenezi și ce vrei să obții?</p>

          <label className="input-label">Nivel de activitate zilnică</label>
          <div className="stack-options">
            {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`option-row ${activityLevel === key ? 'selected' : ''}`}
                onClick={() => setActivityLevel(key)}
              >
                <div className="option-text">
                  <span className="option-title">{ACTIVITY_LABELS[key].title}</span>
                  <span className="option-desc">{ACTIVITY_LABELS[key].desc}</span>
                </div>
                {activityLevel === key && <Check size={18} className="check-icon" />}
              </button>
            ))}
          </div>

          <label className="input-label" style={{ marginTop: '16px' }}>Obiectivul tău principal</label>
          <div className="stack-options">
            {(Object.keys(GOAL_LABELS) as Goal[]).map((key) => (
              <button
                key={key}
                type="button"
                className={`option-row ${goal === key ? 'selected' : ''}`}
                onClick={() => setGoal(key)}
              >
                <div className="option-text">
                  <div className="title-with-pill">
                    <span className="option-title">{GOAL_LABELS[key].title}</span>
                    <span className="delta-pill">{GOAL_LABELS[key].delta}</span>
                  </div>
                  <span className="option-desc">{GOAL_LABELS[key].desc}</span>
                </div>
                {goal === key && <Check size={18} className="check-icon" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Echipamente Bucătărie */}
      {step === 4 && (
        <div className="step-content animate-fade-in">
          <h2 className="step-title">Ce ai în bucătărie?</h2>
          <p className="step-subtitle">AI-ul va genera rețete adaptate doar aparatelor pe care le deții.</p>

          <div className="stack-options">
            {DEFAULT_APPLIANCES.map((app) => {
              const isSelected = selectedAppliances.includes(app.name);
              return (
                <button
                  key={app.id}
                  type="button"
                  className={`option-row ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggleAppliance(app.name)}
                >
                  <div className="option-text">
                    <span className="option-title">{app.name}</span>
                  </div>
                  <div className={`checkbox-custom ${isSelected ? 'checked' : ''}`}>
                    {isSelected && <Check size={14} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 5: Rezumat Metabolic & Confirmare */}
      {step === 5 && (
        <div className="step-content animate-fade-in">
          <div className="target-card">
            <div className="target-header">
              <Flame size={22} className="flame-icon" />
              <div>
                <span className="target-badge">Profil Metabolic Calculat</span>
                <h3 className="target-calories tabular-num">{targets.targetCalories} <span className="kcal-unit">kcal/zi</span></h3>
              </div>
            </div>

            <div className="target-stats-grid">
              <div className="stat-pill stat-protein">
                <span className="stat-name">Proteine</span>
                <strong className="stat-val tabular-num">{targets.proteinGrams}g</strong>
              </div>
              <div className="stat-pill stat-carbs">
                <span className="stat-name">Carbohidrați</span>
                <strong className="stat-val tabular-num">{targets.carbsGrams}g</strong>
              </div>
              <div className="stat-pill stat-fat">
                <span className="stat-name">Grăsimi</span>
                <strong className="stat-val tabular-num">{targets.fatGrams}g</strong>
              </div>
            </div>

            <div className="target-meta">
              <span>BMR: {targets.bmr} kcal</span>
              <span>•</span>
              <span>TDEE: {targets.tdee} kcal</span>
              <span>•</span>
              <span>Țintă: {GOAL_LABELS[goal].title}</span>
            </div>
          </div>

          <div className="summary-bullets">
            <div className="bullet-item">
              <ShieldCheck size={18} className="bullet-icon" />
              <span>Calcul adaptat pentru <strong>{name}</strong> ({weightKg} kg, {heightCm} cm).</span>
            </div>
            <div className="bullet-item">
              <Sparkles size={18} className="bullet-icon" />
              <span>The Swipe Machine va genera mese optimizate pentru <strong>Airfryer & plită</strong>.</span>
            </div>
          </div>
        </div>
      )}

      {/* Action Navigation Footer */}
      <div className="onboarding-actions">
        {step > 1 && (
          <button
            type="button"
            className="btn-back"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft size={18} />
            <span>Înapoi</span>
          </button>
        )}

        {step < totalSteps ? (
          <button
            type="button"
            className="btn-next"
            onClick={() => setStep(step + 1)}
          >
            <span>Continuă</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            type="button"
            className="btn-finish"
            onClick={handleFinish}
          >
            <Sparkles size={18} />
            <span>Activează NutriAI</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .onboarding-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          padding: 24px 18px;
          background: radial-gradient(circle at 50% 0%, #172138 0%, var(--bg-surface) 75%);
        }

        .onboarding-header {
          margin-bottom: 24px;
        }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          background: rgba(99, 102, 241, 0.12);
          border: 1px solid rgba(99, 102, 241, 0.25);
          border-radius: var(--radius-full);
          color: #a5b4fc;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        :global(.brand-icon) {
          color: #818cf8;
        }

        .step-bar-wrap {
          height: 4px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 6px;
        }

        .step-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-primary) 0%, var(--macro-calories) 100%);
          transition: width var(--duration-normal) var(--ease-out-smooth);
        }

        .step-counter {
          font-size: 0.75rem;
          color: var(--text-tertiary);
          font-weight: 600;
        }

        .step-content {
          flex: 1;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 6px;
        }

        .step-subtitle {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 22px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .input-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }

        .text-input {
          width: 100%;
          padding: 14px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 1rem;
          color: var(--text-primary);
          transition: border-color var(--duration-fast);
        }

        .text-input:focus {
          border-color: var(--accent-primary);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .choice-card {
          padding: 16px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          text-align: left;
          transition: all var(--duration-fast) var(--ease-out-smooth);
        }

        .choice-card:hover {
          background: var(--bg-card-hover);
        }

        .choice-card.selected {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.12);
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.25);
        }

        .choice-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .choice-desc {
          font-size: 0.72rem;
          color: var(--text-tertiary);
          line-height: 1.3;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .metric-box {
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metric-label {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .metric-input-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .metric-input {
          width: 76px;
          text-align: right;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-sm);
          padding: 8px 10px;
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .metric-unit {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-tertiary);
          width: 26px;
        }

        .stack-options {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .option-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          text-align: left;
          transition: all var(--duration-fast);
        }

        .option-row.selected {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.1);
        }

        .option-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .title-with-pill {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .option-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .delta-pill {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 1px 6px;
          border-radius: var(--radius-full);
          background: var(--macro-calories-bg);
          color: var(--macro-calories);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .option-desc {
          font-size: 0.76rem;
          color: var(--text-tertiary);
        }

        .check-icon {
          color: var(--accent-primary);
        }

        .checkbox-custom {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 1px solid var(--border-bright);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
        }

        .checkbox-custom.checked {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
        }

        .target-card {
          background: linear-gradient(145deg, #18243e 0%, #111a2e 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-lg);
          padding: 20px;
          margin-bottom: 18px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
        }

        .target-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        :global(.flame-icon) {
          color: var(--macro-calories);
        }

        .target-badge {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-tertiary);
        }

        .target-calories {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1;
        }

        .kcal-unit {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .target-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 14px;
        }

        .stat-pill {
          padding: 10px 8px;
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-name {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .stat-val {
          font-size: 1.15rem;
          font-weight: 800;
        }

        .stat-protein {
          background: var(--macro-protein-bg);
          color: var(--macro-protein);
          border: 1px solid rgba(16, 185, 129, 0.25);
        }

        .stat-carbs {
          background: var(--macro-carbs-bg);
          color: var(--macro-carbs);
          border: 1px solid rgba(6, 182, 212, 0.25);
        }

        .stat-fat {
          background: var(--macro-fat-bg);
          color: var(--macro-fat);
          border: 1px solid rgba(244, 63, 94, 0.25);
        }

        .target-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 0.75rem;
          color: var(--text-tertiary);
          border-top: 1px solid var(--border-subtle);
          padding-top: 10px;
        }

        .summary-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .bullet-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.84rem;
          color: var(--text-secondary);
          background: var(--bg-card);
          padding: 12px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-subtle);
        }

        :global(.bullet-icon) {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .onboarding-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 14px 18px;
          background: var(--bg-card);
          color: var(--text-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-weight: 700;
        }

        .btn-next, .btn-finish {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 20px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          font-weight: 700;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.4);
          transition: transform var(--duration-fast), box-shadow var(--duration-fast);
        }

        .btn-next:hover, .btn-finish:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 22px rgba(99, 102, 241, 0.55);
        }
      `}</style>
    </div>
  );
}
