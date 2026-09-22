import React from 'react';
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
  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-3 sm:p-4 font-sans relative overflow-hidden select-none">
      
      {/* 1. Неоновое свечение заднего плана (Gaming Ambient Light) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-gradient-to-b from-emerald-500/25 via-teal-500/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

      {/* 2. Кибер-сетка фоном (Cyber Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:1.75rem_1.75rem] pointer-events-none" />

      {/* 3. Главная карточка-консоль Mini App */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-5 sm:p-7 shadow-[0_0_80px_-20px_rgba(16,185,129,0.3)] border border-slate-800/90 text-center relative overflow-hidden z-10 my-auto">
        
        {/* Шапка карточки: Статус и Скидка */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            RB 2026 VERIFIED
          </div>

          <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full animate-pulse">
            🔥 LEVEL 1 UNLOCKED
          </span>
        </div>

        {/* Заголовок оффера */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300 tracking-tight leading-tight">
          «Комплект ИИ-Маркетолога»
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">
          300+ промптов, готовые сценарии Reels и архитектура ИИ-агентов для быстрой автоматизации.
        </p>

        {/* Игровой XP Прогресс-бар */}
        <div className="mt-5 mb-5 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 shadow-inner text-left">
          <div className="flex justify-between items-center text-[11px] font-mono mb-1.5">
            <span className="text-slate-400 uppercase tracking-wider">Готовность комплекта:</span>
            <span className="text-emerald-400 font-bold">100% XP (READY)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full w-full shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          </div>
        </div>

        {/* Карточки Ачивок / Буллетов */}
        <div className="space-y-2.5 mb-5 text-left">
          {[
            { icon: '⚡', title: 'Мгновенный авто-доступ', desc: 'Выдача материалов сразу после оплаты' },
            { icon: '🛡️', title: 'Официальный счет ЕРИП', desc: 'Безопасный платеж через E-POS' },
            { icon: '🎁', title: 'Скидка зафиксирована', desc: '59,90 BYN вместо 159 BYN (-62%)' }
          ].map((item, idx) => (
            <div 
              key={idx}
              className="p-3 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center gap-3 transition-all duration-300 hover:border-emerald-500/40 hover:bg-slate-900/60"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-base shrink-0 font-bold shadow-inner">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-slate-200">{item.title}</div>
                <div className="text-[10px] text-slate-400">{item.desc}</div>
              </div>
              <span className="text-emerald-400 text-xs font-bold font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                ✓
              </span>
            </div>
          ))}
        </div>

        {/* Форма оплаты (Клиентский компонент) */}
        <div className="relative">
          <TimerAndButton onPayAction={createExpressPayEripInvoice} />
        </div>

        {/* Футер ЕРИП */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex justify-center items-center gap-2 opacity-70 text-[11px] text-slate-400 font-mono">
          <span>Безопасный эквайринг:</span>
          <span className="font-bold text-slate-200 tracking-wider">ЕРИП / E-POS</span>
        </div>

      </div>
    </div>
  );
}
