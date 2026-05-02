import { Line } from '~/classes/Line'

export class Text {
    private _artist = ''
    private _title = ''
    private _lines: Line[] = []

    constructor(artist: string, title: string, lines: Line[]) {
        this._artist = Text.toNonBreaking(artist)
        this._title = Text.toNonBreaking(title)
        this._lines = lines
    }

    private static toNonBreaking(value: string) {
        return value.replace(/\s/g, '\xa0')
    }

    get title(): string {
        return `${this._artist.toUpperCase()} - ${this._title}`
    }

    get lines(): Line[] {
        return this._lines
    }
}
