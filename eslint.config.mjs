import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import importPlugin from 'eslint-plugin-import'

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: {
      import: importPlugin
    },
    settings: {
      'import/resolver': {
        typescript: true
      }
    },
    rules: {
      'import/no-unresolved': 'error',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts']
  }
]

export default eslintConfig
