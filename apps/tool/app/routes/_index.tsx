import { api } from '@repo/api/client'
import Logo from '@repo/ui/components/Logo'
import QRDemo from '@repo/ui/components/QRDemo'
import QRLive from '@repo/ui/components/QRLive'
import { cn } from '@repo/ui/helpers'
import Body1 from '@repo/ui/typography/Body1'
import H1 from '@repo/ui/typography/H1'
import Subtitle2 from '@repo/ui/typography/Subtitle2'
import { useEffectEvent } from '@repo/utils/hooks'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Text } from '~/classes/Text'
import JoinedLine from '~/components/JoinedLine'
import { parseLyrics } from '~/helpers/parse-lyrics'
import { useAutoScreen } from '~/hooks/useAutoScreen'
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
                // Open menu
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
     * Auto lyrics
     *
     */

    const [isAutoLyricsDisabled, setIsAutoLyricsDisabled] = useState(false)
    const [isAutoLyricsConnected, setIsAutoLyricsConnected] = useState(false)

    const { data: autoToolServerIP } = useQuery({
        queryKey: ['auto-tool-server-ip'],
        queryFn: async () => {
            const response = await fetch(
                'https://api.looneytunez.de/live/auto_tool_server_ip',
            )
            if (!response.ok) {
                throw new Error(
                    'No response from the API trying to get auto tool server IP.',
                )
            }
            const result = await response.json()
            if (result.error !== null) {
                throw new Error(
                    'Error on API server trying to get auto tool server IP.',
                )
            }
            return result.data
        },
    })

    useEffect(() => {
        if (!autoToolServerIP || isAutoLyricsDisabled) {
            return
        }

        let websocket: WebSocket

        let timeoutId: ReturnType<typeof setTimeout>
        const retryInterval = 5000 // ms

        const connect = () => {
            websocket = new WebSocket(`ws://${autoToolServerIP}:5555`)

            websocket.addEventListener('error', (error) => {
                console.log(
                    `Websocket error: ${JSON.stringify(error)}. Retry in ${retryInterval / 1000} s.`,
                )

                clearTimeout(timeoutId)

                timeoutId = setTimeout(() => {
                    connect()
                }, retryInterval)
            })

            websocket.addEventListener('open', () => {
                setIsAutoLyricsConnected(true)
            })

            websocket.addEventListener('close', () => {
                setIsAutoLyricsConnected(false)
            })

            websocket.addEventListener('message', (event) => {
                const messageCode = parseInt(event.data)

                if (Number.isNaN(messageCode)) {
                    console.warn(
                        'websocket on message listener expects a number',
                    )
                    return
                }

                switch (messageCode) {
                    // next syllable
                    case 0: {
                        nextHighlight()
                        break
                    }
                    // send back the received number (presumed timestamp) to test network latency
                    default:
                        websocket.send(`${messageCode}`)
                }
            })
        }

        connect()

        return () => {
            websocket?.close()
        }
    }, [nextHighlight, autoToolServerIP, isAutoLyricsDisabled])

    /**
     *
     * Auto screen changes
     *
     */

    const screen = useAutoScreen()

    useEffect(() => {
        if (screen.type === 'lyrics') {
            setSelectedSongId(screen.songId)
            return
        }
        setSelectedSongId(null)
    }, [screen])

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

    return (
        <main className='relative flex h-screen cursor-none flex-col items-center justify-center'>
            <Logo className='absolute left-12 top-12' />

            <Subtitle2 className='absolute right-12 top-12 text-blue-700'>
                {isAutoLyricsConnected ? 'Connected' : 'Waiting...'}
            </Subtitle2>

            {(() => {
                switch (screen.type) {
                    case 'home':
                        return (
                            <div className='space-y-10'>
                                <h1 className='text-center text-yellow-400'>
                                    {screen.sessionTitle}
                                </h1>
                                {screen.isDemo ? (
                                    <QRDemo className='w-80' />
                                ) : (
                                    <QRLive className='w-80' />
                                )}
                                <H1>Scan me to sing!</H1>
                            </div>
                        )
                    case 'call':
                        return (
                            <div>
                                {screen.prevLip && (
                                    <H1 className='mb-24 text-6xl'>
                                        Give it up for{' '}
                                        {screen.prevLip.singerName} !!!
                                    </H1>
                                )}
                                <Subtitle2 className='text-4xl'>
                                    Next:
                                </Subtitle2>
                                <Body1 className='mt-4 text-8xl'>
                                    {screen.nextLip.singerName}
                                </Body1>
                                <Body1 className='mt-10 text-6xl text-yellow-400'>
                                    {screen.nextLip.artist}
                                </Body1>
                                <Body1 className='mt-4 text-8xl text-yellow-400'>
                                    {screen.nextLip.songTitle}
                                </Body1>
                            </div>
                        )
                }
                return (
                    <>
                        <h1
                            className={cn(
                                'duration-[1.5s]e absolute left-1/2 top-20 w-full -translate-x-1/2 px-72 text-center text-yellow-400 opacity-0 transition-opacity',
                                {
                                    'opacity-100':
                                        isFirst('line') &&
                                        !isThirdOrHigher('word'),
                                },
                            )}
                        >
                            {selectedText?.title ?? 'Looney tool'}
                        </h1>

                        <section className='absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden px-12'>
                            <div
                                className={cn({
                                    'transition-transform duration-300':
                                        transformY > 0,
                                })}
                                style={{
                                    transform: `translateY(-${transformY / 3}%)`,
                                }}
                            >
                                <JoinedLine
                                    line={prev}
                                    className='opacity-10'
                                />
                                <JoinedLine line={current} index={index} />
                                <JoinedLine
                                    line={next}
                                    className='opacity-60'
                                />
                            </div>
                        </section>
                    </>
                )
            })()}
        </main>
    )
}
