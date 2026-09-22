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

  // Интеграция вибрации Telegram (Haptic Feedback) для геймификации
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' | 'error' = 'medium') => {
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
    
    // Защита: если галочка не стоит, прерываем отправку + вибро-ошибка
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

    // Успешный тап по кнопке
    triggerHaptic('medium');
    setLoading(true);
    setErrorMessage('');

    try {
      const result = await onPayAction({ name, phone });
      
      if (result.error) {
        triggerHaptic('error');
        setErrorMessage(result.error);
      } else if (result.redirectUrl) {
        // Успешная генерация ссылки
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
    <div className="mt-6 text-left w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Поле: ИМЯ */}
        <div className="relative group">
          <label className="block text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1.5 ml-1">
            Ваше имя
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (name.length === 0) triggerHaptic('light'); // Легкий отклик при начале ввода
            }}
            placeholder="Alex"
            className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 text-sm shadow-inner"
          />
        </div>

        {/* Поле: ТЕЛЕФОН */}
        <div className="relative group">
          <label className="block text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest mb-1.5 ml-1">
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
            className="w-full px-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 text-sm shadow-inner"
          />
        </div>

        {/* Геймифицированный чекбокс */}
        <div 
          className="flex items-start mt-4 p-3 bg-slate-900/40 rounded-xl border border-slate-800/50 cursor-pointer transition-colors hover:bg-slate-900/60"
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
              onChange={(e) => setIsChecked(e.target.checked)} // Дублируем для доступности
              className="peer sr-only"
            />
            <div className="w-5 h-5 bg-slate-950 border-2 border-slate-700 rounded flex items-center justify-center transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500 peer-checked:shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              <svg 
                className={`w-3.5 h-3.5 text-slate-950 pointer-events-none transition-transform duration-200 ${isChecked ? 'scale-100' : 'scale-0'}`} 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <label htmlFor="privacy-checkbox" className="ml-3 text-[11px] text-slate-400 leading-relaxed cursor-pointer pointer-events-none">
            Я принимаю <span className="text-emerald-400 font-medium pointer-events-auto" onClick={(e) => e.stopPropagation()}>Политику Конфиденциальности</span> и даю согласие на обработку персональных данных.
          </label>
        </div>

        {/* Анимированный блок ошибки */}
        {errorMessage && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-300 flex items-center gap-2 bg-rose-500/10 p-3 rounded-xl border border-rose-500/30 text-rose-400 text-xs font-medium shadow-[0_0_15px_rgba(244,63,94,0.1)]">
            <span className="text-base shrink-0">⚠️</span>
            <p className="leading-tight">{errorMessage}</p>
          </div>
        )}

        {/* Главная кнопка действия */}
        <button
          type="submit"
          disabled={loading || !isChecked}
          className="relative w-full py-4 overflow-hidden rounded-2xl font-black text-sm sm:text-base transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:grayscale disabled:pointer-events-none disabled:active:scale-100 flex items-center justify-center gap-2 group"
        >
          {/* Динамический фон кнопки */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-[length:200%_auto] animate-gradient shadow-[0_0_30px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-shadow" />
          
          {/* Текст поверх фона */}
          <span className="relative z-10 text-slate-950 uppercase tracking-widest flex items-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Генерация счета...
              </>
            ) : (
              '👉 Получить комплект за 59.90 BYN'
            )}
          </span>
        </button>
      </form>
    </div>
  );
}
