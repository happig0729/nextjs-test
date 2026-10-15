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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Todo Demo Features

- Todo CRUD via REST API (`/api/todos`, `/api/todos/[id]`)
- Month calendar view: todos with a due date show a marker on that day (green when all done, amber when items remain)
- Click a day to filter the list to that day; click again or "查看全部" to clear the filter
- The add form takes a date (defaults to the selected day); each todo has a date input to reschedule or clear its due date

### Local Development

```bash
# .env (not committed)
DATABASE_URL="file:./dev.db"

npm install
npx prisma migrate deploy
npm run dev
```

### Build & Verification

```bash
npm run lint
npm run build
```

Note: do not run `next build` with `NODE_ENV=development` in the environment. It overrides the production NODE_ENV that Next.js sets internally and triggers a known Next.js 16 / React 19.2 framework bug while prerendering `/_global-error` (`TypeError: Cannot read properties of null (reading 'useContext')`), unrelated to application code.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use [Vercel Platform](https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
