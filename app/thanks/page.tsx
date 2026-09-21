'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import TimerAndButton from './TimerAndButton';
import { createExpressPayEripInvoice } from './actions';
import { landingConfig } from './landingConfig';

export default function GamefiedTmaPage() {
  const [unlockedItems, setUnlockedItems] = useState<number[]>([1]); // Первый предмет разблокирован сразу
  const [progress, setProgress] = useState<number>(35);

  // Поддержка Telegram Mini App Haptic Feedback (Вибрация смартфона)
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  const toggleItem = (id: number, xp: number) => {
    triggerHaptic();
    if (unlockedItems.includes(id)) return;

    const newUnlocked = [...unlockedItems, id];
    setUnlockedItems(newUnlocked);
    const newProgress = Math.min(100, progress + xp);
    setProgress(newProgress);

    // Если собрал все предметы — запускаем праздничный САЛЮТ (Confetti)!
    if (newUnlocked.length === landingConfig.questItems.length) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#06B6D4', '#F59E0B', '#EC4899']
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-3 sm:p-4 font-sans relative overflow-hidden select-none">
      
      {/* 1. Неоновые фоновые плазмы в стиле Cyber/Gaming */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-72 bg-gradient-to-b from-emerald-500/20 via-teal-500/10 to-transparent blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Текстурная Cyber-сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

      {/* 3. Главная Консоль-Карточка */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_-20px_rgba(16,185,129,0.25)] border border-slate-800 text-center relative overflow-hidden z-10 my-auto">
        
        {/* Бейдж состояния */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {landingConfig.badge}
          </div>

          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
            {landingConfig.pricing.discount} SALE
          </span>
        </div>

        {/* Динамический Заголовок */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300 tracking-tight leading-tight">
          {landingConfig.title}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
          {landingConfig.subtitle}
        </p>

        {/* 4. ИГРОВОЙ ПРОГРЕСС-БАР (XP BAR) */}
        <div className="mt-5 mb-6 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner">
          <div className="flex justify-between items-center text-[11px] font-mono mb-2">
            <span className="text-slate-400 uppercase tracking-wider">Прогресс комплекта:</span>
            <span className="text-emerald-400 font-bold">{progress}% XP</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 5. ИНТЕРАКТИВНЫЕ КВЕСТ-ПРЕДМЕТЫ (Кликай, чтобы активировать салют!) */}
        <div className="space-y-2.5 mb-6 text-left">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1 flex justify-between">
            <span>Нажми на элемент для разблокировки:</span>
            {progress === 100 && <span className="text-emerald-400 font-bold animate-pulse">🎉 FULL UNLOCK!</span>}
          </div>

          {landingConfig.questItems.map((item) => {
            const isUnlocked = unlockedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => toggleItem(item.id, item.xp)}
                className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between active:scale-[0.98] ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 ${isUnlocked ? 'bg-emerald-500/20 text-emerald-400 scale-110 shadow-inner' : 'bg-slate-800/60 text-slate-500'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className={`text-xs sm:text-sm font-semibold ${isUnlocked ? 'text-emerald-200' : 'text-slate-300'}`}>
                      {item.name}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  {isUnlocked ? (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      ✓ Ready
                    </span>
                  ) : (
                    <span className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg border border-slate-700">
                      + Unlock
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. ПЛАШКА ЦЕНЫ В СТИЛЕ ЛУТБОКСА */}
        <div className="mb-6 p-4 bg-gradient-to-r from-emerald-950/30 via-slate-950 to-cyan-950/30 rounded-2xl border border-emerald-500/30 flex items-center justify-between shadow-inner">
          <div className="text-left">
            <div className="text-[10px] font-mono uppercase text-slate-400">Фиксированная цена</div>
            <div className="text-xs text-emerald-400 font-medium">Мгновенный доступ в Drive</div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="line-through text-slate-500 text-xs font-mono">{landingConfig.pricing.old}</span>
            <span className="text-2xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              {landingConfig.pricing.current}
            </span>
          </div>
        </div>

        {/* Кнопка с таймером из твоего существующего компонента */}
        <TimerAndButton onPayAction={createExpressPayEripInvoice} />

        {/* Плашка доверия ЕРИП */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex justify-center items-center gap-2 opacity-60 text-[11px] text-slate-400 font-mono">
          <span>Официальный эквайринг:</span>
          <span className="font-bold text-slate-200 tracking-wider">ЕРИП / E-POS</span>
        </div>

      </div>
    </div>
  );
}
