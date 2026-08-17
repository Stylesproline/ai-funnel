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
      console.log('[Meta Webhook]: Токены совпали! Отправляю чистый challenge:', challenge);

      // ВАЖНЕЙШЕЕ ИСПРАВЛЕНО: Превращаем в строку и очищаем от пробелов
      const challengeString = challenge ? String(challenge).trim() : '';

      // Возвращаем абсолютно «голую» строку без скрытых оберток Next.js, 
      // принудительно прописав text/plain. Это уберет любые кавычки в облаке Vercel.
      return new Response(challengeString, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Length': String(Buffer.byteLength(challengeString)),
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

