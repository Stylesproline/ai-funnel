'use client';

import React, { useState } from 'react';
import axios from 'axios';
import TimerAndButton from './TimerAndButton';

// === СЕРВЕРНОЕ ДЕЙСТВИЕ ДЛЯ ВЫСТАВЛЕНИЯ СЧЕТА E-POS / ЕРИП (Оригинал 1:1) ===
export async function createExpressPayEripInvoice(formData: { name: string; phone: string }) {
  'use server';

  try {
    const token = process.env.EXPRESSPAY_TOKEN;

    if (!token) {
      console.error('[E-POS]: EXPRESSPAY_TOKEN не найден');
      return {
        error: 'Платежная система не настроена: отсутствует API-токен.'
      };
    }

    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');

    const apiParams = {
      AccountNo: 'tel_' + cleanPhone,
      Amount: '59,90',
      Currency: '933',
      Info: 'Комплект ИИ-Маркетолог: 300+ промптов и сценариев',
      Surname: formData.name || 'Покупатель',
      FirstName: 'Комплект ИИ',
      ReturnInvoiceUrl: '1'
    };

    const url = `https://api.express-pay.by/v1/invoices?token=${encodeURIComponent(token)}`;

    const response = await axios.post(
      url,
      new URLSearchParams(apiParams).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        },
        timeout: 10000
      }
    );

    const data = response.data;

    if (data && data.InvoiceUrl) {
      return { redirectUrl: data.InvoiceUrl };
    }

    if (data && data.InvoiceNo) {
      return { redirectUrl: 'https://expresspay.by' + data.InvoiceNo };
    }

    return { error: 'Шлюз создал счет, но не передал URL для оплаты.' };

  } catch (err: any) {
    console.error('Ошибка создания счета в ЕРИП:', err.message);
    return { error: 'Не удалось связаться с ЕРИП. Попробуйте позже.' };
  }
}

export default function ThanksPage() {
  const [activeBonus, setActiveBonus] = useState<number | null>(null);

  // Салют / Эффекты при тапе по карточкам бонусов
  const triggerHapticAndConfetti = (index: number) => {
    setActiveBonus(index);
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp?.HapticFeedback) {
      (window as any).Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-3 sm:p-4 font-sans relative overflow-hidden select-none">
      
      {/* 1. Игровые неоновые размытия (Cyber/Gaming vibe) */}
      <div className="absolute -top-30 -left-30 w-96 h-96 bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-30 -right-30 w-96 h-96 bg-teal-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* 2. Легкая пиксельная сетка фоном */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b10_1px,transparent_1px),linear-gradient(to_bottom,#1e293b10_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Основная карточка */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_-15px_rgba(16,185,129,0.2)] border border-slate-800/80 text-center relative overflow-hidden z-10 my-auto">
        
        {/* Верхний статус-бар */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Доступ к материалам РБ 2026
          </div>

          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
            -62% OFF
          </span>
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300 leading-tight tracking-tight">
          «Комплект ИИ-Маркетолога»
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
          300+ промптов, готовые сценарии Reels и архитектура ИИ-агентов для быстрого старта в Беларуси.
        </p>

        {/* Геймифицированная карточка с фичами (Тапабельная) */}
        <div className="my-5 space-y-2.5 text-left">
          {[
            { title: 'Выдача материалов сразу после оплаты', icon: '⚡', desc: 'Авто-ссылка в Telegram/Drive' },
            { title: 'Официальный счет через систему ЕРИП', icon: '🛡️', desc: 'ЕРИП / E-POS безопасный шлюз' },
            { title: 'Фиксированная цена 59,90 BYN', icon: '🎁', desc: 'Вместо 159 BYN (Скидка зафиксирована)' },
          ].map((item, idx) => (
            <div 
              key={idx}
              onClick={() => triggerHapticAndConfetti(idx)}
              className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-3 active:scale-[0.98] ${
                activeBonus === idx 
                  ? 'bg-emerald-500/15 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base shrink-0 font-bold border border-emerald-500/30">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-slate-200 truncate">{item.title}</div>
                <div className="text-[10px] text-slate-400">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Форма с кнопкой и таймером */}
        <div className="relative">
          <TimerAndButton onPayAction={createExpressPayEripInvoice} />
        </div>

        {/* Плашка доверия */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex justify-center items-center gap-2 opacity-70 text-[11px] text-slate-400 font-mono">
          <span>Безопасная оплата через</span>
          <span className="font-bold text-slate-200 tracking-wider">ЕРИП / E-POS</span>
        </div>

      </div>
    </div>
  );
}
