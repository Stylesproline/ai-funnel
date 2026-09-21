import React, { useState } from 'react';
import axios from 'axios';
import TimerAndButton from './TimerAndButton';
import { landingConfig } from './landingConfig'; // Импортируем наш конфиг

export async function createExpressPayEripInvoice(formData: { name: string; phone: string }) {
  'use server';

  try {
    const token = process.env.EXPRESSPAY_TOKEN;
    if (!token) return { error: 'Платежная система не настроена: отсутствует API-токен.' };

    const cleanPhone = formData.phone.replace(/[^0-9+]/g, '');

    const apiParams = {
      AccountNo: 'tel_' + cleanPhone,
      Amount: '59,90',
      Currency: '933',
      Info: landingConfig.payment.productName,
      Surname: formData.name || 'Покупатель',
      FirstName: landingConfig.payment.shortName,
      ReturnInvoiceUrl: '1'
    };

    const url = `https://api.express-pay.by/v1/invoices?token=${encodeURIComponent(token)}`;
    const response = await axios.post(url, new URLSearchParams(apiParams).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      timeout: 10000
    });

    const data = response.data;
    if (data?.InvoiceUrl) return { redirectUrl: data.InvoiceUrl };
    if (data?.InvoiceNo) return { redirectUrl: 'https://expresspay.by' + data.InvoiceNo };

    return { error: 'Шлюз создал счет, но не передал URL для оплаты.' };
  } catch (err: any) {
    return { error: 'Не удалось связаться с ЕРИП. Попробуйте позже.' };
  }
}

export default function UniversalLandingPage() {
  const [clickedFeatures, setClickedFeatures] = useState<number[]>([]);

  // Микро-игра/интерактив: Кликая на буллеты, пользователь "собирает бонусы"
  const toggleFeature = (id: number) => {
    if (!clickedFeatures.includes(id)) {
      setClickedFeatures([...clickedFeatures, id]);
    }
  };

  const isAllUnlocked = clickedFeatures.length === landingConfig.features.length;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      
      {/* 1. Игровой динамический фон (Неоновые сферы) */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      {/* Сетка в стиле Cyberpunk / Game Dev */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* 2. Основная карточка */}
      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_-15px_rgba(16,185,129,0.2)] border border-slate-800 text-center relative overflow-hidden z-10 hover:border-slate-700 transition-all duration-300">
        
        {/* Игровой плашка-уведомление сверху */}
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {landingConfig.theme.badgeText}
          </div>

          <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 bg-slate-800/80 px-2 py-1 rounded-md border border-slate-700">
            {landingConfig.pricing.discountBadge}
          </span>
        </div>

        {/* Динамический заголовок */}
        <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-emerald-300 leading-tight tracking-tight">
          {landingConfig.header.title}
        </h1>
        
        <p className="text-slate-400 text-xs sm:text-sm mt-2.5 leading-relaxed">
          {landingConfig.header.subtitle}
        </p>

        {/* 3. Геймифицированный блок фич (Ачивки) */}
        <div className="my-6 space-y-2.5 text-left">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Что входит в комплект:</span>
            {isAllUnlocked && (
              <span className="text-[10px] text-emerald-400 font-bold animate-bounce">✨ Все бонусы активированы!</span>
            )}
          </div>

          {landingConfig.features.map((feat) => {
            const isSelected = clickedFeatures.includes(feat.id);
            return (
              <div 
                key={feat.id}
                onClick={() => toggleFeature(feat.id)}
                className={`p-3 rounded-xl border text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-all duration-200 select-none ${
                  isSelected 
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{feat.icon}</span>
                  <span>{feat.text}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-600'}`}>
                  {isSelected ? '✓' : '+'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Плашка цены */}
        <div className="mb-6 p-3.5 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-cyan-950/30 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">К оплате сегодня:</span>
          <div className="flex items-baseline gap-2">
            <span className="line-through text-slate-500 text-xs">{landingConfig.pricing.oldPrice}</span>
            <span className="text-xl font-black text-emerald-400 tracking-tight">{landingConfig.pricing.currentPrice}</span>
          </div>
        </div>

        {/* Форма с таймером и кнопкой */}
        <TimerAndButton onPayAction={createExpressPayEripInvoice} />

        {/* Плашка ЕРИП */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex justify-center items-center gap-2 opacity-60 text-[11px] text-slate-400 font-mono">
          <span>Безопасный эквайринг:</span>
          <span className="font-bold text-slate-200 tracking-wider">ЕРИП / E-POS</span>
        </div>

      </div>
    </div>
  );
}
