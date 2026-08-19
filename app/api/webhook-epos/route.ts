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
    let amount = '14.90';

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();

      invoiceNo = String(formData.get('InvoiceNo') || '');
      accountNo = String(formData.get('AccountNo') || '');
      amount = String(formData.get('Amount') || '14.90');

    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();

      invoiceNo = String(formData.get('InvoiceNo') || '');
      accountNo = String(formData.get('AccountNo') || '');
      amount = String(formData.get('Amount') || '14.90');

    } else {
      const body = await request.json().catch(() => ({}));

      invoiceNo = String(body.InvoiceNo || '');
      accountNo = String(body.AccountNo || '');
      amount = String(body.Amount || '14.90');
    }

    console.log('[E-POS Webhook] Получены данные:', {
      invoiceNo,
      accountNo,
      amount,
      contentType,
    });

    // =====================================================
    // 2. TELEGRAM ENV
    // =====================================================

    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!botToken) {
      console.error(
        '[Telegram] TELEGRAM_BOT_TOKEN отсутствует'
      );

      return new Response('OK', { status: 200 });
    }

    if (!chatId) {
      console.error(
        '[Telegram] TELEGRAM_CHAT_ID отсутствует'
      );

      return new Response('OK', { status: 200 });
    }

    // =====================================================
    // 3. ДАННЫЕ КЛИЕНТА
    // =====================================================

    const cleanAccountNo = accountNo
      ? accountNo.replace(/^tel_/, '')
      : 'Не указан';

    // =====================================================
    // 4. СООБЩЕНИЕ
    // =====================================================

    const tgMessage =
      `💰 СВЕЖАЯ ОПЛАТА В ЕРИП! 💰\n\n` +
      `🔹 Номер счета: ${invoiceNo || '—'}\n` +
      `🔹 Телефон: ${cleanAccountNo}\n` +
      `🔹 Сумма: ${amount} BYN\n\n` +
      `👉 Проверь личку клиента и продублируй ему ссылку на Google Диск!`;

    // =====================================================
    // 5. ПРАВИЛЬНЫЙ TELEGRAM API URL
    // =====================================================

    const tgUrl =
      `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log(
      '[Telegram] Отправляем уведомление в chat:',
      chatId
    );

    // =====================================================
    // 6. ОТПРАВКА
    // =====================================================

    const tgResponse = await axios.post(
      tgUrl,
      {
        chat_id: chatId,
        text: tgMessage,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    // =====================================================
    // 7. ПРОВЕРЯЕМ ОТВЕТ TELEGRAM
    // =====================================================

    console.log(
      '[Telegram] Ответ:',
      JSON.stringify(tgResponse.data, null, 2)
    );

    if (!tgResponse.data?.ok) {
      console.error(
        '[Telegram] Telegram вернул ok=false:',
        tgResponse.data
      );

      return new Response('OK', { status: 200 });
    }

    console.log(
      '[Telegram] ✅ Уведомление успешно отправлено'
    );

    // =====================================================
    // 8. ОТВЕТ EXPRESSPAY
    // =====================================================

    return new Response('OK', {
      status: 200,
    });

  } catch (error: any) {

    console.error(
      '[E-POS Webhook] КРИТИЧЕСКАЯ ОШИБКА:',
      error
    );

    if (axios.isAxiosError(error)) {
      console.error(
        '[Telegram] HTTP status:',
        error.response?.status
      );

      console.error(
        '[Telegram] Response:',
        JSON.stringify(
          error.response?.data,
          null,
          2
        )
      );
    }

    // ExpressPay должен получить 200,
    // чтобы не делать повторные webhook-запросы
    return new Response('OK', {
      status: 200,
    });
  }
}
