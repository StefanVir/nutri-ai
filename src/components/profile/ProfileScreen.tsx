'use client';

import React from 'react';
import { UserProfile, Goal } from '@/types/nutrition';
import { GOAL_LABELS, DEFAULT_APPLIANCES } from '@/lib/metabolic';
import { User, Settings, Flame, Shield, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onResetOnboarding: () => void;
}

export function ProfileScreen({
  profile,
  onUpdateProfile,
  onResetOnboarding,
}: ProfileScreenProps) {
  const handleGoalChange = (newGoal: Goal) => {
    const delta = newGoal === 'cut' ? -400 : newGoal === 'bulk' ? 350 : 0;
    const newCalorieTarget = profile.calorieTarget + delta;

    onUpdateProfile({
      ...profile,
      goal: newGoal,
      calorieTarget: newCalorieTarget,
    });
  };

  const toggleAppliance = (applianceName: string) => {
    const updated = profile.appliances.includes(applianceName)
      ? profile.appliances.filter((a) => a !== applianceName)
      : [...profile.appliances, applianceName];

    onUpdateProfile({
      ...profile,
      appliances: updated,
    });
  };

  return (
    <div className="profile-screen animate-fade-in">
      <div className="profile-hero">
        <div className="avatar-wrap">
          <User size={28} className="avatar-icon" />
        </div>
        <div className="hero-text">
          <h2 className="user-name">{profile.name}</h2>
          <span className="user-meta">
            {profile.gender === 'male' ? 'Bărbat' : 'Femeie'} • {profile.age} ani • {profile.weightKg} kg • {profile.heightCm} cm
          </span>
        </div>
      </div>

      {/* Target summary card */}
      <div className="profile-target-card">
        <div className="card-top">
          <Flame size={18} className="flame-gold" />
          <span className="target-label">ȚINTĂ METABOLICĂ ZILNICĂ</span>
        </div>
        <h3 className="target-number tabular-num">{profile.calorieTarget} <span className="unit">kcal</span></h3>

        <div className="macro-pills-row">
          <div className="p-pill p-prot">
            <span>Proteine</span>
            <strong className="tabular-num">{profile.proteinTarget}g</strong>
          </div>
          <div className="p-pill p-carb">
            <span>Carbohidrați</span>
            <strong className="tabular-num">{profile.carbsTarget}g</strong>
          </div>
          <div className="p-pill p-fat">
            <span>Grăsimi</span>
            <strong className="tabular-num">{profile.fatTarget}g</strong>
          </div>
        </div>
      </div>

      {/* Goal Switcher */}
      <div className="profile-section">
        <h4 className="section-title">Obiectiv Activ</h4>
        <div className="goal-switcher-grid">
          {(Object.keys(GOAL_LABELS) as Goal[]).map((key) => {
            const isSelected = profile.goal === key;
            return (
              <button
                key={key}
                type="button"
                className={`goal-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleGoalChange(key)}
              >
                <div className="goal-btn-head">
                  <span className="goal-name">{GOAL_LABELS[key].title}</span>
                  {isSelected && <Check size={14} className="check-gold" />}
                </div>
                <span className="goal-sub">{GOAL_LABELS[key].desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kitchen Appliances */}
      <div className="profile-section">
        <h4 className="section-title">Aparatură Bucătărie</h4>
        <div className="appliances-stack">
          {DEFAULT_APPLIANCES.map((app) => {
            const isSelected = profile.appliances.includes(app.name);
            return (
              <button
                key={app.id}
                type="button"
                className={`app-row ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleAppliance(app.name)}
              >
                <span className="app-name">{app.name}</span>
                <div className={`checkbox-custom ${isSelected ? 'checked' : ''}`}>
                  {isSelected && <Check size={12} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset Onboarding Button */}
      <div className="profile-actions">
        <button type="button" className="btn-re-onboard" onClick={onResetOnboarding}>
          <RotateCcw size={15} />
          <span>Recalculează Profilul (Re-Onboarding)</span>
        </button>
      </div>

      <style jsx>{`
        .profile-screen {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .profile-hero {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
        }

        .avatar-wrap {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
        }

        .hero-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .user-name {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .user-meta {
          font-size: 0.76rem;
          color: var(--text-secondary);
        }

        .profile-target-card {
          background: linear-gradient(155deg, #18233b 0%, #101726 100%);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .card-top {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        :global(.flame-gold) {
          color: var(--macro-calories);
        }

        .target-label {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text-tertiary);
          letter-spacing: 0.05em;
        }

        .target-number {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-primary);
        }

        .unit {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .macro-pills-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          margin-top: 4px;
        }

        .p-pill {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          padding: 8px 4px;
          border-radius: var(--radius-sm);
          font-size: 0.72rem;
        }

        .p-prot { background: var(--macro-protein-bg); color: var(--macro-protein); border: 1px solid rgba(16, 185, 129, 0.2); }
        .p-carb { background: var(--macro-carbs-bg); color: var(--macro-carbs); border: 1px solid rgba(6, 182, 212, 0.2); }
        .p-fat { background: var(--macro-fat-bg); color: var(--macro-fat); border: 1px solid rgba(244, 63, 94, 0.2); }

        .profile-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .section-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .goal-switcher-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .goal-btn {
          padding: 12px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          text-align: left;
          display: flex;
          flex-direction: column;
          gap: 3px;
          transition: all var(--duration-fast);
        }

        .goal-btn.selected {
          border-color: var(--macro-calories);
          background: rgba(245, 158, 11, 0.1);
        }

        .goal-btn-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .goal-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        :global(.check-gold) {
          color: var(--macro-calories);
        }

        .goal-sub {
          font-size: 0.72rem;
          color: var(--text-tertiary);
        }

        .appliances-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .app-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          transition: all var(--duration-fast);
        }

        .app-row.selected {
          border-color: var(--accent-primary);
          background: rgba(99, 102, 241, 0.08);
        }

        .app-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .checkbox-custom {
          width: 20px;
          height: 20px;
          border-radius: 4px;
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

        .profile-actions {
          padding-top: 10px;
        }

        .btn-re-onboard {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .btn-re-onboard:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
