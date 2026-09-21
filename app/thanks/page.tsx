import React from 'react';
import axios from 'axios';
import TimerAndButton from './TimerAndButton';

// === СЕРВЕРНОЕ ДЕЙСТВИЕ ДЛЯ ВЫСТАВЛЕНИЯ СЧЕТА E-POS / ЕРИП ===
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* Декоративные размытые свечения на фоне */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Основная карточка */}
      <div className="max-w-md w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] border border-slate-800 text-center relative overflow-hidden z-10">
        
        {/* Акцентный бейдж */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium mb-5 shadow-inner">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Доступ к материалам РБ 2026
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 leading-tight tracking-tight">
          «Комплект ИИ-Маркетолога»
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-2.5 leading-relaxed font-normal">
          300+ промптов, готовые сценарии Reels и архитектура ИИ-агентов для быстрого старта в Беларуси.
        </p>

        {/* Карточка с ценностями */}
        <div className="my-6 p-4 bg-slate-950/60 rounded-2xl text-left border border-slate-800/80 text-xs sm:text-sm space-y-3 shadow-inner">
          <div className="flex items-center text-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mr-3 shrink-0">✓</div>
            <span>Выдача материалов сразу после оплаты</span>
          </div>
          <div className="flex items-center text-slate-200">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mr-3 shrink-0">✓</div>
            <span>Официальный счет через систему ЕРИП</span>
          </div>
          <div className="flex items-center text-slate-200 pt-1 border-t border-slate-800/60">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold mr-3 shrink-0">✓</div>
            <span>Фиксированная цена: <strong className="text-emerald-400 text-base ml-1">59,90 BYN</strong> <span className="line-through text-slate-500 text-xs ml-1.5">159 BYN</span></span>
          </div>
        </div>

        {/* Форма с кнопкой и таймером */}
        <TimerAndButton onPayAction={createExpressPayEripInvoice} />

        {/* Плашка доверия */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-center items-center gap-2 opacity-60 text-[11px] text-slate-400">
          <span>Безопасная оплата через</span>
          <span className="font-semibold text-slate-200 tracking-wider">ЕРИП / E-POS</span>
        </div>

      </div>
    </div>
  );
}
