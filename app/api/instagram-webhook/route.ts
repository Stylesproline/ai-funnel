import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// 1. ВЕРИФИКАЦИЯ WEBHOOK ДЛЯ FACEBOOK DEVELOPERS
export async function GET(request: NextRequest) {
  try {
    // Используем встроенный метод nextUrl для мгновенного и точного чтения параметров в облаке Vercel
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Наше секретное проверочное слово
    const MY_SECRET = 'ai_funnel_belarus_2026';

    console.log('[Meta Verification]: Запрос пойман сервером Vercel!');
    console.log('[Meta Verification]: Считанный challenge:', challenge);

    if (mode === 'subscribe' && token === MY_SECRET) {
      // Принудительно очищаемchallenge от любых скрытых пробелов или символов перевода строки
      const cleanChallenge = challenge ? String(challenge).trim() : '';

      // Возвращаем чистый текст, как требует документация MetaGraph API
      return new Response(cleanChallenge, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    return new Response('Forbidden', { status: 403 });
  } catch (err: any) {
    console.error('[Meta Verification Error]:', err.message);
    return new Response('Internal Error', { status: 500 });
  }
}

// 2. СЛУШАТЕЛЬ ДИРЕКТА
export async function POST(request: NextRequest) {
  try {
    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (err: any) {
    return new Response('Error', { status: 500 });
  }
}

