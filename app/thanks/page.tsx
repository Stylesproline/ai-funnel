import React from 'react';
import axios from 'axios';
import TimerAndButton from './TimerAndButton';

// === СЕРВЕРНОЕ ДЕЙСТВИЕ ДЛЯ ВЫСТАВЛЕНИЯ СЧЕТА E-POS / ЕРИП ===
// Добавили аргумент formData, который приходит из нашей новой формы ввода
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

    // Очищаем телефон от лишних символов, чтобы шлюз принял строку без сбоев
    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');

    // Параметры счета (Обновлено: вшиваем реальные данные клиента)
    const apiParams = {
      // КЛЮЧЕВОЙ ПАРАМЕТР: Вместо epos_время пишем телефон клиента!
      // ExpressPay вернет эту строку нам в Telegram-уведомлении после оплаты.
      AccountNo: 'tel_' + cleanPhone,

      // Ваша правильная сумма с запятой
      Amount: '59,90',

      Currency: '933',

      Info: 'Комплект ИИ-Маркетолог: Шаблоны и Промпты',

      // Берем реальное имя с формы
      Surname: formData.name || 'Клиент',

      FirstName: 'ИИ-Курса',

      // Ваш ключевой параметр для возврата ссылки
      ReturnInvoiceUrl: '1'
    };

    const url = `https://api.express-pay.by/v1/invoices?token=${encodeURIComponent(token)}`;

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

    // Считываем InvoiceUrl, который возвращает шлюз благодаря параметру ReturnInvoiceUrl
    if (data && data.InvoiceUrl) {
      console.log('[E-POS]: Ссылка на оплату получена:', data.InvoiceUrl);
      return { redirectUrl: data.InvoiceUrl };
    }

    // Страховка на случай, если шлюз вернул массив или структуру без прямой ссылки
    if (data && data.InvoiceNo) {
      const publicInvoiceUrl = 'https://expresspay.by' + data.InvoiceNo;
      return { redirectUrl: publicInvoiceUrl };
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
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700 text-center">
        
        <span className="text-4xl">🎉</span>
        <h1 className="text-2xl font-black mt-3 text-emerald-400">Ваша заявка принята!</h1>
        <p className="text-slate-400 text-xs mt-1 leading-relaxed">
          Для автоматического формирования счета в системе ЕРИП и гарантированной выдачи материалов введите ваши контакты:
        </p>

        {/* Передаем обновленную функцию в компонент формы */}
        <TimerAndButton onPayAction={createExpressPayEripInvoice} />

      </div>
    </div>
  );
}

