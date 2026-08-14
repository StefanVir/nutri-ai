'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MealCardProposal } from '@/types/nutrition';
import { X, Play, Pause, RotateCcw, Check, ChevronLeft, ChevronRight, Bell, Sparkles, Flame, Clock } from 'lucide-react';

interface CookModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: MealCardProposal | null;
  onCompleteCooking: (recipe: MealCardProposal) => void;
}

export function CookModeModal({
  isOpen,
  onClose,
  recipe,
  onCompleteCooking,
}: CookModeModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [initialTimerDuration, setInitialTimerDuration] = useState<number>(0);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // WakeLock reference
  useEffect(() => {
    let wakeLockSentinel: any = null;
    if (isOpen && typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      (navigator as any).wakeLock
        .request('screen')
        .then((lock: any) => {
          wakeLockSentinel = lock;
        })
        .catch((err: any) => console.warn('WakeLock not granted:', err));
    }
    return () => {
      if (wakeLockSentinel) wakeLockSentinel.release().catch(() => {});
    };
  }, [isOpen]);

  const steps = recipe?.instructions || [];
  const currentStep = steps[currentStepIndex] || '';

  // Extract timer from current step text (e.g. "3-4 minute", "12 minute", "30 secunde")
  useEffect(() => {
    if (!currentStep) return;

    // Reset current timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);

    // Look for duration matches
    const minMatch = currentStep.match(/(\d+)(?:\s*-\s*(\d+))?\s*(?:min|minute)/i);
    const secMatch = currentStep.match(/(\d+)\s*(?:sec|secunde)/i);

    if (minMatch) {
      const minutes = minMatch[2] ? parseInt(minMatch[2], 10) : parseInt(minMatch[1], 10);
      const totalSecs = minutes * 60;
      setTimerSeconds(totalSecs);
      setInitialTimerDuration(totalSecs);
    } else if (secMatch) {
      const secs = parseInt(secMatch[1], 10);
      setTimerSeconds(secs);
      setInitialTimerDuration(secs);
    } else {
      setTimerSeconds(null);
      setInitialTimerDuration(0);
    }
  }, [currentStepIndex, currentStep]);

  // Handle active countdown
  useEffect(() => {
    if (isTimerRunning && timerSeconds !== null && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            playChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isTimerRunning && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, timerSeconds]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      // Audio not permitted without gesture
    }
  };

  if (!isOpen || !recipe) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 sm:p-6 animate-fade-in">
      <div className="relative flex flex-col w-full max-w-2xl h-[90vh] max-h-[750px] bg-slate-900 border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Mod Asistat Chef</span>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 truncate max-w-[260px] sm:max-w-md">
                {recipe.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step Body Content */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Pasul {currentStepIndex + 1} din {steps.length}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                Total: ~{recipe.cookTimeMinutes} min gătire
              </span>
            </div>

            {/* Main Step Instruction Text */}
            <p className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-100 leading-relaxed sm:leading-snug mt-2">
              {currentStep}
            </p>
          </div>

          {/* Embedded Interactive Live Timer (If detected in step) */}
          {timerSeconds !== null && (
            <div className="my-6 p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${timerSeconds === 0 ? 'bg-emerald-500 text-white animate-bounce' : 'bg-emerald-500/20 text-emerald-400'} border border-emerald-500/30`}>
                  <Bell className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Temporizator Pas</span>
                  <div className="text-3xl font-black font-mono tracking-tight text-white">
                    {formatTime(timerSeconds)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                    isTimerRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  }`}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  {isTimerRunning ? 'Pauză' : timerSeconds === 0 ? 'Repornește' : 'Pornește'}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(initialTimerDuration);
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Resetează timerul"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation & Completion Action Controls */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Înapoi
            </button>

            {!isLastStep ? (
              <button
                onClick={() => setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1))}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                Pasul Următor
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onCompleteCooking(recipe);
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 transition-all active:scale-95"
              >
                <Check className="w-5 h-5 stroke-[3]" />
                Finalizează & Înregistrează Masa
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
