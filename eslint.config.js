//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: ['.output/**'],
  },
  {
    settings: {
      'import-x/internal-regex': '^$',
    },
  },
]
