import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    console.log('[Meta Webhook] Verification request:', {
      mode,
      tokenReceived: !!token,
      challengeReceived: !!challenge,
    });

    const verifyToken = process.env.INSTAGRAM_VERIFY_TOKEN;

    if (!verifyToken) {
      console.error(
        '[Meta Webhook] INSTAGRAM_VERIFY_TOKEN отсутствует в Environment Variables'
      );

      return new Response('Server configuration error', {
        status: 500,
      });
    }

    // Проверяем данные, которые прислала Meta
    if (mode === 'subscribe' && token === verifyToken) {
      console.log('[Meta Webhook] Verification SUCCESS');

      return new Response(challenge || '', {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }

    console.error('[Meta Webhook] Verification FAILED');

    return new Response('Forbidden', {
      status: 403,
    });

  } catch (err: any) {
    console.error('[Meta Webhook Error]:', err);

    return new Response('Internal Server Error', {
      status: 500,
    });
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log(
      '[Meta Webhook] Получено событие:',
      JSON.stringify(body, null, 2)
    );

    return new Response('EVENT_RECEIVED', {
      status: 200,
    });

  } catch (err: any) {
    console.error('[Meta Webhook POST Error]:', err);

    return new Response('EVENT_RECEIVED', {
      status: 200,
    });
  }
}

