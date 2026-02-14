import { redirect } from 'next/navigation';
import { auth, sessionToInternalUser } from '../../../lib/auth';
import { InternalNav } from '../../../components/internal/internal-nav';

export default async function InternalDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = sessionToInternalUser(session);

  if (!user) {
    redirect('/internal/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InternalNav user={user} />
      <main className="flex flex-col">{children}</main>
    </div>
  );
}
