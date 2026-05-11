This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Configure Environment Variables

Before running the development server, you need to configure Supabase authentication:

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
   ```

**Where to get these values:**
- Go to your [Supabase project dashboard](https://app.supabase.com)
- Navigate to Settings > API
- Copy the Project URL and anon/public key

**Need help?** See the complete setup guide: [../AUTHENTICATION_SETUP.md](../AUTHENTICATION_SETUP.md)

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes |

**Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in these variables.

## Authentication Features

This application includes:
- ✅ Email/password authentication
- ✅ Google OAuth login
- ✅ GitHub OAuth login
- ✅ Protected routes (requires authentication)
- ✅ Session management with automatic token refresh
- ✅ Graceful degradation when Supabase is not configured

### Testing Authentication

1. **Sign Up**: Visit `/signup` to create a new account
2. **Sign In**: Visit `/login` to sign in with email/password or OAuth
3. **Dashboard**: Visit `/dashboard` (requires authentication)
4. **Sign Out**: Use the sign out button in the navigation

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication routes
│   │   └── callback/      # OAuth callback handler
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── dashboard/         # Protected dashboard page
├── components/            # React components
└── lib/                   # Utility libraries
    ├── supabase.ts        # Supabase client configuration
    ├── AuthContext.tsx    # Authentication context provider
    └── api.ts             # API client for backend
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
