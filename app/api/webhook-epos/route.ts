import { NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // =====================================================
    // 1. ЧИТАЕМ WEBHOOK ОТ EXPRESSPAY
    // =====================================================
    const contentType = request.headers.get('content-type') || '';

    let invoiceNo = '';
    let accountNo = '';
    let amount = '59.90';

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      invoiceNo = String(formData.get('InvoiceNo') || '');
      accountNo = String(formData.get('AccountNo') || '');
      amount = String(formData.get('Amount') || '59.90');
    } else {
      const body = await request.json().catch(() => ({}));
      invoiceNo = String(body.InvoiceNo || '');
      accountNo = String(body.AccountNo || '');
      amount = String(body.Amount || '59.90');
    }

    console.log('[E-POS Webhook] Оплата получена:', { invoiceNo, accountNo, amount });

    // =====================================================
    // 2. TELEGRAM ENV
    // =====================================================
    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!botToken || !chatId) {
      console.error('[Telegram] TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в .env');
      return new Response('OK', { status: 200 });
    }

    // =====================================================
    // 3. ФОРМИРОВАНИЕ ССЫЛКИ И СООБЩЕНИЯ
    // =====================================================
    const cleanPhone = accountNo ? accountNo.replace(/^tel_/, '') : '';
    const formattedPhone = cleanPhone ? `+${cleanPhone.replace(/\+/g, '')}` : 'Не указан';

    const tgMessage =
      `🎉 <b>НОВАЯ ОПЛАТА ЕРИП!</b> 🎉\n\n` +
      `💳 <b>Счет:</b> <code>${invoiceNo || '—'}</code>\n` +
      `📱 <b>Телефон:</b> <code>${formattedPhone}</code>\n` +
      `💰 <b>Сумма:</b> <code>${amount} BYN</code>\n\n` +
      `🚀 <i>Клиент ожидает материалы в Telegram!</i>`;

    // Инлайн-кнопки для быстрого действия админа
    const replyMarkup = cleanPhone ? {
      inline_keyboard: [
        [
          {
            text: '💬 Написать клиенту в Telegram',
            url: `https://t.me/${cleanPhone}`
          }
        ]
      ]
    } : undefined;

    // =====================================================
    // 4. ОТПРАВКА УВЕДОМЛЕНИЯ В TELEGRAM
    // =====================================================
    const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    await axios.post(
      tgUrl,
      {
        chat_id: chatId,
        text: tgMessage,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    console.log('[Telegram] ✅ Уведомление успешно отправлено');

    return new Response('OK', { status: 200 });

  } catch (error: any) {
    console.error('[E-POS Webhook] Ошибка обработки:', error?.message || error);
    
    // Всегда отдаем 200 для ExpressPay, чтобы избежать зацикливания запросов
    return new Response('OK', { status: 200 });
  }
}
