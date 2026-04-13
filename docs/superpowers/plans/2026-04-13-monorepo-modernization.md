# Monorepo Modernization — Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the looney monorepo by upgrading to React 19, migrating cloud and sing apps from Remix 2 to Next.js App Router, converting tool to a Vite SPA, upgrading website to Astro 6, and upgrading all major dependencies.

**Architecture:** The migration follows a risk-first approach — a React 19 spike validates the riskiest dependency (react-spring) before committing to the full plan. Each phase is independently deployable. Shared packages (@repo/api, @repo/ui, @repo/db, @repo/utils) are upgraded first so apps can migrate one at a time.

**Tech Stack:** React 19, Next.js App Router, Vite SPA, Astro 6, tRPC v11 (with @trpc/tanstack-react-query), Tailwind CSS 4, ESLint 9 flat config, TypeScript 5.x (staying on 5, not upgrading to 6)

**Decision: TypeScript stays on 5.x** — TypeScript 6 is not considered stable enough yet.

---

## Dependency Graph

```
Phase 1: Spike React 19 + react-spring (cloud app)
    │
    ├── FAIL → Phase 1b: Replace react-spring with motion
    │              │
    │              └── RE-TEST → decide go/no-go
    │
    └── PASS (go/no-go decision)
           │
           ▼
Phase 2: React 19 monorepo-wide
    │
    ├──────────────────────┬──────────────────────┐
    ▼                      ▼                      ▼
Phase 3:              Phase 4:              Phase 5:
cloud → Next.js       sing → Next.js        tool → Vite SPA
    │                      │                      │
    └──────────┬───────────┘                      │
               ▼                                  │
         Phase 6: Shared tRPC upgrade             │
         (@trpc/tanstack-react-query)             │
               │                                  │
               └──────────────┬───────────────────┘
                              ▼
                        Phase 7: Cleanup
                        (remove Remix deps,
                         old configs, empty apps)

Independent (any time after Phase 2):
  - Phase W: website → Astro 6
  - Phase E: ESLint 8 → 9 flat config
  - Phase D: Major dep upgrades (Stripe, OpenAI, react-intl, lucide-react)
```

---

## Phase 1: Spike — React 19 in cloud app

**Goal:** Validate that the cloud app runs on React 19, specifically the session drag-drop page that uses react-spring.

**Branch:** `spike/react-19`

**Risk being tested:** react-spring v10 has open bugs with its imperative `useSprings` / `.start()` API on React 19 (pmndrs/react-spring#2376, #2404, #2385). The cloud app's session management page relies heavily on this exact API.

### Task 1.1: Update React to 19 in pnpm catalog

**Files:**
- Modify: `pnpm-workspace.yaml:16-17` (react, react-dom)
- Modify: `pnpm-workspace.yaml:15` (@types/react)
- Modify: `pnpm-workspace.yaml` (add @types/react-dom if not present)

- [ ] **Step 1: Create spike branch**

```bash
git checkout -b spike/react-19
```

- [ ] **Step 2: Update the pnpm catalog**

In `pnpm-workspace.yaml`, change:

```yaml
# FROM
'@types/react': ^18.3.28
'@types/react-dom': ^18.3.7
react: ^18.3.1
react-dom: ^18.3.1

# TO
'@types/react': ^19.2.0
'@types/react-dom': ^19.2.0
react: ^19.2.0
react-dom: ^19.2.0
```

- [ ] **Step 3: Install dependencies**

```bash
pnpm install
```

Expected: Dependency resolution succeeds. If peer dependency conflicts appear, note which packages conflict — these are the first compatibility signals.

### Task 1.2: Fix type errors across shared packages

**Files:**
- Potentially modify: `packages/ui/src/components/Input.tsx`
- Potentially modify: `packages/ui/src/components/Button.tsx`
- Potentially modify: `packages/ui/src/components/Textarea.tsx`
- Potentially modify: `packages/ui/src/components/Select.tsx`
- Potentially modify: `apps/cloud/app/components/DragDropList.tsx`

React 19 type changes to watch for:
- `forwardRef` is no longer needed — `ref` is a regular prop. Existing `forwardRef` code still works but types may complain.
- `ReactElement` now requires two type params in some contexts.
- `useRef(null)` now requires an explicit type argument in strict mode.

- [ ] **Step 1: Run typecheck across the monorepo**

```bash
pnpm typecheck 2>&1 | head -100
```

- [ ] **Step 2: Fix type errors one package at a time**

Start with leaf packages (no internal deps), work up:
1. `@repo/utils` — `pnpm --filter @repo/utils typecheck`
2. `@repo/db` — `pnpm --filter @repo/db typecheck`
3. `@repo/ui` — `pnpm --filter @repo/ui typecheck`
4. `@repo/api` — `pnpm --filter @repo/api typecheck`
5. `cloud` — `pnpm --filter cloud typecheck`

Common fixes:
- If `forwardRef` types break, convert to `ref` as prop:
  ```tsx
  // FROM (React 18)
  const Input = forwardRef<HTMLInputElement, Props>((props, ref) => { ... })

  // TO (React 19)
  function Input({ ref, ...props }: Props & { ref?: React.Ref<HTMLInputElement> }) { ... }
  ```
- If `useRef(null)` complains: add explicit type `useRef<HTMLDivElement>(null)`

- [ ] **Step 3: Verify full typecheck passes**

```bash
pnpm typecheck
```

Expected: Clean exit with no type errors.

### Task 1.3: Build and run the cloud app

**Files:**
- None expected — this is a verification step

- [ ] **Step 1: Build the cloud app**

```bash
pnpm --filter cloud build
```

Expected: Successful build. If it fails, note the errors — they likely come from Remix/Vite plugin compatibility with React 19.

- [ ] **Step 2: Start the dev server**

```bash
pnpm --filter cloud dev
```

- [ ] **Step 3: Smoke test basic pages**

Open `http://localhost:3000` in the browser. Check:
- Does the app load?
- Does sign-in work?
- Do the song list, setlist pages render?
- Do forms (create song, edit song) work?

### Task 1.4: Test the session drag-drop page

This is the critical test. The session management page at `/session/:sessionId` uses:
- `useSprings()` for animating lists of lip items
- `useSpring()` for the live action item
- `useDrag()` from @use-gesture for drag-to-reorder
- Imperative `.start()` calls via `create-spring-effect.ts`
- `animated.div` wrappers in `DragDropListItem.tsx`

**Files being tested (not modified):**
- `apps/cloud/app/routes/session.$sessionId.tsx`
- `apps/cloud/app/components/DragDropList.tsx`
- `apps/cloud/app/components/DragDropListItem.tsx`
- `apps/cloud/app/helpers/create-spring-effect.ts`

- [ ] **Step 1: Create or navigate to a test session**

You need a session with multiple lips (song queue entries) to test drag-drop. Create one via the UI or use an existing one.

- [ ] **Step 2: Test drag-drop reordering**

On the session page, test:
1. Drag a lip item up/down in the idle list — does the spring animation play?
2. Drag a lip from idle to selected — does it animate across zones?
3. Drag to reorder within selected — smooth?
4. Do animations fire on every drag, or only every second time? (regression #2404)
5. Does the live action item animate correctly?
6. On mobile viewport (resize browser below `md` breakpoint) — does the page swipe gesture work?

- [ ] **Step 3: Record results**

Document what works and what doesn't. Possible outcomes:

**A. Everything works** → Proceed to Phase 2. The react-spring bugs may not affect our specific usage patterns.

**B. Animations break** → Proceed to Phase 1b (replace react-spring with motion).

**C. Build/runtime errors unrelated to react-spring** → Fix them, re-test.

---

## Phase 1b: Replace react-spring with motion (conditional)

**Goal:** Only if Phase 1 Task 1.4 shows broken animations. Replace react-spring + use-gesture with `motion` (formerly framer-motion) for the session drag-drop page.

**Branch:** Continue on `spike/react-19`

**Files:**
- Modify: `apps/cloud/package.json` — remove `@react-spring/web`, `@use-gesture/react`, add `motion`
- Rewrite: `apps/cloud/app/routes/session.$sessionId.tsx` — replace spring/gesture code with motion
- Rewrite: `apps/cloud/app/components/DragDropList.tsx` — replace animated.div with motion.div
- Rewrite: `apps/cloud/app/components/DragDropListItem.tsx` — replace animated.div with motion.div
- Delete: `apps/cloud/app/helpers/create-spring-effect.ts` — no longer needed
- Reference: `motion` docs for `Reorder` component and drag gestures

### Task 1b.1: Install motion, remove react-spring

- [ ] **Step 1: Swap dependencies**

```bash
cd /Users/simonmeyer/glencoden/looney
pnpm --filter cloud remove @react-spring/web @use-gesture/react
pnpm --filter cloud add motion
```

- [ ] **Step 2: Verify install**

```bash
pnpm --filter cloud list motion
```

### Task 1b.2: Rewrite drag-drop with motion

This task requires understanding the current drag-drop architecture and mapping it to motion's API. The current implementation manages three lists (idle, selected, live) with cross-list dragging. Motion's `Reorder.Group` + `Reorder.Item` handles single-list reordering natively; cross-list dragging requires custom drag logic with `motion.div` + `drag` prop.

- [ ] **Step 1: Rewrite DragDropListItem.tsx**

Replace `animated.div` with `motion.div`. Replace spring-based style bindings with motion's `animate` prop and `layout` prop for automatic layout animations.

- [ ] **Step 2: Rewrite DragDropList.tsx**

Replace `useSprings` return values with motion's `AnimatePresence` for enter/exit animations and `layout` for reorder animations.

- [ ] **Step 3: Rewrite session.$sessionId.tsx**

Replace `useSprings()`, `useSpring()`, `useDrag()` with motion's declarative `drag`, `dragConstraints`, `onDragEnd` props. Replace the imperative `create-spring-effect.ts` with motion's declarative `animate` and `transition` props.

- [ ] **Step 4: Delete create-spring-effect.ts**

```bash
rm apps/cloud/app/helpers/create-spring-effect.ts
```

- [ ] **Step 5: Verify — re-run Task 1.4 tests**

Test all drag-drop interactions again with the motion-based implementation.

---

## Phase 2: React 19 monorepo-wide

**Goal:** Upgrade all apps and packages to React 19. After Phase 1 validates the cloud app, extend React 19 to the remaining apps.

**Prerequisite:** Phase 1 passes (with or without Phase 1b).

**Branch:** `feat/react-19` (from `develop`, cherry-pick or merge spike work)

### Task 2.1: Merge spike results into a clean branch

- [ ] **Step 1: Create feature branch, bring in spike changes**

The catalog changes from the spike already affect all packages. Create a proper branch and bring in the type fixes and any react-spring replacement from the spike.

### Task 2.2: Fix type errors in remaining apps

**Files:**
- Potentially modify: files in `apps/sing/`, `apps/tool/`, `apps/website/`

- [ ] **Step 1: Typecheck each app**

```bash
pnpm --filter sing typecheck
pnpm --filter tool typecheck
pnpm --filter website typecheck
```

- [ ] **Step 2: Fix errors following the same patterns as Task 1.2**

### Task 2.3: Build and smoke test each app

- [ ] **Step 1: Build all apps**

```bash
pnpm build
```

- [ ] **Step 2: Dev server each app and smoke test**

- `sing` (port 3002): Guest flow — browse songs, pick one, check tip page
- `tool` (port 3003): Load lyrics, test keyboard navigation, test syllable highlighting
- `website`: `pnpm --filter website dev` — check all pages render

### Task 2.4: Commit and PR

- [ ] **Step 1: Commit all React 19 changes**
- [ ] **Step 2: Create PR targeting develop**

---

## Phase 3: Migrate cloud to Next.js App Router

**Goal:** Rewrite the cloud admin dashboard from Remix 2 to Next.js 15 App Router.

**Prerequisite:** Phase 2 complete (React 19 on develop).

**Branch:** `feat/cloud-nextjs`

**Approach:** Create a new Next.js app alongside the existing Remix app, migrate route by route, then swap. This avoids a big-bang rewrite.

### Task 3.1: Scaffold Next.js app

**Files:**
- Create: `apps/cloud-next/` (new Next.js app directory)
- Create: `apps/cloud-next/package.json`
- Create: `apps/cloud-next/next.config.ts`
- Create: `apps/cloud-next/tsconfig.json`
- Create: `apps/cloud-next/app/layout.tsx` (root layout with providers)

- [ ] **Step 1: Create the Next.js app in the monorepo**

```bash
cd /Users/simonmeyer/glencoden/looney/apps
pnpm create next-app cloud-next --typescript --tailwind --app --src-dir=false --import-alias="~/*"
```

- [ ] **Step 2: Wire up workspace dependencies**

Add `@repo/api`, `@repo/db`, `@repo/ui`, `@repo/utils`, `@repo/config-tailwind` as workspace deps. Remove any boilerplate not needed.

- [ ] **Step 3: Configure Tailwind**

Import `@repo/config-tailwind/base` in the global CSS. Configure `content` paths to include `../../packages/ui/src/**/*.tsx`.

- [ ] **Step 4: Set up root layout**

Create `app/layout.tsx` with:
- Font preloading (Google Fonts, matching current setup)
- `@repo/ui/styles.css` import
- TRPCQueryClientProvider wrapper
- Metadata (title, description, icons)

### Task 3.2: Set up tRPC for Next.js App Router

**Files:**
- Create: `apps/cloud-next/app/api/trpc/[trpc]/route.ts`
- Create: `apps/cloud-next/lib/trpc/client.tsx`
- Create: `apps/cloud-next/lib/trpc/server.ts`
- Create: `apps/cloud-next/lib/trpc/query-client.ts`

- [ ] **Step 1: Create the tRPC API route handler**

Uses `fetchRequestHandler` from `@trpc/server/adapters/fetch` — same adapter the Remix app uses. Mount the shared `trpcRouter` from `@repo/api/server`. Create context with better-auth session extraction.

- [ ] **Step 2: Create the tRPC client provider**

`'use client'` component that provides `TRPCReactProvider` with `httpBatchLink` to `/api/trpc`.

- [ ] **Step 3: Create the server-side tRPC caller**

For Server Components that need to call tRPC procedures directly without going through HTTP.

### Task 3.3: Set up better-auth for Next.js

**Files:**
- Create: `apps/cloud-next/lib/auth.ts` (server-side auth config)
- Create: `apps/cloud-next/lib/auth-client.ts` (client-side auth)
- Create: `apps/cloud-next/app/api/auth/[...all]/route.ts` (auth API route)
- Create: `apps/cloud-next/middleware.ts` (auth middleware)

- [ ] **Step 1: Configure better-auth server**

Same config as current `auth.server.ts` — Drizzle adapter, Google OAuth, same schema tables.

- [ ] **Step 2: Create auth API catch-all route**

Replaces current `api.auth.$.ts` Remix route.

- [ ] **Step 3: Create auth middleware**

Protect all routes except `/signin` and `/api/auth/*`. Redirect unauthenticated users to `/signin`.

- [ ] **Step 4: Create client-side auth helper**

`createAuthClient()` for sign-in/sign-out triggers from client components.

### Task 3.4: Migrate routes — static/CRUD pages

Migrate the simpler routes first, one at a time. Each route becomes a Next.js App Router page.

**Route mapping:**

| Remix route | Next.js route | Type |
|---|---|---|
| `_index.tsx` | `app/page.tsx` | Server Component + client widget |
| `signin.tsx` | `app/signin/page.tsx` | Client Component |
| `signout.tsx` | `app/signout/page.tsx` | Client Component |
| `songs.tsx` | `app/songs/layout.tsx` | Server Component (layout) |
| `songs._index.tsx` | `app/songs/page.tsx` | Server Component |
| `songs.$songId.tsx` | `app/songs/[songId]/page.tsx` | Server Component |
| `songs.$songId_.edit.tsx` | `app/songs/[songId]/edit/page.tsx` | Client Component (form) |
| `songs.create.tsx` | `app/songs/create/page.tsx` | Client Component (form) |
| `songs.$songId.destroy.tsx` | Server Action (no page needed) | — |
| `setlists.tsx` | `app/setlists/layout.tsx` | Server Component (layout) |
| `setlists._index.tsx` | `app/setlists/page.tsx` | Server Component |
| `setlists.$setlistId.tsx` | `app/setlists/[setlistId]/page.tsx` | Server Component |
| `setlists.$setlistId_.edit.tsx` | `app/setlists/[setlistId]/edit/page.tsx` | Client Component (form) |
| `setlists.create.tsx` | `app/setlists/create/page.tsx` | Client Component (form) |
| `setlists.$setlistId.destroy.tsx` | Server Action | — |
| `insights.tsx` | `app/insights/page.tsx` | Server Component |
| `session._index.tsx` | `app/session/page.tsx` | Client Component (form) |
| `session.$sessionId.tsx` | `app/session/[sessionId]/page.tsx` | Client Component (drag-drop) |
| `session.$sessionId.close.tsx` | Server Action | — |
| `session.$sessionId.destroy.tsx` | Server Action | — |

- [ ] **Step 1: Migrate songs pages** (representative CRUD)

Convert the songs list, detail, create, edit, and delete routes. Use Server Components for list and detail pages. Use Server Actions for create/update/delete mutations. This establishes the pattern for all CRUD routes.

- [ ] **Step 2: Migrate setlists pages** (same pattern as songs)

- [ ] **Step 3: Migrate insights page**

- [ ] **Step 4: Migrate auth pages** (signin, signout)

- [ ] **Step 5: Migrate home page**

### Task 3.5: Migrate the session drag-drop page

This is the most complex page. It stays as a Client Component since it's entirely interactive.

**Files:**
- Create: `apps/cloud-next/app/session/[sessionId]/page.tsx`
- Copy + adapt: `DragDropList.tsx`, `DragDropListItem.tsx`, helpers

- [ ] **Step 1: Create the session page as a Client Component**

The page itself is `'use client'`. Data fetching via tRPC hooks (same pattern as current). The loader-to-React-Query hydration pattern is no longer needed — tRPC handles it natively in Next.js.

- [ ] **Step 2: Copy over animation components**

Bring `DragDropList`, `DragDropListItem`, and `create-spring-effect` (or their motion equivalents if Phase 1b was needed).

- [ ] **Step 3: Test drag-drop thoroughly**

Same test checklist as Phase 1 Task 1.4.

### Task 3.6: Swap deployment

- [ ] **Step 1: Update Vercel project to point at `apps/cloud-next`**

Next.js on Vercel needs no special adapter (unlike `@vercel/remix`).

- [ ] **Step 2: Verify environment variables are set**

Same env vars as current cloud app (DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, etc.)

- [ ] **Step 3: Deploy and smoke test in preview**

- [ ] **Step 4: Remove old `apps/cloud` directory**

Only after the new app is stable in production.

---

## Phase 4: Migrate sing to Next.js App Router

**Goal:** Rewrite the guest-facing karaoke app from Remix 2 to Next.js App Router, optimizing for mobile performance with Server Components.

**Prerequisite:** Phase 2 complete. Can run in parallel with Phase 3 (no shared files modified).

**Branch:** `feat/sing-nextjs`

### Task 4.1: Scaffold Next.js app

Same pattern as Phase 3 Task 3.1 — create `apps/sing-next/`, wire up workspace deps, configure Tailwind.

### Task 4.2: Set up tRPC for Next.js

Same pattern as Phase 3 Task 3.2 — API route handler, client provider, server caller. The sing app does NOT need auth middleware (guests are unauthenticated), but it does need the tRPC context to pass `user: null`.

### Task 4.3: Set up i18n with next-intl

**Files:**
- Create: `apps/sing-next/i18n/` (config and message files)
- Migrate: translation files from `apps/sing/app/translations/`

- [ ] **Step 1: Install and configure next-intl**

Replace `react-intl` with `next-intl`. This is the recommended i18n library for Next.js App Router — it supports Server Components natively, which `react-intl` does not.

- [ ] **Step 2: Migrate translation files**

The current compiled message format (from `@formatjs/cli`) needs to be converted to next-intl's message format. The 18 translation keys are simple enough to convert manually.

- [ ] **Step 3: Set up locale detection**

Replace the current Remix loader-based `accept-language-parser` detection with next-intl's middleware-based detection.

### Task 4.4: Migrate routes

**Route mapping:**

| Remix route | Next.js route | Type |
|---|---|---|
| `($guestId).tsx` | `app/[guestId]/layout.tsx` | Server Component |
| `($guestId).songs.tsx` | `app/[guestId]/songs/page.tsx` | Server Component (song list) |
| `($guestId).feedback.tsx` | `app/[guestId]/feedback/page.tsx` | Server Component + Server Action |
| `($guestId).tip.tsx` | `app/[guestId]/tip/page.tsx` | Client Component (Stripe) |
| `create.$guestId.$songId.tsx` | `app/create/[guestId]/[songId]/page.tsx` | Server Component + Client form |
| `start.$resetId.tsx` | `app/start/[resetId]/page.tsx` | Server Component (creates guest, redirects) |

Key optimization opportunity: The song list page (`($guestId).songs.tsx`) currently ships ~64KB of client JS for search filtering. As a Server Component with `searchParams`-based search, it ships zero client JS for the list rendering.

- [ ] **Step 1: Migrate the guest layout** (`[guestId]/layout.tsx`)

Server Component that fetches guest + session data. No client JS needed for the layout.

- [ ] **Step 2: Migrate the songs page as a Server Component**

Render the song list server-side. Use `searchParams` for search filtering instead of `useState`. Only the search input is a small Client Component.

- [ ] **Step 3: Migrate the feedback page**

Server Component with a Server Action for the form submission. Replaces the current tRPC mutation.

- [ ] **Step 4: Migrate the tip page**

Client Component — Stripe checkout must run client-side. Lazy-load `@stripe/stripe-js` as before.

- [ ] **Step 5: Migrate the song creation page**

Server Component for data display + Client Component for the form.

- [ ] **Step 6: Migrate the start route**

Server Component that creates a guest and redirects. Pure server-side, no client JS.

### Task 4.5: Swap deployment

Same pattern as Phase 3 Task 3.6. Update Vercel project, verify env vars, deploy preview, remove old `apps/sing`.

---

## Phase 5: Convert tool to Vite SPA

**Goal:** Strip the tool app down to a pure Vite + React SPA. No SSR, no routing framework.

**Prerequisite:** Phase 2 complete (React 19).

**Branch:** `feat/tool-vite-spa`

### Task 5.1: Create Vite SPA configuration

**Files:**
- Rewrite: `apps/tool/package.json` — remove Remix deps, add plain vite
- Rewrite: `apps/tool/vite.config.ts` — plain Vite React config
- Create: `apps/tool/index.html` — SPA entry point
- Rewrite: `apps/tool/app/` → `apps/tool/src/` (conventional SPA structure)

- [ ] **Step 1: Remove Remix dependencies**

```bash
pnpm --filter tool remove @remix-run/react @remix-run/dev @remix-run/node @vercel/remix
pnpm --filter tool add -D @vitejs/plugin-react
```

- [ ] **Step 2: Create index.html entry point**

Standard SPA index.html with a `<div id="root">` and `<script type="module" src="/src/main.tsx">`.

- [ ] **Step 3: Rewrite vite.config.ts**

Plain Vite config with `@vitejs/plugin-react` and `@tailwindcss/vite`. No Remix plugin.

- [ ] **Step 4: Create main.tsx entry**

Standard React 19 `createRoot` entry. Wrap in `TRPCQueryClientProvider`.

### Task 5.2: Configure tRPC client to point at cloud API

The tool app currently hosts its own tRPC endpoint. As a pure SPA, it needs to call an external API.

**Options (decide at implementation time):**
- Point at cloud's `/api/trpc` endpoint (simplest, adds CORS config to cloud)
- Deploy a standalone API server (more work, cleaner separation)

- [ ] **Step 1: Configure tRPC httpBatchLink with the API URL**

Use an environment variable `VITE_API_URL` for the tRPC endpoint.

### Task 5.3: Migrate the single-page app

- [ ] **Step 1: Move route content to a single App component**

The current `_index.tsx` route content becomes the main `App.tsx`. Remove all Remix routing concepts. The app is a single page.

- [ ] **Step 2: Keep all existing logic intact**

Text parsing classes, WebSocket auto-lyrics hook, keyboard controls, auto-screen hook — all stay the same.

- [ ] **Step 3: Test**

Run `pnpm --filter tool dev`, verify lyrics display, keyboard navigation, and WebSocket connection.

---

## Phase 6: Shared tRPC upgrade to @trpc/tanstack-react-query

**Goal:** Migrate from the classic `@trpc/react-query` to the new `@trpc/tanstack-react-query` integration across cloud and sing.

**Prerequisite:** Phases 3 and 4 complete (both apps on Next.js).

**Branch:** `feat/trpc-tanstack-integration`

**Why:** The new integration is more TanStack Query-native, avoids Rules of Hooks issues, is compatible with React Compiler, and is the recommended path for new projects. Since both apps are being rewritten anyway, this is the natural time to adopt it.

- [ ] **Step 1: Install @trpc/tanstack-react-query alongside @trpc/react-query**

They coexist — migrate incrementally.

- [ ] **Step 2: Migrate provider setup in @repo/api**

Update `packages/api/src/trpc/provider/index.tsx` to use the new integration.

- [ ] **Step 3: Migrate client usage in each app**

Replace `api.foo.bar.useQuery()` with `useTRPC()` + `useQuery(trpc.foo.bar.queryOptions())`.

- [ ] **Step 4: Remove @trpc/react-query**

Once all usage is migrated, remove the old package.

---

## Phase W: Website → Astro 6 (independent)

**Goal:** Upgrade the marketing site from Astro 5 to Astro 6.

**Prerequisite:** Phase 2 (React 19), since @astrojs/react needs compatible versions.

**Branch:** `feat/website-astro-6`

- [ ] **Step 1: Upgrade astro and @astrojs/react**

```bash
pnpm --filter website add astro@^6 @astrojs/react@^5
```

- [ ] **Step 2: Follow Astro 6 migration guide**

Check for breaking changes in config format, content collections, or build behavior.

- [ ] **Step 3: Build and test all pages**

Verify events (Google Calendar), songs (DB), contact, references all render correctly.

---

## Phase E: ESLint 8 → 9 flat config (independent)

**Goal:** Migrate from ESLint 8 with `.eslintrc.cjs` files to ESLint 9 with flat config (`eslint.config.js`).

**Prerequisite:** None. Can be done any time.

**Branch:** `feat/eslint-9`

**Scope:** Rewrite `packages/config-eslint/` to export flat config objects instead of the legacy `.eslintrc` format. Remove all `.eslintrc.cjs` files from apps and packages.

- [ ] **Step 1: Upgrade eslint in catalog to ^9.x**
- [ ] **Step 2: Upgrade @typescript-eslint/* to v8 (required for ESLint 9)**
- [ ] **Step 3: Rewrite shared configs as flat config**
- [ ] **Step 4: Replace .eslintrc.cjs in each app/package with eslint.config.js**
- [ ] **Step 5: Run lint across the monorepo, fix any new violations**

---

## Phase D: Major dependency upgrades (independent)

**Goal:** Upgrade remaining outdated major dependencies.

**Prerequisite:** Phase 2 for React-dependent packages. Otherwise independent.

**Can be done incrementally — one dep at a time:**

| Dependency | From | To | Notes |
|---|---|---|---|
| `stripe` | ^18.5.0 | ^22.x | Check API changelog for breaking changes in @repo/api |
| `@stripe/stripe-js` | ^7.9.0 | ^9.x | Client-side, used in sing tip page |
| `openai` | ^5.23.2 | ^6.x | Check for API changes in @repo/api openai.ts |
| `react-intl` | ^7.1.14 | — | Replaced by `next-intl` in Phase 4; remove from sing |
| `lucide-react` | ^0.540.0 | ^1.x | Icon names may have changed; grep for all imports |
| `googleapis` | ^144.0.0 | ^171.x | Used in website for Google Calendar |
| `vite` | ^5.4.21 | ^8.x | Upgrade after Next.js migration (Next.js uses Turbopack) |

---

## Phase 7: Cleanup

**Goal:** Remove old code, empty directories, unused dependencies.

**Prerequisite:** All migration phases complete.

- [ ] Remove `apps/cloud/` (old Remix app, replaced by `apps/cloud-next/` → rename to `apps/cloud/`)
- [ ] Remove `apps/sing/` (old Remix app, replaced by `apps/sing-next/` → rename to `apps/sing/`)
- [ ] Remove `apps/setlist/` and `apps/tool-electron/` (empty placeholder directories)
- [ ] Remove Remix-related entries from pnpm catalog (`@remix-run/*`, `@vercel/remix`)
- [ ] Remove `vite` from catalog if no longer used (Next.js uses Turbopack, tool uses plain Vite with its own version)
- [ ] Clean up `packages/config-typescript/` — remove `remix.json` if no longer needed
- [ ] Clean up `packages/config-eslint/` — remove `remix.js` config
- [ ] Audit all workspace packages for unused dependencies
