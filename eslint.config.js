import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  {
    rules: {
      'default-case': 'warn',
      'no-console': 'warn',
      'no-alert': 'warn',
      'prefer-arrow-callback': 'warn',
      'no-var': 'warn',
      'no-duplicate-case': 'warn',
      'no-extra-boolean-cast': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      'react/jsx-key': 'warn',
      'object-shorthand': 'warn',
      'prefer-const': 'warn',
      'no-trailing-spaces': 'warn',
      eqeqeq: 'warn',
      'arrow-parens': ['warn', 'always'],
      curly: 'warn',
      'no-else-return': 'warn',
      quotes: ['warn', 'single'],
      semi: ['warn', 'never'],
      'comma-dangle': ['warn', 'always-multiline'],
      indent: ['warn', 2],
    },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
])
