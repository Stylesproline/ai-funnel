import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// 1. ВЕРИФИКАЦИЯ WEBHOOK ДЛЯ FACEBOOK DEVELOPERS
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Наше секретное проверочное слово
    const MY_SECRET = 'ai_funnel_belarus_2026';

    console.log('[Meta-Верификация]: Запрос получен сервером.');

    if (mode === 'subscribe' && token === MY_SECRET) {
      console.log('[Meta-Верификация]: Токены совпали! Challenge:', challenge);
      
      // Если challenge является числом (например, 112341), парсим его в число, 
      // иначе возвращаем как очищенную строку. Это уберет любые кавычки Next.js.
      const parsedChallenge = challenge && !isNaN(Number(challenge)) 
        ? Number(challenge) 
        : String(challenge).trim();

      // Самый надежный способ ответа в App Router: возвращаем challenge напрямую
      return new Response(String(parsedChallenge), {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }

    return new Response('Forbidden', { status: 403 });
  } catch (err: any) {
    console.error('[Meta Verification Error]:', err.message);
    return new Response('Internal Error', { status: 500 });
  }
}

// 2. СЛУШАТЕЛЬ ДИРЕКТА (Оставляем для будущей обработки сообщений)
export async function POST(request: NextRequest) {
  try {
    return new Response('EVENT_RECEIVED', { status: 200 });
  } catch (err: any) {
    return new Response('Error', { status: 500 });
  }
}

