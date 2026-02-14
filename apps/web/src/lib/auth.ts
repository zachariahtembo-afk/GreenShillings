import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: 'portal-credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const user = await prisma.portalUser.findUnique({
          where: { email },
          include: { organization: true },
        });

        if (!user || !user.passwordHash) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.portalUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: user.organization?.name ?? null,
        };
      },
    }),
    Credentials({
      id: 'magic-link',
      name: 'Magic Link',
      credentials: {
        token: { label: 'Token', type: 'text' },
      },
      async authorize(credentials) {
        const token = credentials?.token as string | undefined;
        if (!token) return null;

        const user = await prisma.portalUser.findUnique({
          where: { magicLinkToken: token },
          include: { organization: true },
        });

        if (!user) return null;
        if (user.magicLinkExpiry && user.magicLinkExpiry < new Date()) return null;

        // Clear token after use and record login
        await prisma.portalUser.update({
          where: { id: user.id },
          data: {
            magicLinkToken: null,
            magicLinkExpiry: null,
            lastLoginAt: new Date(),
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.organizationId,
          organizationName: user.organization?.name ?? null,
        };
      },
    }),
  ],
  callbacks: {
    signIn({ account, profile }) {
      // Restrict Google to @greenshillings.org domain
      if (account?.provider === 'google') {
        return profile?.email?.endsWith('@greenshillings.org') ?? false;
      }
      // Allow Credentials providers
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        // On initial sign-in, persist custom fields into JWT
        const u = user as { role?: string; organizationId?: string | null; organizationName?: string | null };
        token.role = u.role ?? null;
        token.organizationId = u.organizationId ?? null;
        token.organizationName = u.organizationName ?? null;
      }
      return token;
    },
    session({ session, token }) {
      if (token) {
        (session as SessionWithPortal).role = token.role as string | null;
        (session as SessionWithPortal).organizationId = token.organizationId as string | null;
        (session as SessionWithPortal).organizationName = token.organizationName as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/portal/login',
    error: '/portal/login',
  },
});

// Extended session type for portal users
export interface SessionWithPortal {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  role?: string | null;
  organizationId?: string | null;
  organizationName?: string | null;
}

// Re-export a compatible PortalUser type for existing components
export interface PortalUser {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: 'partner' | 'donor' | 'admin';
  accessLevel: 'standard' | 'elevated';
}

// Helper to convert NextAuth session to PortalUser for existing components
export function sessionToPortalUser(session: SessionWithPortal | null): PortalUser | null {
  if (!session?.user?.email) return null;

  const isStaff = session.user.email.endsWith('@greenshillings.org');
  const isPartner = session.role === 'PARTNER';

  return {
    id: session.user.email,
    email: session.user.email,
    name: session.user.name || 'Team Member',
    organization: session.organizationName || 'GREENSHILLINGS',
    role: isStaff ? 'admin' : isPartner ? 'partner' : 'admin',
    accessLevel: isStaff ? 'elevated' : 'standard',
  };
}

// Internal portal user type
export interface InternalUser {
  email: string;
  name: string;
}

// Helper to convert NextAuth session to InternalUser (requires @greenshillings.org)
export function sessionToInternalUser(session: { user?: { name?: string | null; email?: string | null; image?: string | null } } | null): InternalUser | null {
  if (!session?.user?.email?.endsWith('@greenshillings.org')) return null;

  return {
    email: session.user.email,
    name: session.user.name || 'Team Member',
  };
}

// Helper to check if current session is admin/staff
export function isStaffSession(session: SessionWithPortal | null): boolean {
  return !!session?.user?.email?.endsWith('@greenshillings.org');
}
