import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts', 'climb-now/**']),
  {
    rules: {
      // Дополнительные правила для максимизации Score в Lighthouse
      "@next/next/no-img-element": "error",   // Запрет обычных <img> (требует next/image)
      "@next/next/no-html-link-for-pages": "error", // Запрет <a> для внутренних переходов
      "@next/next/no-sync-scripts": "error"   // Запрет синхронных скриптов
    },
  },
]);

export default eslintConfig
