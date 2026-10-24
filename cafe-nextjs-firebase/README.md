# Kettle & Fern – Cafe website (Next.js + Firebase)

A production-oriented scaffold for a cafe website: **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Firebase** (Auth, Firestore, Storage, App Hosting).

"Kettle & Fern" and every address, phone number and price are **placeholders** – replace them in `src/config/site.ts`.

**The site works with zero credentials.** Without any environment variables it renders the built-in sample menu and hours, hides WhatsApp buttons, shows a static location card instead of the map, and shows an Instagram fallback. Each integration switches on when you provide its credentials.

---

## Contents

1. [Quick start](#quick-start)
2. [Technology stack and versions](#technology-stack-and-versions)
3. [Folder structure](#folder-structure)
4. [Architecture](#architecture)
5. [Features and how to configure them](#features-and-how-to-configure-them)
6. [Environment variables](#environment-variables)
7. [Firebase setup](#firebase-setup)
8. [Deployment (Firebase App Hosting)](#deployment-firebase-app-hosting)
9. [Security model and hardening](#security-model-and-hardening)
10. [Testing and quality](#testing-and-quality)
11. [Verification status – what was and was not tested](#verification-status)
12. [Manual configuration checklist](#manual-configuration-checklist)

---

## Quick start

Requires **Node.js ≥ 22.12** (`.nvmrc` pins 22).

```bash
npm install
cp .env.example .env.local     # optional: everything has a fallback
npm run dev                    # http://localhost:3000
```

| Script                                 | Purpose                                              |
| -------------------------------------- | ---------------------------------------------------- |
| `npm run dev` / `build` / `start`      | Next.js development / production build / serve       |
| `npm run check`                        | Typecheck + lint + unit tests (run before commits)   |
| `npm run typecheck` · `lint` · `test`  | Individually                                         |
| `npm run format` / `format:check`      | Prettier (with Tailwind class sorting)               |
| `npm run emulators`                    | Firebase Auth/Firestore/Storage emulators + UI :4000 |
| `npm run seed [-- --force]`            | Write sample menu + hours to Firestore               |
| `npm run set-admin -- you@example.com` | Grant the `admin` claim (`--revoke` to remove)       |

---

## Technology stack and versions

| Area          | Choice                                           | Notes                                                                                                               |
| ------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Framework     | Next.js **16.4**, React **19.3**                 | App Router, Server Components, Server Actions, `proxy.ts` (Next 16's replacement for `middleware.ts`)               |
| Language      | TypeScript **~6.0**                              | Strict + `noUncheckedIndexedAccess`. **Not 7.x**: `typescript-eslint` currently supports `<6.1`                     |
| Styling       | Tailwind CSS **4.3** (CSS-first `@theme`)        | Design tokens in `src/app/globals.css`                                                                              |
| Backend       | `firebase` **12.19** · `firebase-admin` **14.5** | **Not firebase 13.x**: it requires Node ≥ 24.12; 12.19 runs on Node 22 and 24. Upgrade when your runtime is Node 24 |
| Validation    | Zod **4**                                        | Env vars, Firestore documents, form input, API responses                                                            |
| Lint / format | ESLint **9.39**, Prettier 3                      | **Not ESLint 10**: `eslint-config-next`'s React / a11y plugins don't support it yet                                 |
| Tests         | Vitest **5** + Testing Library + jsdom           | Vite 8 is required by `@vitejs/plugin-react` 6                                                                      |
| Fonts         | Bricolage Grotesque + Instrument Sans            | **Self-hosted** in `src/assets/fonts` (OFL licences included); Latin subset only                                    |

Dependencies are deliberately minimal – no UI kit, no state library, no class-name helper library.

---

## Folder structure

```
cafe-nextjs-firebase/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/   # static assets
│   └── images/
│       └── hero.svg
├── scripts/   # CLI: seed, set-admin
│   ├── seed-firestore.ts
│   └── set-admin-claim.ts
├── src/
│   ├── app/   # routes, layouts, metadata, boundaries
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── login/
│   │   │       │   └── page.tsx
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx
│   │   ├── (site)/
│   │   │   ├── menu/
│   │   │   │   ├── loading.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── visit/
│   │   │   │   └── page.tsx
│   │   │   ├── error.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── loading.tsx
│   │   │   └── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── session/
│   │   │   │       └── route.ts
│   │   │   └── health/
│   │   │       └── route.ts
│   │   ├── global-error.tsx
│   │   ├── globals.css
│   │   ├── icon.svg
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   ├── not-found.tsx
│   │   ├── opengraph-image.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── assets/
│   │   └── fonts/   # self-hosted fonts
│   │       ├── bricolage-grotesque-latin-wght-normal.woff2
│   │       ├── instrument-sans-latin-wght-normal.woff2
│   │       ├── LICENSE-bricolage-grotesque.txt
│   │       └── LICENSE-instrument-sans.txt
│   ├── components/   # feature-agnostic UI
│   │   ├── layout/
│   │   │   ├── HeaderNav.tsx
│   │   │   ├── SiteFooter.tsx
│   │   │   ├── SiteHeader.tsx
│   │   │   ├── SiteShell.tsx
│   │   │   └── SkipLink.tsx
│   │   ├── seo/
│   │   │   └── JsonLd.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Container.tsx
│   │       ├── icons.tsx
│   │       ├── Section.tsx
│   │       ├── Skeleton.tsx
│   │       └── StateMessage.tsx
│   ├── config/   # typed site configuration
│   │   └── site.ts
│   ├── data/
│   │   └── seed/   # sample menu/hours (fallback + seed)
│   │       ├── hours.ts
│   │       └── menu.ts
│   ├── features/   # one folder per business capability
│   │   ├── admin/
│   │   │   ├── components/
│   │   │   │   └── AvailabilityToggle.tsx
│   │   │   └── actions.ts
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   ├── server/
│   │   │   │   └── session.ts
│   │   │   └── constants.ts
│   │   ├── home/
│   │   │   └── components/
│   │   │       ├── FeaturedItems.tsx
│   │   │       └── Hero.tsx
│   │   ├── hours/
│   │   │   ├── components/
│   │   │   │   ├── OpeningHoursTable.tsx
│   │   │   │   └── OpenStatusBadge.tsx
│   │   │   ├── lib/
│   │   │   │   ├── format.ts
│   │   │   │   └── open-status.ts
│   │   │   └── server/
│   │   │       └── hours.service.ts
│   │   ├── instagram/
│   │   │   ├── components/
│   │   │   │   └── InstagramSection.tsx
│   │   │   ├── providers/
│   │   │   │   ├── graph-api.provider.ts
│   │   │   │   ├── mapper.ts
│   │   │   │   ├── static.provider.ts
│   │   │   │   └── types.ts
│   │   │   └── server/
│   │   │       └── instagram.service.ts
│   │   ├── location/
│   │   │   ├── components/
│   │   │   │   ├── LocationCard.tsx
│   │   │   │   └── MapEmbed.tsx
│   │   │   └── lib/
│   │   │       └── maps-links.ts
│   │   ├── menu/
│   │   │   ├── components/
│   │   │   │   ├── DietaryBadges.tsx
│   │   │   │   ├── MenuCategoryNav.tsx
│   │   │   │   ├── MenuItemRow.tsx
│   │   │   │   ├── MenuSection.tsx
│   │   │   │   └── MenuSkeleton.tsx
│   │   │   ├── lib/
│   │   │   │   └── build-menu.ts
│   │   │   └── server/
│   │   │       ├── menu.repository.ts
│   │   │       └── menu.service.ts
│   │   └── whatsapp/
│   │       ├── components/
│   │       │   ├── WhatsAppButton.tsx
│   │       │   └── WhatsAppFab.tsx
│   │       └── lib/
│   │           ├── link.ts
│   │           └── messages.ts
│   ├── hooks/   # shared React hooks
│   │   ├── useDisclosure.ts
│   │   └── useNow.ts
│   ├── lib/   # env, Firebase init, utilities
│   │   ├── firebase/
│   │   │   ├── admin.ts
│   │   │   ├── client.ts
│   │   │   └── collections.ts
│   │   ├── seo/
│   │   │   └── json-ld.ts
│   │   ├── utils/
│   │   │   ├── async.ts
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   ├── logger.ts
│   │   │   └── url.ts
│   │   ├── env.server.ts
│   │   └── env.ts
│   ├── schemas/   # Zod schemas (source of truth)
│   │   ├── auth.ts
│   │   ├── common.ts
│   │   ├── hours.ts
│   │   ├── instagram.ts
│   │   └── menu.ts
│   ├── types/   # inferred types
│   │   └── index.ts
│   └── proxy.ts
├── tests/   # Vitest unit + component tests
│   ├── components/
│   │   └── status-and-whatsapp.test.tsx
│   ├── stubs/
│   │   └── server-only.ts
│   ├── unit/
│   │   ├── hours/
│   │   │   └── open-status.test.ts
│   │   ├── instagram/
│   │   │   ├── instagram.test.ts
│   │   │   └── service.test.ts
│   │   ├── location/
│   │   │   └── maps-links.test.ts
│   │   ├── menu/
│   │   │   └── build-menu.test.ts
│   │   ├── schemas/
│   │   │   └── env.test.ts
│   │   ├── utils/
│   │   └── whatsapp/
│   │       └── link.test.ts
│   └── setup.ts
├── .editorconfig
├── .env.example
├── .firebaserc.example
├── .gitignore
├── .nvmrc
├── .prettierignore
├── .prettierrc.json
├── apphosting.yaml
├── eslint.config.mjs
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── storage.rules
├── tsconfig.json
└── vitest.config.mts
```

---

## Architecture

### Layering (dependencies point downward only)

```
app/ (routes, layouts, metadata)
  └─ features/<name>/components, server, lib   (one folder per business capability)
       └─ components/ui, components/layout     (feature-agnostic building blocks)
            └─ lib/, schemas/, config/, hooks/ (framework-free utilities & contracts)
```

- **`src/app`** – only routing concerns: layouts, `page.tsx`, metadata, boundaries. Pages compose feature components; they hold no business logic.
- **`src/features/*`** – each feature owns its UI (`components/`), server-only data access (`server/`) and pure logic (`lib/`). Features don't import each other's internals (the home page composes them).
- **`src/schemas`** – Zod schemas = single source of truth. Types in `src/types` are inferred from them, so runtime validation and compile-time types cannot drift.
- **`src/lib/firebase`** – `client.ts` (browser SDK, lazy), `admin.ts` (**server-only**, the only file allowed to import `firebase-admin`).
- **`src/data/seed`** – sample menu/hours: fallback content _and_ the source for `npm run seed`.

### Data flow & resilience

```
Request → Server Component → service (menu.service / hours.service)
            ├─ Firebase Admin configured? → Firestore → Zod-validate each doc (invalid docs skipped + logged)
            └─ otherwise / on error / on timeout (8 s) / if empty → built-in seed data
```

Pages use ISR (`export const revalidate = 300`), so Firestore is read at most every 5 minutes per page and the site stays up if Firestore is down. Admin changes call `revalidatePath` for instant updates.

"Open now" is computed **in the browser** (`useNow` + `getOpenStatus`) so cached pages never show a stale state, and it uses the **cafe's** timezone, not the visitor's.

### Security boundaries

| Boundary                        | Mechanism                                                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Secrets never reach the browser | `import 'server-only'` on `env.server.ts`, `firebase/admin.ts`, services; only `NEXT_PUBLIC_*` is in `env.ts`       |
| Admin SDK confined to one file  | ESLint `no-restricted-imports` bans `firebase-admin` everywhere except `src/lib/firebase/admin.ts` and `scripts/`   |
| Admin area                      | `proxy.ts` (optimistic redirect) **plus** `requireAdmin()` in every admin page and Server Action (real check)       |
| Sessions                        | Firebase session cookie: `HttpOnly`, `Secure` (prod), `SameSite=Lax`, 5 days, revocation-checked, named `__session` |
| Privilege                       | `admin` custom claim, set only via `npm run set-admin`; enforced by Firestore/Storage rules _and_ server code       |
| Third-party tokens              | Instagram token read server-side only; error messages never include the request URL                                 |

---

## Features and how to configure them

### 1. Home page

`src/features/home` – hero (`Hero.tsx`), featured items (items with `isFeatured: true`), hours + map, Instagram. Edit the tagline/description in `src/config/site.ts`. Replace `public/images/hero.svg` with a photo (e.g. `hero.jpg`) and update `siteConfig.hero`. The generated social image is `src/app/opengraph-image.tsx`.

### 2. Menu

`/menu` – categories → items with price, description, dietary badges, optional image, "Sold out today" state. Data: Firestore `menuCategories` + `menuItems` (see the models in `src/schemas/menu.ts`). **Prices are integers in minor units** (`450` = 4.50); currency/locale come from `siteConfig`. Staff can mark items sold out at `/admin`.

### 3. WhatsApp

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` (international digits, no `+`, e.g. `15551234567`) and optionally `NEXT_PUBLIC_WHATSAPP_MESSAGE` (`{cafe}` is replaced with the name). Produces `https://wa.me/<number>?text=<encoded message>` links in the header, footer, a floating button on mobile, and page CTAs. More templates: `src/features/whatsapp/lib/messages.ts`. With no number, every button disappears.

### 4. Google Maps

- **Directions** and "Open in Google Maps" use keyless Maps URLs – always work. Set the address in `siteConfig.address` (optionally `maps.placeId`).
- **Interactive embed:** create a key in Google Cloud Console, enable **Maps Embed API**, restrict it to **HTTP referrers** (your domains) and to that API only, then set `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`. Without it a static location card is shown.

### 5. Opening hours

Stored in Firestore `settings/hours` (falls back to `src/data/seed/hours.ts`). Supports multiple intervals per day, closed days (`[]`), overnight hours (`18:00 → 01:00`), holiday overrides (`exceptions`) and an IANA `timezone`. Also emitted as schema.org JSON-LD for search engines. Logic: `src/features/hours/lib/open-status.ts` (pure, fully unit-tested).

### 6. Instagram

Provider pattern (`src/features/instagram/providers`). Priority: **Instagram API** (needs `INSTAGRAM_ACCESS_TOKEN`) → **curated posts** (`siteConfig.instagram.curatedPosts`) → **fallback card** linking to `@NEXT_PUBLIC_INSTAGRAM_HANDLE`. Any failure degrades to the next option; the page never errors. Responses are cached for 1 hour.

To enable live posts: use an Instagram **professional** account, create an app in Meta for Developers with the Instagram API (Instagram Login), generate a **long-lived token**, store it as a secret (`firebase apphosting:secrets:set instagramAccessToken`). Long-lived tokens expire after about 60 days and must be refreshed (Meta's `refresh_access_token` endpoint) – automate this with a scheduled job before relying on it. _The endpoint and fields used (`graph.instagram.com/me/media`) follow Meta's documented API but were not tested against a live account – check Meta's current docs._

To add a new source (e.g. a third-party widget API), implement `InstagramProvider` and add it to the list in `instagram.service.ts`.

---

## Environment variables

Copy `.env.example` → `.env.local` (git-ignored). **All are optional.** `NEXT_PUBLIC_*` values are public and inlined at build time.

| Variable                                                                                                            | Scope      | Purpose                                                                          |
| ------------------------------------------------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                                                              | public     | Canonical URL for metadata/sitemap/JSON-LD                                       |
| `NEXT_PUBLIC_FIREBASE_API_KEY`, `_AUTH_DOMAIN`, `_PROJECT_ID`, `_STORAGE_BUCKET`, `_MESSAGING_SENDER_ID`, `_APP_ID` | public     | Firebase web app config (safe to expose; protected by Auth + rules)              |
| `NEXT_PUBLIC_USE_FIREBASE_EMULATORS`                                                                                | public     | `true` → browser SDK uses local emulators                                        |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_WHATSAPP_MESSAGE`                                                       | public     | WhatsApp links                                                                   |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY`                                                                             | public     | Maps Embed (referrer-restricted)                                                 |
| `NEXT_PUBLIC_INSTAGRAM_HANDLE`                                                                                      | public     | Profile link / fallback card                                                     |
| `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`                                                                     | **secret** | Local-dev service account for the Admin SDK. **Not needed on App Hosting** (ADC) |
| `GOOGLE_APPLICATION_CREDENTIALS`                                                                                    | **secret** | Alternative: path to a service-account JSON kept _outside_ the repo              |
| `FIRESTORE_EMULATOR_HOST`, `FIREBASE_AUTH_EMULATOR_HOST`, `FIREBASE_STORAGE_EMULATOR_HOST`                          | local      | Point the Admin SDK at emulators                                                 |
| `INSTAGRAM_ACCESS_TOKEN`                                                                                            | **secret** | Instagram API token                                                              |

Malformed values (bad URL, invalid phone number…) fail fast at startup with a readable message (`src/lib/env.ts`).

---

## Firebase setup

1. **Create a project** at <https://console.firebase.google.com> (Blaze plan is required for App Hosting).
2. **Add a Web app** → copy the config into the `NEXT_PUBLIC_FIREBASE_*` variables.
3. **Authentication** → enable **Email/Password**; add the owner/staff under _Users_.
4. **Firestore** → create a database (production mode). **Storage** → create the default bucket.
5. **Link the CLI:** `npm i -g firebase-tools && firebase login`, then `cp .firebaserc.example .firebaserc` and set your project ID.
6. **Deploy rules:** `firebase deploy --only firestore:rules,firestore:indexes,storage`
7. **Admin credentials for local development** (skip if you only use emulators): Project settings → Service accounts → _Generate new private key_. Put `client_email` / `private_key` into `.env.local` (or point `GOOGLE_APPLICATION_CREDENTIALS` at the file). **Never commit it** – `.gitignore` already blocks `*-service-account*.json`.
8. **Seed content:** `npm run seed`
9. **Create the first admin:** `npm run set-admin -- owner@example.com`, then sign in at `/admin/login`.

### Local development with emulators (no cloud, no credentials)

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-cafe
NEXT_PUBLIC_FIREBASE_API_KEY=demo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost
NEXT_PUBLIC_FIREBASE_APP_ID=demo
NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
```

Run `npm run emulators` in one terminal, then `npm run seed`, create a user in the Emulator UI (<http://localhost:4000>), `npm run set-admin -- that@email`, and `npm run dev`.

### Firestore data model

| Path                  | Fields                                                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `menuCategories/{id}` | `name`, `slug`, `description?`, `sortOrder`, `isActive`                                                                    |
| `menuItems/{id}`      | `categoryId`, `name`, `description?`, `priceMinor`, `imageUrl?`, `dietaryTags[]`, `isAvailable`, `isFeatured`, `sortOrder` |
| `settings/hours`      | `timezone`, `weekly{monday…sunday: [{open,close}]}`, `exceptions[{date,label?,intervals}]`                                 |

Security rules (`firestore.rules`, `storage.rules`): public read for menu/settings/menu images, writes only with the `admin` claim and with server-side-style field validation; everything else denied. The Admin SDK used by the Next.js server bypasses rules by design.

---

## Deployment (Firebase App Hosting)

1. Edit `apphosting.yaml`: replace every `REPLACE_ME` / placeholder value. `NEXT_PUBLIC_*` need `availability: [BUILD, RUNTIME]`.
2. Create secrets: `firebase apphosting:secrets:set instagramAccessToken`, then uncomment the matching block in `apphosting.yaml`.
3. Create the backend: `firebase apphosting:backends:create --project <id>` (use backend ID `cafe-web`, matching `firebase.json`) and connect your GitHub repo. Every push to the live branch builds and rolls out.
4. App Hosting's runtime service account provides Application Default Credentials – grant it Firestore access (`roles/datastore.user`) and Firebase Auth admin (`roles/firebaseauth.admin`) if not already present.
5. Add your custom domain in the App Hosting console and set `NEXT_PUBLIC_SITE_URL` to it.
6. **Check:** `/api/health`, `/menu`, then sign in at `/admin/login`.

Other hosts (Vercel, Cloud Run) work too: set the same variables and provide Admin credentials via the platform's secret store.

---

## Security model and hardening

Already in place: server-only secrets, validated env, Admin-SDK import boundary, cookie sessions with revocation checking, re-authentication window for session creation, same-origin check on the session endpoint, per-action auth + Zod validation, default-deny rules, security headers (`nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS), `noindex` + `robots` exclusion for `/admin`, external links with `rel="noopener noreferrer"`, JSON-LD escaping.

Recommended before launch:

- **Content-Security-Policy** with per-request nonces (needs a `proxy.ts` extension; not included because a wrong CSP breaks Next.js hydration).
- **Firebase App Check** + **rate limiting** (e.g. Cloud Armor) on `/api/auth/session` to blunt credential stuffing; enable Firebase Auth's brute-force protections and consider MFA for admin accounts.
- **Restrict the Maps key** (referrers + Embed API only) and set a Google Cloud **budget alert**.
- Rotate the Instagram token on a schedule; never log it.
- Add Firestore **rules unit tests** with `@firebase/rules-unit-testing` against the emulator (not included to keep dependencies lean).
- Turn on **Dependabot/Renovate** and `npm audit` in CI.

---

## Testing and quality

- **53 unit/component tests** (`tests/`): open-hours logic (overnight, split shifts, exceptions, DST, timezone), WhatsApp link building, maps URLs, menu grouping and schemas, Instagram mapping/provider/fallback, env validation, and badge/table/button components.
- **CI** (`.github/workflows/ci.yml`): typecheck → lint → format check → tests → build, on every PR.
- **Accessibility built in:** skip link, landmarks, one `h1` per page, labelled sections, visible focus (colour flips on dark surfaces), 48 px touch targets, table semantics for hours, `aria-current`, text-not-colour status, `prefers-reduced-motion` respected (including the SVG animation), alt text, `lang` attribute. Run an automated audit (Lighthouse / axe) and a manual screen-reader pass before launch.

---

## Verification status

Verified in the build sandbox (Node 22.22, npm 10.9) on the scaffold as delivered:

| Check                                                                                                                                                                                                          | Result  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `npm install` – no peer-dependency conflicts or `ERESOLVE`                                                                                                                                                     | ✅ pass |
| `tsc --noEmit` (strict)                                                                                                                                                                                        | ✅ pass |
| `eslint .` (includes the Admin-SDK boundary rule; it caught and I fixed one violation)                                                                                                                         | ✅ pass |
| `vitest run` – 8 files, 53 tests                                                                                                                                                                               | ✅ pass |
| `next build` (Turbopack) – 13 routes, no credentials set                                                                                                                                                       | ✅ pass |
| `next start` smoke test: `/`, `/menu`, `/visit`, `/robots.txt`, `/sitemap.xml`, manifest, OG image, icon, health → 200; unknown path → 404; `/admin` → 307 to login; session API → clean 503 when unconfigured | ✅ pass |
| Same with WhatsApp / Maps key / Instagram handle + a fake token: wa.me links, map iframe, Instagram fallback card rendered                                                                                     | ✅ pass |
| Secret hygiene: fake Instagram token absent from HTML, client JS chunks and server logs; no `firebase-admin` / private-key strings in client bundle                                                            | ✅ pass |

**Not verified (needs your credentials or environment):**

- Connecting to a real Firebase project: Firestore reads, Auth sign-in → session-cookie flow, Server Action writes, deployed security rules (the rules were written carefully but **not run against the emulator**).
- `npm run seed` / `npm run set-admin` against Firebase (the scripts typecheck and lint, but were not executed).
- Firebase App Hosting deployment and `apphosting.yaml` acceptance.
- The live Instagram API and a real Google Maps Embed key.
- Behaviour on Node 24 and in real browsers/devices (no visual regression, Lighthouse or screen-reader testing was done).
- The `firebase@13` upgrade path.

---

## Manual configuration checklist

- [ ] Replace placeholder identity, address, phone, email, currency, timezone in `src/config/site.ts`
- [ ] Replace `public/images/hero.svg` and the generated OG image with real photography
- [ ] Create the Firebase project; fill `NEXT_PUBLIC_FIREBASE_*`; create `.firebaserc`
- [ ] Deploy `firestore.rules` and `storage.rules`; run `npm run seed`; edit the real menu and hours
- [ ] Create the owner account and run `npm run set-admin`
- [ ] (Optional) WhatsApp number · Maps Embed key (restricted) · Instagram handle + token
- [ ] Fill `apphosting.yaml`, create secrets, connect the GitHub repo, add the custom domain
- [ ] Review the hardening list above; run Lighthouse/axe and a manual accessibility pass
