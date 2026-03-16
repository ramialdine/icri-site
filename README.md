This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

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

## Embedded CMS (Sanity Studio)

This project now includes an embedded CMS at [http://localhost:3000/studio](http://localhost:3000/studio).

### 1) Configure environment variables

Copy `.env.example` to `.env.local` and set:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` (usually `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` (already defaulted)

To protect Studio behind HTTP Basic Auth, also set:

- `STUDIO_BASIC_AUTH_USER`
- `STUDIO_BASIC_AUTH_PASSWORD`
- `STUDIO_BASIC_AUTH_COOKIE_DAYS` (optional, default `365`)

When set, all `/studio/*` routes require login before loading the Studio UI.
After first successful login, a secure HTTP-only cookie is set so users typically
won't be prompted again until the cookie expires.

### 1.1) Keep Studio less discoverable

- Keep `robots` disabled for Studio (already configured in the Studio layout).
- Do not link `/studio` publicly in your main navigation.
- Add an additional hosting firewall/rate-limit rule for `/studio/*` (Vercel/Cloudflare) for bot suppression.

### 2) Content models included

- `prayerConfig` (biweekly Week A/Week B iqama defaults)
- `dateOverride` (any-date overrides, including Jumu'ah)
- `announcement`
- `event`
- `program`

### 3) Prayer logic

- Adhan times are always fetched from AlAdhan API.
- Iqama times are resolved from Sanity (date override first, then biweekly defaults).
- If CMS data is missing/unavailable, fallback offsets are used.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
