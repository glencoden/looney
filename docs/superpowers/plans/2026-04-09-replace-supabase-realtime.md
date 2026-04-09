# Replace Supabase Realtime with Polling — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Supabase Realtime from the frontend apps by replacing the three realtime subscriptions with lightweight polling via tRPC queries.

**Architecture:** Add a cheap digest query (`COUNT + MAX(updated_at)`) for lips. The cloud app polls the digest and only refetches the full lip list when it changes. The tool app polls its already-lightweight queries directly at 1s intervals. After the change, the tool app has zero Supabase dependency.

**Tech Stack:** Drizzle ORM, tRPC v11, React Query, Remix

---

### File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `packages/db/src/queries/getLipDigestBySessionId.ts` | Aggregation query returning count + lastUpdatedAt |
| Modify | `packages/db/src/queries/index.ts` | Export the new query |
| Modify | `packages/api/src/trpc/router/lip/lipRouter.ts` | Add `getSessionDigest` procedure |
| Modify | `apps/cloud/app/hooks/useLips.ts` | Replace supabase channel with digest polling |
| Modify | `apps/tool/app/hooks/useAutoScreen.ts` | Replace supabase channels with refetchInterval |
| Delete | `apps/tool/app/lib/supabase.client.ts` | No longer needed |
| Modify | `apps/tool/package.json` | Remove `@supabase/supabase-js` |

---

### Task 1: Add `getLipDigestBySessionId` query

**Files:**
- Create: `packages/db/src/queries/getLipDigestBySessionId.ts`
- Modify: `packages/db/src/queries/index.ts`

- [ ] **Step 1: Create the query file**

Create `packages/db/src/queries/getLipDigestBySessionId.ts`:

```ts
import { count, eq, max } from 'drizzle-orm'
import { db, Session } from '../index.js'
import { lipsTable } from '../schema/lipsTable.js'

export const getLipDigestBySessionId = async (sessionId: Session['id']) => {
    const [result] = await db
        .select({
            count: count(),
            lastUpdatedAt: max(lipsTable.updatedAt),
        })
        .from(lipsTable)
        .where(eq(lipsTable.sessionId, sessionId))

    return {
        count: result?.count ?? 0,
        lastUpdatedAt: result?.lastUpdatedAt ?? null,
    }
}
```

- [ ] **Step 2: Export from queries index**

In `packages/db/src/queries/index.ts`, add alongside the other lip query exports:

```ts
export { getLipDigestBySessionId } from './getLipDigestBySessionId.js'
```

- [ ] **Step 3: Verify it compiles**

Run: `pnpm --filter @repo/db build`
Expected: successful tsc compilation with no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/db/src/queries/getLipDigestBySessionId.ts packages/db/src/queries/index.ts
git commit -m "feat(db): add getLipDigestBySessionId query"
```

---

### Task 2: Add `lip.getSessionDigest` tRPC procedure

**Files:**
- Modify: `packages/api/src/trpc/router/lip/lipRouter.ts`

- [ ] **Step 1: Add the import**

In `packages/api/src/trpc/router/lip/lipRouter.ts`, add `getLipDigestBySessionId` to the import from `@repo/db/queries`:

```ts
import {
    createDemoLip,
    createLip,
    getLipDigestBySessionId,
    getLipsByGuestId,
    getLipsBySessionId,
    getLiveLipBySessionId,
    moveLip,
    updateLip,
} from '@repo/db/queries'
```

- [ ] **Step 2: Add the procedure**

Add the `getSessionDigest` procedure to the `lipRouter` object, after `getLiveBySessionId`:

```ts
    getSessionDigest: publicProcedure
        .input(SessionSchema.pick({ id: true }))
        .query(({ input }) => {
            return getLipDigestBySessionId(input.id)
        }),
```

- [ ] **Step 3: Verify it compiles**

Run: `pnpm --filter @repo/db build && pnpm --filter @repo/api build`
Expected: successful tsc compilation with no errors.

- [ ] **Step 4: Commit**

```bash
git add packages/api/src/trpc/router/lip/lipRouter.ts
git commit -m "feat(api): add lip.getSessionDigest procedure"
```

---

### Task 3: Replace supabase realtime in `useLips.ts` (cloud app)

**Files:**
- Modify: `apps/cloud/app/hooks/useLips.ts`

- [ ] **Step 1: Rewrite the hook**

Replace the full contents of `apps/cloud/app/hooks/useLips.ts` with:

```ts
import { api } from '@repo/api/client'
import { Session } from '@repo/db'
import { useEffect, useRef } from 'react'

export const useLips = (sessionId: Session['id']) => {
    const utils = api.useUtils()

    const { data: digest } = api.lip.getSessionDigest.useQuery(
        { id: sessionId },
        { refetchInterval: 3000 },
    )

    const prevDigestRef = useRef(digest)

    useEffect(() => {
        const prev = prevDigestRef.current
        prevDigestRef.current = digest

        if (!prev || !digest) {
            return
        }

        const hasChanged =
            prev.count !== digest.count ||
            prev.lastUpdatedAt?.getTime() !== digest.lastUpdatedAt?.getTime()

        if (hasChanged) {
            void utils.lip.getBySessionId.invalidate({ id: sessionId })
        }
    }, [digest, utils, sessionId])

    return api.lip.getBySessionId.useQuery({ id: sessionId })
}
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm --filter @repo/db build && pnpm --filter @repo/api build && pnpm --filter cloud build`
Expected: successful build with no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/cloud/app/hooks/useLips.ts
git commit -m "refactor(cloud): replace supabase realtime with digest polling in useLips"
```

---

### Task 4: Replace supabase realtime in `useAutoScreen.ts` (tool app)

**Files:**
- Modify: `apps/tool/app/hooks/useAutoScreen.ts`

- [ ] **Step 1: Rewrite the hook**

Replace the full contents of `apps/tool/app/hooks/useAutoScreen.ts` with:

```ts
import { api } from '@repo/api/client'
import { Session, Song } from '@repo/db'
import { skipToken } from '@tanstack/react-query'
import { useMemo } from 'react'

type Response =
    | {
          type: 'idle'
      }
    | {
          type: 'home'
          sessionTitle: Session['title']
      }
    | {
          type: 'lyrics'
          sessionTitle: Session['title']
          songId: Song['id']
      }

export const useAutoScreen = ({
    isDisabled,
}: {
    isDisabled?: boolean
}): Response => {
    const { data: session } = api.session.getCurrent.useQuery(undefined, {
        refetchInterval: 1000,
    })

    const { data: liveLip } = api.lip.getLiveBySessionId.useQuery(
        session ? { id: session.id } : skipToken,
        {
            refetchInterval: 1000,
        },
    )

    const isSessionActive =
        Boolean(session) && !session!.isLocked && session!.endsAt > new Date()

    return useMemo(() => {
        if (!isSessionActive || isDisabled) {
            return {
                type: 'idle',
            }
        }
        if (!liveLip) {
            return {
                type: 'home',
                sessionTitle: session!.title,
            }
        }
        return {
            type: 'lyrics',
            sessionTitle: session!.title,
            songId: liveLip.songId,
        }
    }, [isDisabled, isSessionActive, liveLip, session])
}
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm --filter cloud build && pnpm --filter tool build`
Expected: successful build with no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/tool/app/hooks/useAutoScreen.ts
git commit -m "refactor(tool): replace supabase realtime with polling in useAutoScreen"
```

---

### Task 5: Remove supabase from tool app

**Files:**
- Delete: `apps/tool/app/lib/supabase.client.ts`
- Modify: `apps/tool/package.json`

- [ ] **Step 1: Delete the supabase client file**

```bash
rm apps/tool/app/lib/supabase.client.ts
```

- [ ] **Step 2: Remove `@supabase/supabase-js` from tool's package.json**

In `apps/tool/package.json`, remove this line from `dependencies`:

```json
"@supabase/supabase-js": "catalog:",
```

- [ ] **Step 3: Install to update lockfile**

Run: `pnpm install`

- [ ] **Step 4: Verify everything still builds**

Run: `pnpm --filter @repo/db build && pnpm --filter @repo/api build && pnpm --filter cloud build && pnpm --filter tool build && pnpm --filter sing build`
Expected: all packages and apps build successfully.

- [ ] **Step 5: Commit**

```bash
git add apps/tool/app/lib/supabase.client.ts apps/tool/package.json pnpm-lock.yaml
git commit -m "chore(tool): remove supabase dependency"
```
