import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Use compat.extends to load the Next.js configs
  ...compat.extends('next/core-web-vitals'),
  // ...compat.extends('next/typescript'), // If you want TypeScript support
  
  // You can add custom rules here
  {
    rules: {
      // Your custom rules
    },
  },
];

export default eslintConfig