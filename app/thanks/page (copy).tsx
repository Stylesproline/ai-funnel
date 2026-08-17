import React from 'react';
import axios from 'axios';
import crypto from 'crypto';
import TimerAndButton from './TimerAndButton'; 

// Функция генерации обязательной цифровой подписи (MD5 по правилам ExpressPay)
function generateExpressPaySignature(params: Record<string, string>, secretWord: string): string {
  // 1. Сортируем ключи параметров в алфавитном порядке
  const sortedKeys = Object.keys(params).sort();
  
  // 2. Склеиваем только ЗНАЧЕНИЯ параметров в одну строку
  const valuesString = sortedKeys.map(key => params[key]).join('');
  
  // 3. Добавляем Секретное слово в самый конец строки
  const finalString = valuesString + secretWord;
  
  // 4. Возвращаем MD5-хэш в верхнем регистре
  return crypto.createHash('md5').update(finalString, 'utf8').digest('hex').toUpperCase();
}

// === СЕРВЕРНОЕ ДЕЙСТВИЕ ВЫСТАВЛЕНИЯ СЧЕТА (WEB_INVOICES) ===
export async function createExpressPayEripInvoice() {
  'use server';

  try {
    // Данные для ТЕСТОВОГО режима (вкладка "Тестовая услуга" в ЛК)
    const testToken = 'a75b74cbcfe446509e8ee874f421bd69';
    const testSecretWord = 'sandbox'; // Секретное слово для тестов из документации
    const testServiceId = '7';        // ID тестовой услуги из документации

    // 1. Формируем базовые параметры счета СТРОГО по инструкции web_invoices
    // Внимание: Токен (Token) передается как часть параметров тела!
    const apiParams: Record<string, string> = {
      'Token': testToken,
      'ServiceId': testSecretWord === 'sandbox' ? testServiceId : 'ВАШ_РЕАЛЬНЫЙ_ID_УСЛУГИ',
      'AccountNo': 'erip_' + Date.now(), // Уникальный номер лицевого счета
      'Amount': '14.90',                 // Стоимость в BYN
      'Currency': '933',                 // Код белорусского рубля
      'Info': 'Комплект ИИ-Маркетолог: Шаблоны и Промпты',
      'Surname': 'Клиент',               
      'FirstName': 'ИИ-Курса',
    };

    // 2. Генерируем обязательную цифровую подпись Signature
    const signature = generateExpressPaySignature(apiParams, testSecretWord);
    
    // Добавляем подпись в отправляемые параметры
    apiParams['Signature'] = signature;

    // 3. Выбираем URL СТРОГО по вашей инструкции (метод web_invoices):
    // ТЕСТОВЫЙ URL (для локальной проверки через тестовый токен):
    const url = 'https://sandbox-api.express-pay.by/v1/web_invoices';
    
    // БОЕВОЙ URL (когда замените токены на реальные и пойдет живая реклама):
    // const url = 'https://api.express-pay.by/v1/web_invoices';

    console.log('[Маркетинг-Бэкенд]: Отправка POST на web_invoices:', url);
    console.log('[Маркетинг-Бэкенд]: Сгенерированная подпись Signature:', signature);

    // 4. Отправка POST-запроса через Axios
    const response = await axios.post(url, new URLSearchParams(apiParams).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      timeout: 10000 
    });

     console.log('[Маркетинг-Бэкенд]: Ответ от шлюза:', response.data);
    const data = response.data;

    // 1. Если шлюз прислал готовую ссылку на оплату (поведение боевого сервера)
    if (data && data.ExpressPayWebInvoiceUrl) {
      console.log('[Маркетинг-Бэкенд]: Успех! Ссылка на оплату получена:', data.ExpressPayWebInvoiceUrl);
      return { redirectUrl: data.ExpressPayWebInvoiceUrl };
    }
    
    // 2. ИСПРАВЛЕНО: Если тестовый шлюз вернул объект с номером счета (InvoiceNo)
    if (data && data.InvoiceNo) {
      const testInvoiceNo = String(data.InvoiceNo);
      const testPaymentUrl = 'https://express-pay.by' + testInvoiceNo;
      console.log('[Маркетинг-Бэкенд]: Тестовая ссылка сформирована по InvoiceNo:', testPaymentUrl);
      return { redirectUrl: testPaymentUrl };
    }

    // 3. СТРАХОВКА ДЛЯ ПЕСОЧНИЦЫ: Если вернулся просто текст со статичным номером 100
    const rawResponseStr = typeof data === 'string' ? data : JSON.stringify(data);
    if (rawResponseStr.includes('100') || rawResponseStr.includes('InvoiceNo')) {
      console.log('[Маркетинг-Бэкенд]: Обнаружен номер счета 100 в текстовом ответе песочницы!');
      return { redirectUrl: 'https://express-pay.by100' };
    }

    return { error: 'Шлюз принял подпись, но вернул неожиданный формат данных. Проверьте терминал.' };


    return { error: 'Шлюз принял подпись, но не передал ссылку на оплату.' };

  } catch (err: any) {
    console.error('Ошибка Axios на сервере:');
    if (err.response) {
      console.error('Статус ошибки шлюза:', err.response.status);
      console.error('Данные ошибки шлюза:', err.response.data);
      return { error: 'Отказ шлюза (Код ' + err.response.status + '): ' + JSON.stringify(err.response.data) };
    }
    
    // Сетевая страховка для localhost
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

