import { NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Считываем данные, которые ExpressPay присылает методом POST в формате FormData
    const formData = await request.formData();
    
    const invoiceNo = formData.get('InvoiceNo') as string; // Номер счета в ЕРИП
    const accountNo = formData.get('AccountNo') as string; // Здесь лежит наш 'tel_+375...'
    const amount = formData.get('Amount') as string;       // Сумма платежа

    console.log(`[ExpressPay Webhook]: Поступила оплата счета №${invoiceNo} на сумму ${amount} BYN`);

    // 2. Считываем скрытые токены Телеграма из настроек сервера
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.error('[ExpressPay Webhook]: Ошибка! На Vercel не настроены TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID');
      return new Response('OK', { status: 200 });
    }

    // Очищаем строку, доставая чистый телефон клиента
    const cleanPhone = accountNo ? accountNo.replace('tel_', '') : 'Не указан';

    // 3. Формируем красивый продающий лог для вашего Telegram
    const tgMessage = `💰 СВЕЖАЯ ОПЛАТА В ЕРИП! 💰\n\n` +
                      `🔹 Номер счета: ${invoiceNo || '—'}\n` +
                      `🔹 Номер телефона: ${cleanPhone}\n` +
                      `🔹 Сумма: ${amount || '14,90'} BYN\n\n` +
                      `🚀 Клиент оплатил трипвайер. Возьми его телефон, найди в Telegram/Viber или напиши в Директ и продублируй ссылку на Google Диск на всякий случай!`;

    const tgUrl = `https://telegram.org/{botToken}/sendMessage`;

    // Отправляем запрос на сервера Телеграм
    await axios.post(tgUrl, {
      chat_id: chatId,
      text: tgMessage,
    });

    console.log('[ExpressPay Webhook]: Оповещение в Telegram успешно отправлено!');

    // Обязательно отвечаем шлюзу ExpressPay статусом 200 OK, чтобы они знали, что сайт принял сигнал
    return new Response('OK', { status: 200 });

  } catch (err: any) {
    console.error('[ExpressPay Webhook Error]:', err.message);
    // Всегда возвращаем 200, чтобы платежный агрегатор не блокировал работу роута из-за сетевых сбоев
    return new Response('OK', { status: 200 });
  }
}
