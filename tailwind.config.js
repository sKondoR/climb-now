module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/shared/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Цвета статусов подгрупп
      colors: {
        live: {
          DEFAULT: '#16a34a', // green-600: точка и рамка ≥3:1 на белом
          halo: '#4ade80', // green-400: пульсирующий ореол
          tint: '#f0fdf4', // green-50: фон текущего соревнования в списке
        },
        done: '#16a34a', // green-600: галочка «данные есть» (идёт или завершилось), ≥3:1 на белом
      },
    },
  },
  plugins: [],
  // На телефоне hover «залипает» после касания: подсветка остаётся на табе/карточке
  future: {
    hoverOnlyWhenSupported: true,
  },
}