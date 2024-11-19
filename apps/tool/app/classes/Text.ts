import { toNonBreaking } from '@repo/utils/text'
import { Line } from '~/classes/Line'

export class Text {
    private _artist = ''
    private _title = ''
    private _lines: Line[] = []

    constructor(artist: string, title: string, lines: Line[]) {
        this._artist = toNonBreaking(artist)
        this._title = toNonBreaking(title)
        this._lines = lines
    }

    get title(): string {
        return `${this._artist.toUpperCase()} - ${this._title}`
    }

    get lines(): Line[] {
        return this._lines
    }
}
