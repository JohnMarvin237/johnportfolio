'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Le hook s'occupe du tracking automatiquement
  useAnalytics();

  return <>{children}</>;
}