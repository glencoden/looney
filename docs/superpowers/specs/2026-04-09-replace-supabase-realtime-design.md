# Replace Supabase Realtime with Polling

## Goal

Remove Supabase Realtime dependency from the frontend apps. Supabase should only be used as a database going forward. Replace the three realtime subscriptions with polling via tRPC queries.

## Context

The monorepo has three Remix apps (cloud, tool, sing) and shared packages (api, db). The backend runs on Vercel serverless functions, which rules out SSE/WebSocket-based approaches like tRPC subscriptions with an in-process EventEmitter.

Current Supabase Realtime usage (3 subscriptions, all cache invalidation):

1. **Cloud app `useLips.ts`** — listens for `INSERT` on `lip` table filtered by `session_id`, invalidates `lip.getBySessionId`
2. **Tool app `useAutoScreen.ts`** — listens for `*` on `session` table, invalidates `session.getCurrent`
3. **Tool app `useAutoScreen.ts`** — listens for `*` on `lip` table, invalidates `lip.getLiveBySessionId`

## Design

### New query: `getLipDigestBySessionId`

Location: `packages/db/src/queries/getLipDigestBySessionId.ts`

Returns `{ count: number; lastUpdatedAt: Date | null }` for a given session's lips. Uses `COUNT(*)` and `MAX(updated_at)` — a single aggregation query with no joins.

### New tRPC procedure: `lip.getSessionDigest`

Location: added to the existing `lipRouter` in `packages/api/src/trpc/router/lipRouter.ts`

- `publicProcedure`
- Input: `z.object({ id: z.string() })` (sessionId, matching existing lip router conventions)
- Returns the digest from the new query

### Client changes: `useLips.ts` (cloud app)

- Remove the supabase channel subscription (`useEffect` with `supabase.channel('lip')`)
- Remove the `supabase` import
- Add `lip.getSessionDigest` query with `refetchInterval: 3000`
- When digest values change compared to what was seen on the last full fetch, call `utils.lip.getBySessionId.invalidate()` to refetch the full list
- Use a `useRef` to track the last-seen digest and compare on each poll

### Client changes: `useAutoScreen.ts` (tool app)

- Remove both supabase channel subscriptions (the two `useEffect` blocks with `supabase.channel`)
- Remove the `supabase` import
- Add `refetchInterval: 1000` to `session.getCurrent` query
- Change `refetchInterval` on `lip.getLiveBySessionId` from `5000` to `1000`

### Cleanup

- Delete `apps/tool/app/lib/supabase.client.ts` — tool only used it for realtime
- Remove `@supabase/supabase-js` from tool app's dependencies
- Keep `apps/cloud/app/lib/supabase.client.ts` — still needed for auth (signin, signout, session check, tRPC auth headers) until better-auth migration

## What stays unchanged

- All existing queries and tRPC procedures
- `TRPCQueryClientProvider` and its `supabaseClient` prop (used for auth headers in cloud)
- `apps/cloud/app/lib/supabase.client.ts` (auth)
- The sing app (no realtime usage)
