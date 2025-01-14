import { and, eq, or } from 'drizzle-orm'
import { db, Lip, lipsTable } from '../index.js'

export const moveLip = (
    payload: Pick<Lip, 'id' | 'sessionId' | 'status' | 'sortNumber'> &
        Partial<Omit<Lip, 'id' | 'sessionId' | 'status' | 'sortNumber'>>,
): Promise<boolean> => {
    if (payload.sortNumber === null) {
        throw new Error('Can not move a lip without a target sort number.')
    }

    return db.transaction(async (tx) => {
        const [fromLip] = await tx
            .select()
            .from(lipsTable)
            .where(eq(lipsTable.id, payload.id))
            .limit(1)

        if (!fromLip) {
            throw new Error('Could not find lip to update.')
        }

        if (fromLip.sortNumber === null) {
            throw new Error(
                'Can not move a lip without an affected sort number.',
            )
        }

        const fromList = await tx
            .select()
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, payload.sessionId),
                    eq(lipsTable.status, fromLip.status),
                ),
            )

        const toList =
            fromLip.status === payload.status
                ? null
                : await tx
                      .select()
                      .from(lipsTable)
                      .where(
                          and(
                              eq(lipsTable.sessionId, payload.sessionId),
                              eq(lipsTable.status, payload.status),
                          ),
                      )

        const [actionLip] = await tx
            .select()
            .from(lipsTable)
            .where(
                and(
                    eq(lipsTable.sessionId, payload.sessionId),
                    or(
                        eq(lipsTable.status, 'staged'),
                        eq(lipsTable.status, 'live'),
                    ),
                ),
            )
            .limit(1)

        if (actionLip && payload.status === 'staged') {
            await tx
                .update(lipsTable)
                .set({
                    status: actionLip.status === 'staged' ? 'no-show' : 'done',
                    sortNumber: 1,
                })
                .where(eq(lipsTable.id, actionLip.id))
        }

        const updates =
            toList === null
                ? fromList
                      .filter(
                          (lip) =>
                              lip.id !== payload.id && lip.sortNumber !== null,
                      )
                      .map((lip) => {
                          const currentSortNumber = lip.sortNumber!
                          const fromSortNumber = fromLip.sortNumber!
                          const toSortNumber = payload.sortNumber!

                          let shift = 0

                          if (currentSortNumber > fromSortNumber) {
                              if (toSortNumber >= currentSortNumber) {
                                  shift--
                              }
                          } else {
                              if (toSortNumber <= currentSortNumber) {
                                  shift++
                              }
                          }

                          return tx
                              .update(lipsTable)
                              .set({ sortNumber: currentSortNumber + shift })
                              .where(eq(lipsTable.id, lip.id))
                      })
                : [
                      ...fromList
                          .filter(
                              (lip) =>
                                  lip.id !== payload.id &&
                                  lip.sortNumber !== null &&
                                  lip.sortNumber > fromLip.sortNumber!,
                          )
                          .map((lip) => {
                              return tx
                                  .update(lipsTable)
                                  .set({ sortNumber: lip.sortNumber! - 1 })
                                  .where(eq(lipsTable.id, lip.id))
                          }),
                      ...toList
                          .filter(
                              (lip) =>
                                  lip.sortNumber !== null &&
                                  lip.sortNumber >= payload.sortNumber!,
                          )
                          .map((lip) => {
                              return tx
                                  .update(lipsTable)
                                  .set({ sortNumber: lip.sortNumber! + 1 })
                                  .where(eq(lipsTable.id, lip.id))
                          }),
                  ]

        await Promise.all(updates)

        await tx
            .update(lipsTable)
            .set(payload)
            .where(eq(lipsTable.id, payload.id))

        return true
    })
}
