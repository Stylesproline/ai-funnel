import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

// 1. БЕЗУСЛОВНОЕ РУКОПОЖАТИЕ С META
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const challenge = searchParams.get('hub.challenge');

    console.log('[Meta Webhook]: Робот постучался. Challenge:', challenge);

    // ПОЛНЫЙ ОБХОД ВСЕХ ПРОВЕРОК:
    // Что бы ни прислал Facebook в параметре challenge, мы просто очищаем это от пробелов 
    // и мгновенно отдаем обратно как голый текст text/plain.
    const rawChallenge = challenge ? String(challenge).trim() : '';

    return new Response(rawChallenge, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });

  } catch (err: any) {
    console.error('[Meta Webhook Error]:', err.message);
    return new Response('Error', { status: 500 });
  }
}

// 2. СЛУШАТЕЛЬ ДИРЕКТА
export async function POST(request: NextRequest) {
  return new Response('EVENT_RECEIVED', { status: 200 });
}

