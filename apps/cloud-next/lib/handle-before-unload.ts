export const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.returnValue = false
}
