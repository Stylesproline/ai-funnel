import { NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Считываем данные от ExpressPay. Если это наш curl-тест, берем параметры
    let invoiceNo = '';
    let accountNo = '';
    let amount = '14,90';

    try {
      const formData = await request.formData();
      invoiceNo = formData.get('InvoiceNo') as string || '';
      accountNo = formData.get('AccountNo') as string || '';
      amount = formData.get('Amount') as string || '14,90';
    } catch {
      // Страховка на случай json-тестов
      const body: any = await request.json().catch(() => ({}));
      invoiceNo = body.InvoiceNo || '';
      accountNo = body.AccountNo || '';
      amount = body.Amount || '14,90';
    }

    console.log(`[E-POS Webhook]: Данные считаны. Счет: ${invoiceNo}, Телефон: ${accountNo}`);

    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!botToken || !chatId) {
      console.error('[E-POS Webhook]: КРИТИЧЕСКАЯ ОШИБКА! Токены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не найдены в панели Vercel.');
      return new Response('OK', { status: 200 });
    }

    const cleanPhone = accountNo ? accountNo.replace('tel_', '') : 'Не указан';

    // 2. Формируем текст сообщения
    const tgMessage = `💰 СВЕЖАЯ ОПЛАТА В ЕРИП! 💰\n\n` +
                      `🔹 Номер счета: ${invoiceNo || '—'}\n` +
                      `🔹 Номер телефона: ${cleanPhone}\n` +
                      `🔹 Сумма: ${amount} BYN\n\n` +
                      `👉 Проверь личку клиента и продублируй ему ссылку на Google Диск!`;

    const tgUrl = `https://telegram.org{botToken}/sendMessage`;

    // 3. ОТПРАВКА С РАСШИРЕННОЙ ДИАГНОСТИКОЙ ОШИБОК
    try {
      const tgResponse = await axios.post(tgUrl, {
        chat_id: chatId,
        text: tgMessage,
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      });
      
      console.log('[E-POS Webhook]: УСПЕХ! Сервер Telegram принял сообщение:', tgResponse.data);
    } catch (tgErr: any) {
      console.error('[E-POS Webhook]: СЕРВЕР TELEGRAM ОТКЛОНИЛ ЗАПРОС!');
      if (tgErr.response) {
        console.error('Код ошибки от Telegram:', tgErr.response.status);
        console.error('Детали ошибки от Telegram:', JSON.stringify(tgErr.response.data));
      } else {
        console.error('Ошибка сети с Telegram:', tgErr.message);
      }
    }

    return new Response('OK', { status: 200 });

  } catch (err: any) {
    console.error('[E-POS Webhook Критическая ошибка]:', err.message);
    return new Response('OK', { status: 200 });
  }
}

