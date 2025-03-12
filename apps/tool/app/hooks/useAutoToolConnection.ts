import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useAutoToolConnection = (
    next: () => void,
    isDisabled?: boolean,
) => {
    const [isConnected, setIsConnected] = useState(false)
    const [possibleIPs, setPossibleIPs] = useState<string[]>([])

    /**
     *
     * Server state
     *
     */
    const { data: autoToolServerIP, error } = useQuery<string>({
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

    if (error) {
        console.error('Error on useAutoToolConnection', error)
    }

    useEffect(() => {
        if (!autoToolServerIP) {
            return
        }
        setPossibleIPs((prev) => [...prev, autoToolServerIP])
    }, [autoToolServerIP])

    /**
     *
     * Websocket connection
     *
     */
    useEffect(() => {
        if (!autoToolServerIP || isDisabled) {
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
                setIsConnected(true)
            })

            websocket.addEventListener('close', () => {
                setIsConnected(false)
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
                        next()
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
    }, [next, autoToolServerIP, isDisabled])

    return isConnected
}
