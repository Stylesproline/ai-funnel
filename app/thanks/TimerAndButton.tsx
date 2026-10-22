'use client';

import React, { useState } from 'react';

interface TimerAndButtonProps {
  onPayAction: (formData: { name: string; phone: string }) => Promise<{ redirectUrl?: string; error?: string }>;
}

export default function TimerAndButton({ onPayAction }: TimerAndButtonProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Проверка, начал ли пользователь ввод
  const isTyping = name.length > 0 || phone.length > 0;

  // Telegram Haptic Feedback (Вибрация)
  const triggerHaptic = (style: 'light' | 'medium' | 'error' = 'medium') => {
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
      const haptic = (window as any).Telegram.WebApp.HapticFeedback;
      if (style === 'error') {
        haptic.notificationOccurred('error');
      } else {
        haptic.impactOccurred(style);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isChecked) {
      triggerHaptic('error');
      setErrorMessage('Необходимо принять Политику конфиденциальности.');
      return;
    }

    if (!name.trim() || !phone.trim()) {
      triggerHaptic('error');
      setErrorMessage('Пожалуйста, заполните все поля для получения материалов.');
      return;
    }

    triggerHaptic('medium');
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await onPayAction({ name, phone });
      
      if (result.error) {
        triggerHaptic('error');
        setErrorMessage(result.error);
      } else if (result.redirectUrl) {
        if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
          (window as any).Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
        window.location.href = result.redirectUrl;
      }
    } catch (err) {
      triggerHaptic('error');
      setErrorMessage('Произошла ошибка сети. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 text-left w-full">
      
      {/* 👾 ИНТЕРАКТИВНЫЙ МАСКОТ СВЕРХУ ФОРМЫ */}
      <div className="flex items-center gap-3 mb-4 p-3.5 bg-slate-950/80 border border-emerald-500/30 rounded-2xl relative overflow-hidden shadow-inner">
        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center bg-emerald-500/15 rounded-xl border border-emerald-500/40 animate-bounce duration-1000">
          <span className="text-2xl select-none">
            {loading ? '🚀' : isTyping ? '🤖' : '🦊'}
          </span>
          <div className="absolute -bottom-1 w-6 h-1 bg-emerald-500/50 rounded-full blur-[3px]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
            AI-Ассистент
          </div>
          <div className="text-xs text-slate-200 font-medium leading-tight mt-0.5">
            {loading 
              ? 'Генерирую персональный счет в ЕРИП...' 
              : isTyping 
                ? `Отлично, ${name || 'друг'}! Заполняй телефон 👇` 
                : 'Введи имя и телефон, чтобы забрать комплект 🔥'}
          </div>
        </div>

        <div className="absolute top-2 right-3 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1 ml-1">
            Ваше имя
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (name.length === 0) triggerHaptic('light');
            }}
            placeholder="Иван"
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all text-sm shadow-inner"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1 ml-1">
            Номер телефона (Telegram / Viber)
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (phone.length === 0) triggerHaptic('light');
            }}
            placeholder="+375 (29) 123-45-67"
            className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all text-sm shadow-inner"
          />
        </div>

        {/* Чекбокс согласия */}
        <div 
          className="flex items-start mt-2 p-2.5 bg-slate-900/40 rounded-xl border border-slate-800/50 cursor-pointer"
          onClick={() => {
            setIsChecked(!isChecked);
            triggerHaptic('light');
          }}
        >
          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
            <input
              id="privacy-checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="peer sr-only"
            />
            <div className="w-4 h-4 bg-slate-950 border-2 border-slate-700 rounded flex items-center justify-center transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500">
              <svg 
                className={`w-3 h-3 text-slate-950 pointer-events-none transition-transform duration-200 ${isChecked ? 'scale-100' : 'scale-0'}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <label htmlFor="privacy-checkbox" className="ml-2.5 text-[11px] text-slate-400 leading-tight cursor-pointer pointer-events-none">
            Я принимаю <span className="text-emerald-400 font-medium pointer-events-auto" onClick={(e) => e.stopPropagation()}>Политику Конфиденциальности</span> и даю согласие на обработку персональных данных.
          </label>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/30 text-rose-400 text-xs font-medium">
            <span>⚠️</span>
            <p>{errorMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isChecked}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all disabled:opacity-30 disabled:pointer-events-none text-center uppercase tracking-wider mt-1"
        >
          {loading ? 'Генерация счета ЕРИП...' : '👉 Получить комплект за 59.90 BYN'}
        </button>
      </form>
    </div>
  );
}
