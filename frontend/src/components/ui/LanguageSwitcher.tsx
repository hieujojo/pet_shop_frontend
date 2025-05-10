'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('common');

  const switchLanguage = () => {
    const newLocale = locale === 'vi' ? 'en' : 'vi';
    router.push(`/${newLocale}`);
  };

  return (
    <button
      onClick={switchLanguage}
      style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#0070f3',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      {t('button_switch')}
    </button>
  );
}