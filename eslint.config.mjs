const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'prisma/migrations/**',
      'generated/**',
      'data/backup/**',
      'next-env.d.ts',
      '*.config.js.timestamp-*',
    ],
  },
];

export default eslintConfig;
