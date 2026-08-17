'use client';

import { useState, useEffect } from 'react';

interface TimerAndButtonProps {
  onPayAction: () => Promise<{ redirectUrl?: string; error?: string }>;
}

export default function TimerAndButton({ onPayAction }: TimerAndButtonProps) {
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClick = async () => {
    setLoading(true);
    const result = await onPayAction();
    
    if (result?.redirectUrl) {
      window.location.href = result.redirectUrl; 
    } else {
      alert(result?.error || 'Произошла ошибка при выставлении счета.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mt-6 bg-slate-900/50 rounded-xl p-4 border border-red-500/30">
        <div className="text-4xl font-mono font-bold text-red-500">{formatTime(timeLeft)}</div>
      </div>

      <div className="text-left mt-6 bg-slate-900/30 p-4 rounded-xl border border-slate-700">
        <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-2">Как оплатить через ЕРИП:</h2>
        <p className="text-xs text-slate-400">После нажатия кнопки вы перейдете на страницу счета с QR-кодом ЕРИП.</p>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="text-slate-500 line-through text-lg">60.00 BYN</span>
          <span className="text-3xl font-extrabold text-emerald-400">14.90 BYN</span>
        </div>
        <button
          onClick={handleClick}
          disabled={timeLeft <= 0 || loading}
          className="w-full py-4 px-6 rounded-xl font-bold text-lg bg-emerald-500 text-slate-950 shadow-lg"
        >
          {loading ? 'Формирование счета...' : 'Перейти к оплате в ЕРИП'}
        </button>
      </div>
    </>
  );
}

