import { getRequestConfig } from 'next-intl/server';

export const locales = ['vi', 'en'] as const;
export const defaultLocale = 'vi';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale = locale ?? defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`./src/locales/${safeLocale}/common.json`)).default, 
  };
});