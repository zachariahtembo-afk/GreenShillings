import type { ReactNode } from 'react';
import { SiteNav } from '../../components/site-nav';
import { SiteFooter } from '../../components/site-footer';
import { AIChat } from '../../components/ai-chat';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <AIChat />
    </>
  );
}
