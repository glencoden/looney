export type TJson =
    | string
    | number
    | boolean
    | null
    | TJson[]
    | { [key: string]: TJson }
