import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export const useAutoToolConnection = (
    next: () => void,
    isDisabled?: boolean,
) => {
    const [isConnected, setIsConnected] = useState(false)

    const [possibleIPs, setPossibleIPs] = useState<
        { value: string; successCount: number }[]
    >([])

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
        setPossibleIPs((prev) => {
            if (prev.find((entry) => entry.value === autoToolServerIP)) {
                return prev
            }
            return [...prev, { value: autoToolServerIP, successCount: 0 }]
        })
    }, [autoToolServerIP])

    /**
     *
     * Websocket connection
     *
     */
    const { data: websocket, refetch: refetchWebsocket } =
        useQuery<WebSocket | null>({
            queryKey: ['auto-tool-websocket'],
            queryFn: async () => {
                if (possibleIPs.length === 0) {
                    return null
                }
                const IPs = possibleIPs.sort(
                    (a, b) => b.successCount - a.successCount,
                )

                let ws: WebSocket | null = null
                let index = 0

                while (index < IPs.length) {
                    const IP = IPs[index]?.value!

                    ws = await new Promise((resolve) => {
                        const currentWebsocket = new WebSocket(
                            `ws://${IP}:5555`,
                        )
                        currentWebsocket.addEventListener('open', () => {
                            resolve(currentWebsocket)
                        })
                        currentWebsocket.addEventListener('error', () => {
                            console.log(`Websocket failed for IP: ${IP}`)
                            resolve(null)
                        })
                    })

                    if (ws == null) {
                        index++
                        continue
                    }

                    setPossibleIPs((prev) =>
                        prev.map((entry) => {
                            if (entry.value !== IP) {
                                return entry
                            }
                            return {
                                ...entry,
                                successCount: entry.successCount + 1,
                            }
                        }),
                    )
                    console.log(`SET WEBSOCKET FOR IP: ${IP}`)
                    break
                }

                return ws
            },
            enabled: possibleIPs.length > 0,
        })

    useEffect(() => {
        if (isDisabled || websocket?.readyState !== 1) {
            return
        }

        const onInactive = () => {
            console.log('ON INACTIVE')
            setIsConnected(false)
            refetchWebsocket()
        }

        websocket.addEventListener('error', onInactive)
        websocket.addEventListener('close', onInactive)

        const handleMessage = (event: MessageEvent) => {
            const messageCode = parseInt(event.data)

            if (Number.isNaN(messageCode)) {
                console.warn('websocket on message listener expects a number')
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
        }

        websocket.addEventListener('message', handleMessage)

        setIsConnected(true)

        return () => {
            websocket.removeEventListener('error', onInactive)
            websocket.removeEventListener('close', onInactive)
            websocket.removeEventListener('message', handleMessage)
        }
    }, [next, isDisabled, websocket])

    return isConnected
}
