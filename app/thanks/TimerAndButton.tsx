'use client';

import React, { useState } from 'react';

interface TimerAndButtonProps {
  onPayAction: (formData: { name: string; phone: string }) => Promise<{ redirectUrl?: string; error?: string }>;
}

export default function TimerAndButton({ onPayAction }: TimerAndButtonProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      setErrorMessage('Пожалуйста, заполните все поля для получения материалов.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      // Передаем введенные данные в серверное действие
      const result = await onPayAction({ name, phone });
      
      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.redirectUrl) {
        // Перенаправляем на боевую страницу оплаты ЕРИП
        window.location.href = result.redirectUrl;
      }
    } catch (err) {
      setErrorMessage('Произошла ошибка сети. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 text-left">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Ваше имя
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Иван"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Номер телефона (Telegram / Viber)
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+375 (29) 123-45-67"
            className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
          />
        </div>

        {errorMessage && (
          <p className="text-rose-400 text-xs text-center font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
            ⚠️ {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black text-base rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all disabled:opacity-50 text-center uppercase tracking-wider mt-2"
        >
          {loading ? 'Генерация счета ЕРИП...' : '👉 Получить комплект за 14.90 BYN'}
        </button>
      </form>
    </div>
  );
}

