import { redirect } from 'next/navigation';
import { auth, sessionToPortalUser } from '../../../lib/auth';
import { PortalNav } from '../../../components/portal/portal-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = sessionToPortalUser(session);

  if (!user) {
    redirect('/portal/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalNav user={user} />
      <main className="flex flex-col">{children}</main>
    </div>
  );
}
