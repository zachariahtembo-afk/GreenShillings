# Green Shillings Authentication System

This document explains how the authentication system works and how to use it.

## Overview

The Green Shillings platform now has a complete JWT-based authentication system for the investor dashboard. The system includes:

- User registration and login endpoints
- Password hashing with bcrypt
- JWT token generation and validation
- Protected API routes
- Authenticated web pages

## Architecture

### Backend (API)

- **Authentication Module** (`apps/api/src/auth.ts`): Contains all auth logic

  - Password hashing and comparison
  - JWT token generation and verification
  - Authentication middleware
  - Login, register, and getCurrentUser functions

- **Database** (Prisma schema): User model with the following fields:
  - `id`: Unique identifier
  - `email`: Unique email address
  - `passwordHash`: Bcrypt hashed password
  - `name`: User's full name
  - `role`: User role (default: "user", can be "admin", "investor", etc.)
  - `isActive`: Boolean flag to enable/disable accounts
  - `lastLoginAt`: Timestamp of last successful login

### Frontend (Web)

- **Login Page** (`apps/web/src/app/dashboard/login/page.tsx`): User-facing login form
- **Middleware** (`apps/web/src/middleware.ts`): Protects dashboard routes
- **API Utilities** (`apps/web/src/lib/api.ts`): Helper functions for authenticated requests

## Setup

### 1. Environment Variables

Add the following to your `.env` file (or use the values in `env.example`):

```bash
# API
JWT_SECRET="your-secret-jwt-key-change-this-in-production"

# Web
NEXT_PUBLIC_API_URL="http://127.0.0.1:4000"
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

### 2. Database Setup

The User model has been added to the Prisma schema. Make sure your database is up to date:

```bash
cd apps/api
npm run db:push  # or use your preferred migration method
```

### 3. Create an Admin User

To create your first admin user for testing:

```bash
cd apps/api
npm run create-admin
```

This will create an admin user with:

- Email: `admin@greenshillings.org`
- Password: `admin123`

You can customize these values with environment variables:

```bash
ADMIN_EMAIL="your@email.com" ADMIN_PASSWORD="yourpassword" npm run create-admin
```

## API Endpoints

### POST /auth/register

Register a new user.

**Request:**

```json
{
  "email": "investor@example.com",
  "password": "securepassword",
  "name": "John Investor",
  "role": "investor" // optional, defaults to "user"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "investor@example.com",
    "name": "John Investor",
    "role": "investor"
  }
}
```

### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "investor@example.com",
  "password": "securepassword"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxx...",
    "email": "investor@example.com",
    "name": "John Investor",
    "role": "investor"
  }
}
```

### GET /auth/me

Get current user information (requires authentication).

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

```json
{
  "user": {
    "id": "clxxx...",
    "email": "investor@example.com",
    "name": "John Investor",
    "role": "investor",
    "isActive": true,
    "lastLoginAt": "2025-01-15T10:30:00.000Z",
    "createdat": "2025-01-10T08:00:00.000Z"
  }
}
```

## Using Authentication in Your Code

### Frontend (Web App)

The login page automatically handles authentication and stores the JWT token in a cookie.

To make authenticated API requests:

```typescript
import { authenticatedRequest, getCurrentUser, logout } from '@/lib/api';

// Get current user
const user = await getCurrentUser();

// Make authenticated request
const data = await authenticatedRequest('/some/protected/endpoint');

// Logout
logout();
```

### Backend (API)

To protect API routes, use the `authenticateToken` middleware:

```typescript
import { authenticateToken, AuthRequest } from './auth';

app.get('/protected-route', authenticateToken, async (req: AuthRequest, res) => {
  // req.user contains { userId, email, role }
  const currentUser = req.user;

  res.json({ message: `Hello ${currentUser.email}` });
});
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with a salt factor of 10
2. **JWT Tokens**: Tokens expire after 7 days
3. **Account Status**: Users can be deactivated by setting `isActive` to false
4. **Protected Routes**: Dashboard routes require valid JWT token
5. **HTTPS Required**: In production, ensure all traffic uses HTTPS

## Testing

1. Start the API server:

   ```bash
   cd apps/api
   npm run dev
   ```

2. Start the web server:

   ```bash
   cd apps/web
   npm run dev
   ```

3. Navigate to `http://localhost:4001/dashboard/login`

4. Login with your admin credentials:

   - Email: `admin@greenshillings.org`
   - Password: `admin123`

5. You should be redirected to `/dashboard` if login is successful

## Troubleshooting

### "Invalid credentials" error

- Check that the email and password are correct
- Verify the user exists in the database
- Ensure the user's `isActive` field is `true`

### "Access token required" error

- The JWT token is missing or invalid
- The token may have expired (7 days)
- Clear cookies and login again

### CORS errors

- Ensure `CORS_ORIGIN` in your API `.env` includes your web app URL
- Default: `http://localhost:4001`

## Next Steps

Consider implementing:

- Password reset functionality
- Email verification
- Two-factor authentication (2FA)
- Session management
- Refresh tokens
- Role-based access control (RBAC) for different user types
