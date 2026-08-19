import { NextRequest } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // =====================================================
    // 1. ПОЛУЧАЕМ ДАННЫЕ ОТ EXPRESSPAY
    // =====================================================

    let invoiceNo = '';
    let accountNo = '';
    let amount = '14,90';

    try {
      const formData = await request.formData();

      invoiceNo = String(formData.get('InvoiceNo') || '');
      accountNo = String(formData.get('AccountNo') || '');
      amount = String(formData.get('Amount') || '14,90');

    } catch {
      // Если ExpressPay прислал JSON
      const body: any = await request.json().catch(() => ({}));

      invoiceNo = String(body.InvoiceNo || '');
      accountNo = String(body.AccountNo || '');
      amount = String(body.Amount || '14,90');
    }

    console.log(
      `[E-POS Webhook]: Счет: ${invoiceNo}, AccountNo: ${accountNo}, Amount: ${amount}`
    );

    // =====================================================
    // 2. ПОЛУЧАЕМ TELEGRAM ДАННЫЕ ИЗ VERCEL ENV
    // =====================================================

    const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
    const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

    if (!botToken || !chatId) {
      console.error(
        '[E-POS Webhook]: TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID отсутствует'
      );

      // Возвращаем 200 ExpressPay, чтобы webhook не повторял запрос бесконечно
      return new Response('OK', { status: 200 });
    }

    // =====================================================
    // 3. ОЧИЩАЕМ AccountNo
    // =====================================================

    const cleanAccountNo = accountNo
      ? accountNo.replace(/^tel_/, '')
      : 'Не указан';

    // =====================================================
    // 4. ФОРМИРУЕМ СООБЩЕНИЕ
    // =====================================================

    const tgMessage =
      `💰 СВЕЖАЯ ОПЛАТА В ЕРИП! 💰\n\n` +
      `🔹 Номер счета: ${invoiceNo || '—'}\n` +
      `🔹 AccountNo: ${cleanAccountNo}\n` +
      `🔹 Сумма: ${amount} BYN\n\n` +
      `👉 Проверь личку клиента и продублируй ему ссылку на Google Диск!`;

    // =====================================================
    // 5. ПРАВИЛЬНЫЙ TELEGRAM BOT API URL
    // =====================================================

    const tgUrl =
      `https://api.telegram.org/bot${botToken}/sendMessage`;

    console.log('[Telegram]: Отправляем сообщение...');
    console.log('[Telegram]: Chat ID:', chatId);

    // =====================================================
    // 6. ОТПРАВЛЯЕМ СООБЩЕНИЕ
    // =====================================================

    try {
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

      console.log(
        '[Telegram]: УСПЕШНО:',
        JSON.stringify(tgResponse.data, null, 2)
      );

    } catch (tgErr: any) {
      console.error('[Telegram]: ОШИБКА ОТПРАВКИ');

      if (tgErr.response) {
        console.error(
          '[Telegram]: HTTP:',
          tgErr.response.status
        );

        console.error(
          '[Telegram]: Ответ:',
          JSON.stringify(tgErr.response.data, null, 2)
        );
      } else {
        console.error(
          '[Telegram]: Network error:',
          tgErr.message
        );
      }

      // ExpressPay получает 200,
      // чтобы не зациклить повторную отправку webhook
      return new Response('OK', { status: 200 });
    }

    // =====================================================
    // 7. EXPRESSPAY ПОЛУЧАЕТ ПОДТВЕРЖДЕНИЕ
    // =====================================================

    return new Response('OK', {
      status: 200,
    });

  } catch (err: any) {

    console.error(
      '[E-POS Webhook Критическая ошибка]:',
      err.message
    );

    // Для webhook лучше не заставлять ExpressPay
    // бесконечно повторять запрос
    return new Response('OK', {
      status: 200,
    });
  }
}
