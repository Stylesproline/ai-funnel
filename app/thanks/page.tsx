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

    // Очищаем телефон от лишних символов
    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');

    const apiParams = {
      // Идентификатор клиента для Telegram-уведомлений
      AccountNo: 'tel_' + cleanPhone,
      Amount: '59,90',
      Currency: '933',
      Info: 'Комплект ИИ-Маркетолог: 300+ промптов и сценариев',
      
      // Исправлено: передаем корректное ФИО без «ИИ-Курса»
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-700 text-center relative overflow-hidden">
        
        {/* Бейдж акцента */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
          <span>🔥</span> Доступ к материалам РБ 2026
        </div>

        {/* Усиливаем заголовок */}
        <h1 className="text-2xl font-black text-white leading-tight">
          «Комплект ИИ-Маркетолога»
        </h1>
        <p className="text-slate-400 text-xs mt-2 leading-relaxed">
          300+ промптов, готовые сценарии Reels и архитектура ИИ-агентов для быстрого старта в Беларуси.
        </p>

        {/* Буллеты ценности прямо перед оплатой */}
        <div className="my-5 p-3.5 bg-slate-900/60 rounded-xl text-left border border-slate-700/50 text-xs space-y-2">
          <div className="flex items-center text-slate-300">
            <span className="text-emerald-400 font-bold mr-2">✓</span> Выдача материалов сразу после оплаты
          </div>
          <div className="flex items-center text-slate-300">
            <span className="text-emerald-400 font-bold mr-2">✓</span> Официальный счет через систему ЕРИП
          </div>
          <div className="flex items-center text-slate-300">
            <span className="text-emerald-400 font-bold mr-2">✓</span> Фиксированная цена: <strong className="text-white ml-1">59,90 BYN</strong> <span className="line-through text-slate-500 ml-1">159 BYN</span>
          </div>
        </div>

        {/* Компонент формы с таймером и кнопкой */}
        <TimerAndButton onPayAction={createExpressPayEripInvoice} />

        {/* Плашка доверия платежей для РБ */}
        <div className="mt-5 pt-4 border-t border-slate-700/60 flex justify-center items-center gap-3 opacity-60 text-[10px] text-slate-400">
          <span>Безопасная оплата через</span>
          <span className="font-bold text-white tracking-wider">ЕРИП / E-POS</span>
        </div>

      </div>
    </div>
  );
}
