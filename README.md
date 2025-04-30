## OSFS Formation

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and integrated with [Supabase](https://supabase.com) for authentication and database features.

## Getting Started

### Setting up Supabase

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Copy your Supabase URL and anon key from the project settings
3. Create a `.env.local` file in the root of the project with the following content:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Running the development server

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

## Project Structure

The project follows a structured organization:

- `/src/app`: Application routes and page components
- `/src/components`: Reusable UI components
- `/src/lib`: Core utilities and services
- `/src/hooks`: Custom hooks for stateful logic
- `/src/services`: API calls and data processing
- `/src/types`: TypeScript type definitions
- `/src/contexts`: React Context definitions
- `/supabase`: Supabase configuration files

## Technology Stack

- **Next.js 15**: React framework with App Router
- **Supabase**: Backend as a Service for auth and database
- **Tailwind CSS v4**: Utility-first CSS framework with @theme directive
- **TypeScript**: Type-safe JavaScript
- **Zod**: Schema validation library

## Database Migrations

To apply database migrations:

```bash
npx supabase migration up
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
