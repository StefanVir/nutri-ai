'use client';

import React, { useState } from 'react';
import { UserProfile, Goal, ActivityLevel, Gender } from '@/types/nutrition';
import { calculateMetabolicTargets, DEFAULT_APPLIANCES } from '@/lib/metabolic';
import { Sparkles, ArrowRight, ArrowLeft, Check, Flame, ShieldCheck, Dumbbell, Zap, Heart } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState<number>(1);

  // Form State
  const [name, setName] = useState<string>('Alex');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<number>(24);
  const [weightKg, setWeightKg] = useState<number>(82);
  const [heightCm, setHeightCm] = useState<number>(180);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goal, setGoal] = useState<Goal>('cut');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(['High Protein']);
  const [appliances, setAppliances] = useState<string[]>(['Airfryer / Friteuză cu aer cald', 'Aragaz / Tigaie']);

  // Computed Live Targets
  const metabolicPlan = calculateMetabolicTargets(
    gender,
    age,
    heightCm,
    weightKg,
    activityLevel,
    goal
  );

  const handleFinish = () => {
    const profile: UserProfile = {
      id: 'local-user-' + Date.now(),
      name,
      gender,
      age,
      weightKg,
      heightCm,
      activityLevel,
      goal,
      dietaryRestrictions,
      appliances,
      calorieTarget: metabolicPlan.targetCalories,
      proteinTarget: metabolicPlan.proteinGrams,
      carbsTarget: metabolicPlan.carbsGrams,
      fatTarget: metabolicPlan.fatGrams,
      hasCompletedOnboarding: true,
    };
    onComplete(profile);
  };

  const toggleDiet = (diet: string) => {
    setDietaryRestrictions((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  const toggleAppliance = (app: string) => {
    setAppliances((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  return (
    <div className="onboarding-card animate-fade-in">
      {/* Step Progress Tracker */}
      <div className="step-tracker">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className={`step-bar ${s <= step ? 'active' : ''}`} />
        ))}
      </div>

      {/* Step 1: Gender & Goal */}
      {step === 1 && (
        <div className="step-content animate-slide-up">
          <div className="step-header">
            <h2 className="step-title">Care este profilul și obiectivul tău?</h2>
            <p className="step-desc">
              Vom calibra motorul metabolic pentru a genera mese optimizate exact pentru corpul tău.
            </p>
          </div>

          <div className="section-group">
            <span className="field-label">Sex biologic:</span>
            <div className="grid-2">
              <button
                type="button"
                className={`choice-card ${gender === 'male' ? 'selected' : ''}`}
                onClick={() => setGender('male')}
              >
                <div className="choice-icon-wrap">
                  <Dumbbell size={18} />
                </div>
                <strong className="choice-title">Bărbat</strong>
                <span className="choice-desc">Formula BMR adaptată</span>
              </button>

              <button
                type="button"
                className={`choice-card ${gender === 'female' ? 'selected' : ''}`}
                onClick={() => setGender('female')}
              >
                <div className="choice-icon-wrap">
                  <Heart size={18} />
                </div>
                <strong className="choice-title">Femeie</strong>
                <span className="choice-desc">Formula BMR adaptată</span>
              </button>
            </div>
          </div>

          <div className="section-group">
            <span className="field-label">Obiectivul principal:</span>
            <div className="stack-options">
              {[
                { id: 'cut', label: 'Slăbire / Deficit Caloric', desc: '-400 kcal deficit moderat & ardere grăsimi', delta: '-400 kcal' },
                { id: 'maintain', label: 'Menținere & Tonifiere', desc: 'Echilibru energetic perfect și energie stabilă', delta: '0 kcal' },
                { id: 'bulk', label: 'Creștere Masă Musculară', desc: '+350 kcal surplus curat pentru hipertrofie', delta: '+350 kcal' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`option-row ${goal === item.id ? 'selected' : ''}`}
                  onClick={() => setGoal(item.id as Goal)}
                >
                  <div className="option-text">
                    <div className="title-with-pill">
                      <strong className="option-title">{item.label}</strong>
                      <span className="delta-pill tabular-num">{item.delta}</span>
                    </div>
                    <span className="option-desc">{item.desc}</span>
                  </div>
                  {goal === item.id && <Check size={18} className="check-icon" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Biometrics */}
      {step === 2 && (
        <div className="step-content animate-slide-up">
          <div className="step-header">
            <h2 className="step-title">Datele tale biometrice</h2>
            <p className="step-desc">Utilizăm ecuația standard Mifflin-St Jeor pentru acuratețe maximă.</p>
          </div>

          <div className="metrics-grid">
            <div className="metric-box">
              <label className="metric-label">Vârstă</label>
              <div className="metric-input-wrap">
                <input
                  type="number"
                  min="14"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="metric-input"
                />
                <span className="metric-unit">ani</span>
              </div>
            </div>

            <div className="metric-box">
              <label className="metric-label">Greutate actuală</label>
              <div className="metric-input-wrap">
                <input
                  type="number"
                  min="35"
                  max="250"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="metric-input"
                />
                <span className="metric-unit">kg</span>
              </div>
            </div>

            <div className="metric-box">
              <label className="metric-label">Înălțime</label>
              <div className="metric-input-wrap">
                <input
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="metric-input"
                />
                <span className="metric-unit">cm</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Activity Level */}
      {step === 3 && (
        <div className="step-content animate-slide-up">
          <div className="step-header">
            <h2 className="step-title">Nivelul de activitate fizică</h2>
            <p className="step-desc">Selectează nivelul care descrie cel mai bine o săptămână obișnuită.</p>
          </div>

          <div className="stack-options">
            {[
              { id: 'sedentary', label: 'Sedentar', desc: 'Muncă la birou, puțin spre deloc efort fizic' },
              { id: 'light', label: 'Ușor Activ', desc: 'Plimbări zilnice sau 1-2 antrenamente / săptămână' },
              { id: 'moderate', label: 'Moderat Activ', desc: '3-4 antrenamente pe săptămână (recomandat)' },
              { id: 'very_active', label: 'Foarte Activ', desc: '5-7 antrenamente intense sau muncă fizică grea' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                className={`option-row ${activityLevel === item.id ? 'selected' : ''}`}
                onClick={() => setActivityLevel(item.id as ActivityLevel)}
              >
                <div className="option-text">
                  <strong className="option-title">{item.label}</strong>
                  <span className="option-desc">{item.desc}</span>
                </div>
                {activityLevel === item.id && <Check size={18} className="check-icon" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Dietary Preferences & Appliances */}
      {step === 4 && (
        <div className="step-content animate-slide-up">
          <div className="step-header">
            <h2 className="step-title">Preferințe & Aparatură</h2>
            <p className="step-desc">AI-ul va propune rețete compatibile cu aparatele tale de gătit.</p>
          </div>

          <div className="section-group">
            <span className="field-label">Stil alimentar / restricții:</span>
            <div className="stack-options">
              {['High Protein', 'Omnivor echilibrat', 'Vegetarian', 'Vegan', 'Fără Lactoză', 'Keto / Low Carb'].map((diet) => {
                const isSel = dietaryRestrictions.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    className={`option-row ${isSel ? 'selected' : ''}`}
                    onClick={() => toggleDiet(diet)}
                  >
                    <span className="option-title">{diet}</span>
                    <div className={`checkbox-custom ${isSel ? 'checked' : ''}`}>
                      {isSel && <Check size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="section-group">
            <span className="field-label">Aparatură disponibilă în bucătărie:</span>
            <div className="stack-options">
              {DEFAULT_APPLIANCES.map((app) => {
                const isSel = appliances.includes(app.name);
                return (
                  <button
                    key={app.id}
                    type="button"
                    className={`option-row ${isSel ? 'selected' : ''}`}
                    onClick={() => toggleAppliance(app.name)}
                  >
                    <span className="option-title">{app.name}</span>
                    <div className={`checkbox-custom ${isSel ? 'checked' : ''}`}>
                      {isSel && <Check size={14} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Final Target Review */}
      {step === 5 && (
        <div className="step-content animate-slide-up">
          <div className="step-header">
            <h2 className="step-title">Planul tău metabolic este gata!</h2>
            <p className="step-desc">Iată țintele zilnice calculate pe baza profilului tău.</p>
          </div>

          <div className="target-card">
            <div className="target-header">
              <Flame size={28} className="flame-icon" />
              <div>
                <span className="target-badge">Ținta Zilnică de Calorii</span>
                <span className="target-calories tabular-num">{metabolicPlan.targetCalories} <span className="kcal-unit">kcal/zi</span></span>
              </div>
            </div>

            <div className="target-stats-grid">
              <div className="stat-pill stat-protein">
                <span className="stat-name">Proteine</span>
                <strong className="stat-val tabular-num">{metabolicPlan.proteinGrams}g</strong>
              </div>
              <div className="stat-pill stat-carbs">
                <span className="stat-name">Carbohidrați</span>
                <strong className="stat-val tabular-num">{metabolicPlan.carbsGrams}g</strong>
              </div>
              <div className="stat-pill stat-fat">
                <span className="stat-name">Grăsimi</span>
                <strong className="stat-val tabular-num">{metabolicPlan.fatGrams}g</strong>
              </div>
            </div>

            <div className="target-meta">
              <span>BMR: {metabolicPlan.bmr} kcal</span>
              <span>•</span>
              <span>TDEE: {metabolicPlan.tdee} kcal</span>
            </div>
          </div>

          <div className="summary-bullets">
            <div className="bullet-item">
              <ShieldCheck size={16} className="bullet-icon" />
              <span>Rețetele propuse sunt calibrate automat pe macronutrienții rămași ai zilei.</span>
            </div>
            <div className="bullet-item">
              <Zap size={16} className="bullet-icon" />
              <span>Poți ajusta oricând obiectivele calorice și macronutrienții din profil.</span>
            </div>
          </div>
        </div>

      )}

      {/* Action Footer */}
      <div className="onboarding-actions">
        {step > 1 && (
          <button type="button" className="btn-back" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft size={16} />
            <span>Înapoi</span>
          </button>
        )}

        {step < 5 ? (
          <button type="button" className="btn-next" onClick={() => setStep((s) => s + 1)}>
            <span>Continuă</span>
            <ArrowRight size={16} />
          </button>
        ) : (
          <button type="button" className="btn-finish" onClick={handleFinish}>
            <Sparkles size={18} />
            <span>Lansează NutriAI Dashboard</span>
          </button>
        )}
      </div>

      <style jsx>{`
        .onboarding-card {
          padding: 20px 20px var(--bottom-safe-padding) 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-tracker {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 0;
        }

        .step-bar {
          flex: 1;
          height: 4px;
          border-radius: var(--radius-full);
          background: rgba(255, 255, 255, 0.1);
          transition: background var(--duration-fast);
        }

        .step-bar.active {
          background: var(--accent-primary);
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .step-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .step-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          line-height: 1.25;
        }

        .step-desc {
          font-size: 0.82rem;
          color: var(--text-secondary);
          line-height: 1.4;
        }

        .section-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-tertiary);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .choice-card {
          padding: 16px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          text-align: left;
          transition: all var(--duration-fast) var(--ease-out-smooth);
        }

        .choice-card:active {
          background: var(--bg-card-hover);
        }

        .choice-card.selected {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.12);
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.25);
        }

        .choice-icon-wrap {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          background: rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
          color: var(--accent-primary);
        }

        .choice-title {
          display: block;
          font-size: 0.96rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 2px;
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
          font-size: 0.92rem;
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
          font-size: 0.82rem;
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
          font-size: 0.92rem;
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
          font-size: 0.74rem;
          color: var(--text-tertiary);
        }

        .check-icon {
          color: var(--accent-primary);
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
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
          background: linear-gradient(155deg, #18243e 0%, #10182c 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: var(--radius-lg);
          padding: 18px;
          margin-bottom: 14px;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
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
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-tertiary);
        }

        .target-calories {
          font-size: 1.9rem;
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1;
        }

        .kcal-unit {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .target-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-pill {
          padding: 8px 6px;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }

        .stat-name {
          font-size: 0.68rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .stat-val {
          font-size: 1.1rem;
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
          font-size: 0.72rem;
          color: var(--text-tertiary);
          border-top: 1px solid var(--border-subtle);
          padding-top: 10px;
        }

        .summary-bullets {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bullet-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.82rem;
          color: var(--text-secondary);
          background: var(--bg-card);
          padding: 10px 12px;
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
          padding-top: 14px;
          border-top: 1px solid var(--border-subtle);
        }

        .btn-back {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: var(--bg-card);
          color: var(--text-secondary);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.86rem;
          font-weight: 700;
        }

        .btn-next, .btn-finish {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 18px;
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          color: #ffffff;
          border-radius: var(--radius-md);
          font-size: 0.92rem;
          font-weight: 800;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.4);
          transition: transform var(--duration-fast);
        }

        .btn-next:active, .btn-finish:active {
          transform: scale(0.97);
        }
      `}</style>
    </div>
  );
}
