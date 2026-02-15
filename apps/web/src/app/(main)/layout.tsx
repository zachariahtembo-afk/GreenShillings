import type { ReactNode } from 'react';
import { SiteNav } from '../../components/site-nav';
import { SiteFooter } from '../../components/site-footer';
import { LanguageProvider } from '../../lib/i18n/language-context';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </LanguageProvider>
  );
}
