'use server';

import axios from 'axios';

export async function createExpressPayEripInvoice(formData: { name: string; phone: string }) {
  try {
    const token = process.env.EXPRESSPAY_TOKEN;

    if (!token) {
      console.error('[E-POS]: EXPRESSPAY_TOKEN не найден');
      return { error: 'Платежная система не настроена: отсутствует API-токен.' };
    }

    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');

    const apiParams = {
      AccountNo: 'tel_' + cleanPhone,
      Amount: '59,90',
      Currency: '933',
      Info: 'Комплект ИИ-Маркетолог: 300+ промптов и сценариев',
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

    if (data && data.InvoiceUrl) return { redirectUrl: data.InvoiceUrl };
    if (data && data.InvoiceNo) return { redirectUrl: 'https://expresspay.by' + data.InvoiceNo };

    return { error: 'Шлюз создал счет, но не передал URL для оплаты.' };

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
    console.error('Ошибка создания счета в ЕРИП:', errorMessage);
    return { error: 'Не удалось связаться с ЕРИП. Попробуйте позже.' };
  }
}
