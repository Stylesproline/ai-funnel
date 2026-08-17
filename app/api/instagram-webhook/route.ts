import { NextResponse } from 'next/server';

// СТРОГОЕ ТРЕБОВАНИЕ ДЛЯ VERCEL: Принудительно отключаем кэширование роута!
export const dynamic = 'force-dynamic';

// 1. ВЕРИФИКАЦИЯ ДЛЯ РОБОТОВ META (FACEBOOK)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Жестко фиксируем проверочное слово прямо в коде для 100% надежности
    const MY_SECRET = 'ai_funnel_belarus_2026';

    console.log('[Meta-Верификация]: Запрос получен успешно!');

    if (mode === 'subscribe' && token === MY_SECRET) {
      const responseText = challenge ? String(challenge) : '';

      // Отдаем чистый текст без кэширования
      return new Response(responseText, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }

    return new Response('Forbidden', { status: 403 });
  } catch (err: any) {
    return new Response('Internal Server Error', { status: 500 });
  }
}

// 2. СЛУШАТЕЛЬ ДИРЕКТА
export async function POST(request: Request) {
  return new Response('EVENT_RECEIVED', { status: 200 });
}

