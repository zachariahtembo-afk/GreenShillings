// Auth layout - no authentication required
// This allows the login page to be accessed without being logged in

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
