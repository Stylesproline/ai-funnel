export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Жестко вшиваем проверочное слово прямо в код, чтобы Vercel не зависел от настроек панели
    const MY_SECRET = 'ai_funnel_belarus_2026';

    if (mode === 'subscribe' && token === MY_SECRET) {
      // Возвращаем challenge в чистейшем текстовом виде
      return new Response(challenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    return new Response('Forbidden', { status: 403 });
  } catch (err: any) {
    return new Response('Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  return new Response('OK', { status: 200 });
}

