import React from 'react';
import axios from 'axios';
import TimerAndButton from './TimerAndButton';

// === СЕРВЕРНОЕ ДЕЙСТВИЕ ДЛЯ ВЫСТАВЛЕНИЯ СЧЕТА E-POS / ЕРИП ===
export async function createExpressPayEripInvoice() {
  'use server';

  try {
    // Лучше хранить токен в .env:
    // EXPRESSPAY_TOKEN=ваш_токен
    const token = process.env.EXPRESSPAY_TOKEN;

    if (!token) {
      console.error('[E-POS]: EXPRESSPAY_TOKEN не найден');
      return {
        error: 'Платежная система не настроена: отсутствует API-токен.'
      };
    }

    // Параметры счета
    const apiParams = {
      AccountNo: 'epos_' + Date.now(),

      // ExpressPay в документации указывает запятую
      // как разделитель дробной части
      Amount: '14,90',

      Currency: '933',

      Info: 'Комплект ИИ-Маркетолог: Шаблоны и Промпты',

      Surname: 'Клиент',

      FirstName: 'ИИ-Курса',

      // КЛЮЧЕВОЙ ПАРАМЕТР:
      // 1 = вернуть публичную ссылку на счет
      ReturnInvoiceUrl: '1'
    };

    const url =
      `https://api.express-pay.by/v1/invoices?token=${encodeURIComponent(token)}`;

    console.log(
      '[E-POS]: Отправка POST-запроса:',
      url.replace(token, '***TOKEN***')
    );

    console.log('[E-POS]: Параметры:', apiParams);

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

    console.log(
      '[E-POS]: Ответ ExpressPay:',
      JSON.stringify(response.data, null, 2)
    );

    const data = response.data;

    // =====================================================
    // ExpressPay должен вернуть:
    //
    // {
    //   InvoiceNo: 25803142,
    //   InvoiceUrl: "https://..."
    // }
    // =====================================================

    if (data?.InvoiceUrl) {
      console.log(
        '[E-POS]: Публичная ссылка на оплату:',
        data.InvoiceUrl
      );

      return {
        redirectUrl: data.InvoiceUrl,
        invoiceNo: data.InvoiceNo
      };
    }

    // Счет создан, но ссылка почему-то не пришла
    if (data?.InvoiceNo) {
      console.error(
        '[E-POS]: Счет создан, но InvoiceUrl отсутствует:',
        data
      );

      return {
        error:
          `Счет №${data.InvoiceNo} создан, ` +
          'но ExpressPay не вернул ссылку на оплату.'
      };
    }

    // ExpressPay вернул ошибку
    if (data?.Error) {
      console.error(
        '[E-POS]: Ошибка ExpressPay:',
        data.Error
      );

      return {
        error:
          `Ошибка ExpressPay: ${
            data.Error.Msg || 'Неизвестная ошибка'
          }`
      };
    }

    return {
      error:
        'ExpressPay вернул неожиданный ответ: ' +
        JSON.stringify(data)
    };

  } catch (err: any) {

    console.error('[E-POS]: Ошибка при создании счета');

    if (err.response) {
      console.error(
        '[E-POS]: HTTP status:',
        err.response.status
      );

      console.error(
        '[E-POS]: Ответ сервера:',
        JSON.stringify(err.response.data, null, 2)
      );

      return {
        error:
          'Отказ ExpressPay: ' +
          JSON.stringify(err.response.data)
      };
    }

    console.error('[E-POS]: Ошибка сети:', err.message);

    return {
      error:
        'Не удалось связаться с ExpressPay: ' +
        err.message
    };
  }
}


export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">

      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 text-center">

        <span className="text-4xl">🎉</span>

        <h1 className="text-2xl font-bold mt-3 text-emerald-400">
          Ваша заявка принята!
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Базовые материалы уже отправляются вам на телефон.
        </p>

        <TimerAndButton
          onPayAction={createExpressPayEripInvoice}
        />

      </div>

    </div>
  );
}
