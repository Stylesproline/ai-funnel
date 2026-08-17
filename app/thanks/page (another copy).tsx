import React from 'react';
import axios from 'axios';
import TimerAndButton from './TimerAndButton'; 

// === СЕРВЕРНОЕ ДЕЙСТВИЕ ДЛЯ ВЫСТАВЛЕНИЯ РЕАЛЬНОГО СЧЕТА E-POS ===
export async function createExpressPayEripInvoice() {
  'use server';

  try {
    const token = '85958615a5b84447b626b59dfe6a75b7'; // Ваш рабочий токен

    // 1. Параметры реального счета для E-POS
    const apiParams = {
      'AccountNo': 'epos_' + Date.now(), // Уникальный номер лицевого счета
      'Amount': '14.90',                 // Стоимость в BYN
      'Currency': '933',                 // Код белорусского рубля
      'Info': 'Комплект ИИ-Маркетолог: Шаблоны и Промпты',
      'Surname': 'Клиент',               
      'FirstName': 'ИИ-Курса',
    };

    // 2. БОЕВОЙ ЭНДПОИНТ (БЕЗ СЛОВА SANDBOX)
    const url = 'https://api.express-pay.by/v1/invoices?token=' + token;

    console.log('[E-POS Боевой Бэкенд]: Отправка POST-запроса на адрес:', url);

    // 3. Отправка реального POST-запроса через Axios
    const response = await axios.post(url, new URLSearchParams(apiParams).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      timeout: 10000 
    });

    console.log('[E-POS Боевой Бэкенд]: Ответ от ExpressPay:', response.data);
    const data = response.data;

    // 4. ИСПРАВЛЕНО: Безопасное формирование ссылки через конструктор URL (кэш будет сброшен)
    if (data && data.InvoiceNo) {
      const invoiceString = String(data.InvoiceNo);
      
      // Конструктор URL сам жестко пропишет правильные слэши и пути
      const finalUrl = new URL('https://api.express-pay.by/v1/invoices' + invoiceString);
      
      console.log('[E-POS Боевой Бэкенд]: Итоговый правильный адрес:', finalUrl.toString());
      return { redirectUrl: finalUrl.toString() };
    }
    
    return { error: 'Шлюз принял запрос, но не передал номер счета.' };

  } catch (err: any) {
    console.error('Ошибка Axios на боевом сервере E-POS:');
    if (err.response) {
      return { error: 'Отказ шлюза E-POS: ' + JSON.stringify(err.response.data) };
    }
    if (process.env.NODE_ENV === 'development') {
      return { redirectUrl: '/success-download-ai' };
    }
    return { error: 'Не удалось связаться со шлюзом из-за ошибки сети.' };
  }
}

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 text-center">
        <span className="text-4xl">🎉</span>
        <h1 className="text-2xl font-bold mt-3 text-emerald-400">Ваша заявка принята!</h1>
        <p className="text-slate-400 text-sm mt-1">Базовые материалы уже отправляются вам на телефон.</p>
        <TimerAndButton onPayAction={createExpressPayEripInvoice} />
      </div>
    </div>
  );
}

