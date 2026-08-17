import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    const MY_SECRET = 'ai_funnel_belarus_2026';

    if (mode === 'subscribe' && token === MY_SECRET) {
      console.log('[Meta Webhook]: Токены совпали! Отправляю чистый HTML поток.');

      // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ: Переводим тип в text/html по требованию Meta 
      // и склеиваем с пустой строкой, чтобы убрать любые скрытые обертки Next.js
      const rawText = '' + (challenge ? String(challenge).trim() : '');

      return new Response(rawText, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      });
    }

    return new Response('Forbidden', { status: 403 });
  } catch (err: any) {
    return new Response('Error', { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return new Response('EVENT_RECEIVED', { status: 200 });
}

