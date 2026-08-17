import { NextResponse } from 'next/server';

// 1. ВЕРИФИКАЦИЯ WEBHOOK ДЛЯ FACEBOOK DEVELOPERS
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Наш секретный токен-пароль, который мы прописали на Vercel
    const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'ai_funnel_belarus_2026';

    console.log('[Meta Verification]: Режим:', mode);
    console.log('[Meta Verification]: Получен токен:', token);

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('[Meta Verification]: Пароли совпали! Отправляю challenge обратно.');
      
      // Возвращаем challenge как чистый текст, как того требует Meta
      return new Response(challenge, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }

    console.error('[Meta Verification]: Отказ! Неверный Verify Token.');
    return new Response('Forbidden', { status: 403 });
  } catch (err: any) {
    console.error('[Meta Verification Error]:', err.message);
    return new Response('Internal Error', { status: 500 });
  }
}

// 2. ЗАГЛУШКА ДЛЯ ОБРАБОТКИ СООБЩЕНИЙ (Чтобы код не выдавал ошибку компиляции)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('[Meta Webhook]: Получено POST-сообщение:', body);
    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (err: any) {
    return new Response('Internal Error', { status: 500 });
  }
}
