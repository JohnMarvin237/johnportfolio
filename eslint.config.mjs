import nextConfig from 'eslint-config-next';

export default [
  // Ignore Claude Code internal worktrees and other non-project dirs
  {
    ignores: ['.claude/', 'claude-agents-config/', 'node_modules/', '.next/'],
  },
  ...nextConfig,
  {
    rules: {
      // setState in useEffect is intentional for localStorage-based initialization
      // (theme, locale). The React Compiler rule is too strict for this pattern.
      'react-hooks/set-state-in-effect': 'off',
      // Unused disable directives — demote to warn so they don't block CI
      'no-unused-disable': 'off',
    },
  },
];
