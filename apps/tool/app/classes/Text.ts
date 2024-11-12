import { Line } from '~/classes/Line'

export class Text {
    private _artist = ''
    private _title = ''
    private _lines: Line[] = []

    constructor(artist: string, title: string, lines: Line[]) {
        this._artist = artist
        this._title = title
        this._lines = lines
    }

    get title(): string {
        return `${this._artist.toUpperCase()} - ${this._title}`
    }

    get lines(): Line[] {
        return this._lines
    }
}
