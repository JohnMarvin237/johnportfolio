'use client';

import { createContext, useContext } from 'react';

type LocaleContextType = {
  locale: string;
  messages: Record<string, any>;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({
  children,
  locale,
  messages
}: {
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
}) {
  return (
    <LocaleContext.Provider value={{ locale, messages }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context.locale;
}

export function useTranslations(namespace?: string) {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useTranslations must be used within LocaleProvider');
  }

  const messages = namespace
    ? context.messages[namespace] || {}
    : context.messages;

  return (key: string, defaultValue?: string) => {
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
    }

    return value || defaultValue || key;
  };
}