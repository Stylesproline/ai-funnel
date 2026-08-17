import { NextResponse } from 'next/server';

// 1. ЖЕСТКАЯ ВЕРИФИКАЦИЯ ДЛЯ РОБОТОВ META (FACEBOOK)
export async function GET(request: Request) {
  try {
    // Извлекаем параметры напрямую из URL запроса
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Наше секретное проверочное слово
    const MY_SECRET = 'ai_funnel_belarus_2026';

    console.log('[Meta-Диагностика]: mode =', mode);
    console.log('[Meta-Диагностика]: token =', token);
    console.log('[Meta-Диагностика]: challenge =', challenge);

    // Проверяем условия верификации Meta
    if (mode === 'subscribe' && token === MY_SECRET) {
      console.log('[Meta-Диагностика]: УСПЕХ! Пароли совпали.');

      // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Принудительно превращаем challenge в строку,
      // чтобы Node.js на Vercel не упал в ошибку из-за числового формата.
      const responseText = challenge ? String(challenge) : '';

      // Возвращаем чистый текстовый ответ со статусом 200 без лишних оберток
      return new Response(responseText, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }

    console.error('[Meta-Диагностика]: ОТКАЗ! Токен верификации не совпал.');
    return new Response('Forbidden', { status: 403 });
  } catch (err: any) {
    console.error('[Meta-Критическая ошибка роута]:', err.message);
    return new Response('Internal Server Error', { status: 500 });
  }
}

// 2. СЛУШАТЕЛЬ ДИРЕКТА (ОСТАВЛЯЕМ ДЛЯ ОБРАБОТКИ СООБЩЕНИЙ)
export async function POST(request: Request) {
  try {
    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (err: any) {
    return new Response('Error', { status: 500 });
  }
}


