import { api } from '@repo/api/client'
import { cn } from '@repo/ui/helpers'
import { useEffectEvent } from '@repo/utils/hooks'
import { useEffect, useState } from 'react'
import { Text } from '~/classes/Text'
import JoinedLine from '~/components/JoinedLine'
import { parseLyrics } from '~/helpers/parse-lyrics'
import type { Index } from '~/types/Index'
import type { Position } from '~/types/Position'

export default function Index() {
    /**
     *
     * Server state
     *
     */

    const { data: songs } = api.song.getAllWithLyrics.useQuery()

    /**
     *
     * Local state
     *
     */

    const [selectedSongId, setSelectedSongId] = useState<string | null>(null)

    const [selectedText, setSelectedText] = useState<Text | null>(null)

    const [index, setIndex] = useState<Index>({
        line: 0,
        word: 0,
        syllable: 0,
    })

    const [size, setSize] = useState<Index>({
        line: 0,
        word: 0,
        syllable: 0,
    })

    const [position, setPosition] = useState<Position>({
        totalSyllables: 0,
        current: 0,
    })

    /**
     *
     * Effects
     *
     */

    const onSongIdChange = useEffectEvent((songId: string | null) => {
        if (!songId) {
            setSelectedText(null)
            return
        }

        const song = songs?.find((song) => song.id === songId)

        if (!song) {
            throw new Error('Song not found')
        }

        setSelectedText(
            new Text(song.artist, song.title, parseLyrics(song.lyrics)),
        )
    })

    useEffect(() => {
        onSongIdChange(selectedSongId)
    }, [onSongIdChange, selectedSongId])

    const onTextChange = useEffectEvent((text: Text | null) => {
        if (!text) {
            reset()
            return
        }
        calculate({ line: 0, word: 0, syllable: 0 })
    })

    useEffect(() => {
        onTextChange(selectedText)
    }, [onTextChange, selectedText])

    /**
     *
     * Helpers
     *
     */

    const isFirst = (key: keyof Index) => {
        return index[key] === 0
    }

    const isThirdOrHigher = (key: keyof Index) => {
        return index[key] >= 2
    }

    const isLast = (key: keyof Index) => {
        return index[key] >= size[key] - 1
    }

    /**
     *
     * Logic
     *
     */

    const reset = useEffectEvent(() => {
        setIndex({ line: 0, word: 0, syllable: 0 })
        setSize({ line: 0, word: 0, syllable: 0 })
        setPosition({ totalSyllables: 0, current: 0 })
    })

    // Calculate size and position
    const calculate = useEffectEvent((nextIndex: Index) => {
        if (!selectedText) {
            return
        }

        setIndex(nextIndex)

        const lines = selectedText.lines
        const words = lines[nextIndex.line]!.words
        const syllables = words[nextIndex.word]!.syllables

        setSize({
            line: lines.length,
            word: words.length,
            syllable: syllables.length,
        })

        let current = 0
        let numSyllablesInLine = 0

        for (const [i, word] of words.entries()) {
            if (nextIndex.word >= i) {
                current = numSyllablesInLine + nextIndex.syllable
            }
            numSyllablesInLine += word.syllables.length
        }

        setPosition({
            totalSyllables: numSyllablesInLine - 1,
            current,
        })
    })

    const findSong = useEffectEvent((firstChar: string) => {
        const song = songs?.find(
            (song) => song.artist[0]?.toLowerCase() === firstChar,
        )

        if (!song) {
            return false
        }

        setSelectedSongId(song.id)
        return true
    })

    const nextSong = useEffectEvent(() => {
        if (!songs || songs.length === 0) {
            return false
        }

        const index = songs.findIndex((song) => song.id === selectedSongId)

        if (index === -1) {
            setSelectedSongId(songs[0]!.id)
            return true
        }

        const next = songs[index + 1]

        if (!next) {
            return false
        }

        setSelectedSongId(next.id)
        return true
    })

    const prevSong = useEffectEvent(() => {
        if (!songs || songs.length === 0) {
            return false
        }

        const index = songs.findIndex((song) => song.id === selectedSongId)

        if (index === -1) {
            setSelectedSongId(songs[songs.length - 1]!.id)
            return true
        }

        const prev = songs[index - 1]

        if (!prev) {
            return false
        }

        setSelectedSongId(prev.id)
        return true
    })

    const nextLine = () => {
        if (isLast('line')) {
            return false
        }

        calculate({
            line: index.line + 1,
            word: 0,
            syllable: 0,
        })

        return true
    }

    const prevLine = () => {
        if (isFirst('line') || !selectedText) {
            return false
        }

        const prevLine = index.line - 1
        const prevWord = selectedText.lines[prevLine]!.words.length - 1
        const prevSyllable =
            selectedText.lines[prevLine]!.words[prevWord]!.syllables.length - 1

        calculate({
            line: prevLine,
            word: prevWord,
            syllable: prevSyllable,
        })

        return true
    }

    const nextWord = () => {
        if (isLast('word')) {
            return false
        }

        calculate({
            line: index.line,
            word: index.word + 1,
            syllable: 0,
        })

        return true
    }

    const prevWord = () => {
        if (isFirst('word') || !selectedText) {
            return false
        }

        const prevWord = index.word - 1
        const prevSyllable =
            selectedText.lines[index.line]!.words[prevWord]!.syllables.length -
            1

        calculate({
            line: index.line,
            word: prevWord,
            syllable: prevSyllable,
        })

        return true
    }

    const nextSyllable = () => {
        if (isLast('syllable')) {
            return false
        }

        calculate({
            line: index.line,
            word: index.word,
            syllable: index.syllable + 1,
        })

        return true
    }

    const prevSyllable = () => {
        if (isFirst('syllable')) {
            return false
        }

        calculate({
            line: index.line,
            word: index.word,
            syllable: index.syllable - 1,
        })

        return true
    }

    const nextHighlight = useEffectEvent(() => {
        if (isLast('syllable')) {
            if (isLast('word')) {
                if (isLast('line')) {
                    return false // nextSong()
                } else {
                    nextLine()
                }
            } else {
                nextWord()
            }
        } else {
            nextSyllable()
        }
    })

    const prevHighlight = useEffectEvent(() => {
        if (isFirst('syllable')) {
            if (isFirst('word')) {
                if (isFirst('line')) {
                    return false // prevSong()
                } else {
                    prevLine()
                }
            } else {
                prevWord()
            }
        } else {
            prevSyllable()
        }
    })

    /**
     *
     * Attach event handlers
     *
     */

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            event.preventDefault()

            if (event.shiftKey && event.key.toLowerCase() === 'f') {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen()
                } else {
                    document.exitFullscreen()
                }
                return
            }

            if (event.key === 'ArrowLeft') {
                prevHighlight()
            } else if (event.key === 'ArrowRight') {
                nextHighlight()
            } else if (event.key === 'PageUp') {
                prevSong()
            } else if (event.key === 'PageDown') {
                nextSong()
            } else if (event.key === '.') {
                // app.cloud.toggleAutoTool()
            } else {
                findSong(event.key.toLowerCase())
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [findSong, nextSong, prevSong, nextHighlight, prevHighlight])

    /**
     *
     * Render
     *
     */

    const prev = selectedText?.lines[index.line - 1] ?? null
    const current = selectedText?.lines[index.line] ?? null
    const next = selectedText?.lines[index.line + 1] ?? null

    const transformY =
        position.totalSyllables === 0
            ? 0
            : (position.current / position.totalSyllables) * 100

    console.log('transformY', transformY)

    return (
        <div className='flex h-screen flex-col items-center justify-center px-12'>
            <h1
                className={cn(
                    'mb-80 text-yellow-400 opacity-0 transition-opacity duration-1000',
                    {
                        'opacity-100':
                            isFirst('line') && !isThirdOrHigher('word'),
                    },
                )}
            >
                {selectedText?.title ?? 'Looney tool'}
            </h1>

            {prev && <JoinedLine line={prev} />}

            {current && <JoinedLine line={current} index={index} />}

            {next && <JoinedLine line={next} className='opacity-60' />}
        </div>
    )
}
