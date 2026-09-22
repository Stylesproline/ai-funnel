import React from 'react';
import axios from 'axios';
import TimerAndButton from './TimerAndButton';

// === СЕРВЕРНОЕ ДЕЙСТВИЕ ДЛЯ ВЫСТАВЛЕНИЯ СЧЕТА E-POS / ЕРИП (ВАШ ОРИГИНАЛ 1:1) ===
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
  return (
    <div className="min-h-screen bg-[#080b14] text-white flex flex-col items-center justify-center p-3 sm:p-4 font-sans relative overflow-hidden select-none">
      
      {/* 1. Геймерские неоновые фоновые свечения */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* 2. Кибер-сетка */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none" />

      {/* Основная карточка Mini App */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-[0_0_60px_-15px_rgba(16,185,129,0.25)] border border-slate-800/90 text-center relative overflow-hidden z-10 my-auto">
        
        {/* Бейджи статуса */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Доступ к материалам РБ 2026
          </div>

          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse">
            ⚡ -62% OFF
          </span>
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300 tracking-tight leading-tight">
          «Комплект ИИ-Маркетолога»
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
          300+ промптов, готовые сценарии Reels и архитектура ИИ-агентов для быстрого старта в Беларуси.
        </p>

        {/* Прогресс-бар загрузки комплекта (XP Bar) */}
        <div className="mt-4 mb-4 p-3 bg-slate-950/80 rounded-2xl border border-slate-800/80 text-left">
          <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
            <span className="text-slate-400 uppercase tracking-wider">Статус комплекта:</span>
            <span className="text-emerald-400 font-bold">ГОТОВ К ВЫДАЧЕ</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full w-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
          </div>
        </div>

        {/* Игровые карточки с преимуществом */}
        <div className="space-y-2 mb-5 text-left">
          {[
            { icon: '⚡', title: 'Мгновенный авто-доступ', desc: 'Выдача материалов сразу после оплаты' },
            { icon: '🛡️', title: 'Официальный счет ЕРИП', desc: 'Безопасный платеж через E-POS' },
            { icon: '🎁', title: 'Фиксированная цена', desc: '59,90 BYN вместо 159 BYN' }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-3 transition-all duration-200 hover:border-emerald-500/40"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-sm shrink-0 font-bold">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-slate-200">{item.title}</div>
                <div className="text-[10px] text-slate-400">{item.desc}</div>
              </div>
              <span className="text-emerald-400 text-xs font-bold font-mono">✓</span>
            </div>
          ))}
        </div>

        {/* Форма с кнопкой и таймером */}
        <TimerAndButton onPayAction={createExpressPayEripInvoice} />

        {/* Плашка доверия */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex justify-center items-center gap-2 opacity-70 text-[11px] text-slate-400 font-mono">
          <span>Безопасная оплата через</span>
          <span className="font-bold text-slate-200 tracking-wider">ЕРИП / E-POS</span>
        </div>

      </div>
    </div>
  );
}
