'use client';

import React, { useEffect, useState } from 'react';

export default function SuccessDownloadPage() {
  const [copied, setCopied] = useState(false);
  const secretPromoCode = "AI_MASTER_2026"; // Пример промокода на скидку для основного курса

  // Инициализация Meta Pixel для фиксации РЕАЛЬНОЙ покупки (событие Purchase)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      if (window.fbq) {
        // @ts-ignore
        window.fbq('track', 'Purchase', {
          value: 14.90,
          currency: 'BYN',
          content_name: 'Комплект ИИ-Маркетолог'
        });
        console.log('Meta Pixel: Событие Purchase успешно отправлено!');
      }
    }
  }, []);

  const handleCopyPromo = () => {
    navigator.clipboard.writeText(secretPromoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 text-center relative overflow-hidden">
        
        {/* Декоративный светящийся круг на фоне */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Иконка успешной операции */}
        <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 animate-pulse">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold mt-4 text-emerald-400">Оплата успешно принята!</h1>
        <p className="text-slate-400 text-sm mt-2 leading-relaxed">
          Спасибо за доверие. Ваш практический комплект «ИИ-Маркетолог» полностью готов к работе.
        </p>

        {/* ГЛАВНАЯ КНОПКА СКАЧИВАНИЯ */}
        <div className="mt-6 bg-slate-900/40 rounded-xl p-4 border border-slate-700">
          <p className="text-xs text-slate-400 mb-3">Нажмите на кнопку ниже, чтобы открыть файлы:</p>
          <a
            href="https://google.com" // Замените на вашу ссылку на Google Диск / Telegram-канал
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 transform active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Скачать материалы (PDF + Видео)
          </a>
        </div>

        {/* МОСТИК К СЛЕДУЮЩЕМУ ПРОДУКТУ (Прогрев на основной курс) */}
        <div className="mt-8 pt-6 border-t border-slate-700/60 text-left">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
            <span className="inline-block bg-indigo-500/20 text-indigo-400 text-xs px-2.5 py-1 rounded-md font-semibold tracking-wide uppercase">
              Бонус покупателя
            </span>
            <h3 className="text-base font-bold text-slate-200 mt-2">
              Скидка 15% на наш полный курс по нейросетям
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Вы сделали первый шаг к автоматизации. На основном курсе мы вместе соберем вашего личного ИИ-агента, который будет полностью автономно вести ваш проект.
            </p>
            
            {/* Промокод */}
            <div className="mt-4 flex gap-2">
              <div className="bg-slate-900 px-3 py-2 rounded-lg font-mono text-sm font-bold text-indigo-400 flex-1 border border-slate-700 flex items-center justify-between">
                <span>{secretPromoCode}</span>
                <span className="text-[10px] text-slate-500 uppercase">код</span>
              </div>
              <button
                onClick={handleCopyPromo}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 rounded-lg transition-colors whitespace-nowrap"
              >
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
          </div>
        </div>

        {/* Контакты поддержки */}
        <p className="text-[11px] text-slate-500 mt-6">
          Возникли проблемы со скачиванием? Напишите нам в{' '}
          <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-slate-400 underline hover:text-emerald-400">
            Telegram-поддержку
          </a>
        </p>

      </div>
    </div>
  );
}
