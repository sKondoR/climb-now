import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),
  ...compat.extends('next/typescript'),
  {
    rules: {
      // Дополнительные правила для максимизации Score в Lighthouse
      "@next/next/no-img-element": "error",   // Запрет обычных <img> (требует next/image)
      "@next/next/no-html-link-for-pages": "error", // Запрет <a> для внутренних переходов
      "@next/next/no-sync-scripts": "error"   // Запрет синхронных скриптов
    },
  },
];

export default eslintConfig