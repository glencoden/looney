import { Syllable } from '~/classes/Syllable'

export class Word {
    private _syllables: Syllable[] = []

    addSyllable(syllable: Syllable) {
        this._syllables.push(syllable)
    }

    get syllables(): Syllable[] {
        return this._syllables
    }
}
