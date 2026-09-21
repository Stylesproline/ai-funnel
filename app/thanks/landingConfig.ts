// landingConfig.ts
export const landingConfig = {
  // Настройки темы/стиля
  theme: {
    accentColor: 'emerald', // 'emerald' | 'violet' | 'amber' | 'cyan'
    badgeText: '🔥 Доступ к материалам РБ 2026',
    gameStyle: true, // Включает микро-интерактив
  },

  // Заголовки и описание
  header: {
    title: '«Комплект ИИ-Маркетолога»',
    subtitle: '300+ промптов, готовые сценарии Reels и архитектура ИИ-агентов для быстрого старта.',
  },

  // Буллеты ценностей
  features: [
    { id: 1, icon: '⚡', text: 'Выдача материалов сразу после оплаты' },
    { id: 2, icon: '🛡️', text: 'Официальный счет через систему ЕРИП' },
    { id: 3, icon: '🎁', text: 'Доступ к материалам  + обновления до 30 дней ' },
  ],

  // Цены и оффер
  pricing: {
    currentPrice: '59,90 BYN',
    oldPrice: '159 BYN',
    discountBadge: '-62%',
  },

  // Параметры для платежки
  payment: {
    productName: 'Комплект ИИ-Маркетолог: 300+ промптов',
    shortName: 'Комплект ИИ',
  }
};
