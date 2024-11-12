import { Word } from '~/classes/Word'

export class Line {
    private _words: Word[] = []

    addWord(word: Word) {
        this._words.push(word)
    }

    get words(): Word[] {
        return this._words
    }
}
