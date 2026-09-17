# Chatter — Real-time chat app (React + Node/Express + MongoDB)

A WhatsApp-style messaging platform with three pieces:

```
whatsapp-clone/
├── server/   Express + MongoDB + Socket.IO API and real-time layer
├── client/   The messaging app your users sign into (React + Vite)
└── admin/    Internal dashboard for managing users & conversations (React + Vite)
```

## Features

- Email/password auth (JWT), with passwords hashed via bcrypt
- 1:1 real-time messaging over Socket.IO, with a REST fallback for sending
- Online/offline presence, "last seen", and typing indicators
- Message delivery/read status
- Search for people and start a new conversation
- Admin dashboard: live-ish stats, user search/suspend/delete, conversation oversight

## Prerequisites

- Node.js 18+
- A MongoDB database — either local (`mongodb://127.0.0.1:27017`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

## 1. Server setup

```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI and a real JWT_SECRET
npm install
npm run seed   # optional: creates admin@chatter.local / amara@.. / ben@.. (password: ChangeMe123!)
npm run dev    # starts on http://localhost:5000
```

Change the seeded passwords (or delete the seed accounts) before using this anywhere but your own machine.

## 2. Client app setup

```bash
cd client
cp .env.example .env.local
npm install
npm run dev    # http://localhost:5173
```

## 3. Admin app setup

```bash
cd admin
cp .env.example .env.local
npm install
npm run dev    # http://localhost:5174
```

Sign in with the seeded `admin@chatter.local` account (or promote a real user by setting
`role: 'admin'` on their document in MongoDB).

## Production build

Each frontend builds independently:

```bash
cd client && npm run build   # outputs client/dist
cd admin  && npm run build   # outputs admin/dist
```

Deploy `client/dist` and `admin/dist` as static sites (Netlify, Vercel, S3+CloudFront, etc.) on
**separate subdomains** (e.g. `chat.example.com` and `admin.chat.example.com`) — don't put the
admin app on a path under the main domain, since it holds moderation powers over every user.
A `_redirects` file is included in both `public/` folders so client-side routing works on
static hosts that support it (Netlify-style); Vercel/other hosts need an equivalent SPA rewrite
rule pointing everything at `index.html`.

Deploy `server/` to any Node host (Render, Railway, Fly.io, a VPS, etc.) and point
`VITE_API_URL` / `VITE_SOCKET_URL` in both frontends at its public URL.

## Before you go live: replace the placeholders

Search both `client/` and `admin/` for `chat.example.com` and swap in your real domain — it
appears in `index.html`, `robots.txt`, `sitemap.xml`, `llm.txt`, and the `Seo`/`Breadcrumbs`
components. Also fill in the `LocalBusiness` JSON-LD block in `client/src/pages/LandingPage.jsx`
with your real company name and address, or delete that block entirely if Chatter is offered
purely as a web service with no physical business location — `LocalBusiness` schema is only
appropriate when the latter is true.

## Where each of your production/SEO requirements lives

| Requirement | Where |
|---|---|
| Meta descriptions | `index.html` + the `Seo` component (unique per route) |
| Custom 404 page | `NotFoundPage.jsx` in both `client` and `admin` |
| Breadcrumbs | `Breadcrumbs.jsx` (used across every admin page) |
| Alt text on images | `Avatar` (`aria-label`), `BrandMark` (`title` when meaningful), hero mock (`aria-label`) — there are no bare `<img>` tags without accessible names |
| Unique heading per page | Every page has exactly one `<h1>` |
| Canonical tags | `Seo.jsx` (client) sets `<link rel="canonical">` per route |
| Structured data | Organization + SoftwareApplication (`index.html`), BreadcrumbList (`Breadcrumbs.jsx`), LocalBusiness (`LandingPage.jsx`, fill in first) |
| Unique page titles | `Seo.jsx` in both apps |
| Console errors | No stray `console.log`; the only `console.error` calls are genuine error paths (failed sends, server startup failures) |
| No prod source maps | `vite.config.js` in both apps: `sourcemap: mode !== 'production'` |
| robots.txt | `client/public/robots.txt` (allows marketing pages, blocks `/app/`), `admin/public/robots.txt` (blocks everything) |
| llm.txt | `client/public/llm.txt` |
| Local business schema | `LandingPage.jsx` (placeholder — fill in or remove, see above) |
| No placeholder copy | All UI text is real product copy; the only placeholders left are config values (domain, company address) called out above |
| Favicon | Real generated icon set: `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` |
| sitemap.xml | `client/public/sitemap.xml` (admin is excluded — it's `noindex`) |
| Social share images | `client/public/social-share.png` (1200×630, referenced by Open Graph/Twitter tags) |
| Smaller JS bundles | Vendor code-splitting (`manualChunks`) + a `chunkSizeWarningLimit` in both `vite.config.js` files |

## Honesty about "no mistakes"

Every server file was checked with `node --check`, and every client/admin file was checked with
`esbuild`, so there are no syntax errors anywhere in this codebase. What I could **not** do inside
this sandbox: run a real MongoDB instance, `npm install` the full dependency trees, or click
through the running apps end-to-end (no outbound access to install everything, run three long-lived
processes, and browser-test them here). I'd genuinely recommend running through the flows yourself
before treating this as production-ready: register two accounts, message between them in two
browser windows, and check the admin dashboard against real data. If something breaks, tell me
what you saw and I'll fix it directly.

## Extending this

Straightforward next additions if you want them: group chats, image/file attachments, message
search, push notifications, and rate-limiting on the socket layer. None of these are in this build
— ask if you want any of them added.
