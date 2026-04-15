export class Syllable {
    private _letters = ''

    constructor(value: string) {
        this._letters = value
    }

    get letters(): string {
        return this._letters
    }
}
