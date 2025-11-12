import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const POSSIBLE_IPS_STORAGE_KEY = 'POSSIBLE_AUTO_TOOL_SERVER_IPS'
const MAX_NUM_POSSIBLE_IPS = 4
const WEBSOCKET_CONNECTION_TRY_TIME = 1000 * 2

type PossibleIP = { value: string; connectionSuccess: boolean }

const byConnectionSuccess = <T extends PossibleIP>(a: T, b: T) => {
    return Number(b.connectionSuccess) - Number(a.connectionSuccess)
}

export const useAutoToolConnection = ({
    onNext,
    isWebsocketDisabled,
    isLocalNetworkConnectionEnabled,
}: {
    onNext: () => void
    isWebsocketDisabled?: boolean
    isLocalNetworkConnectionEnabled?: boolean
}) => {
    const [isConnected, setIsConnected] = useState(false)

    const [possibleIPs, setPossibleIPs] = useState<PossibleIP[]>([])

    useEffect(() => {
        if (!isLocalNetworkConnectionEnabled) {
            return
        }
        if (possibleIPs.length === 0) {
            const storage = localStorage.getItem(POSSIBLE_IPS_STORAGE_KEY)
            if (storage === null) {
                return
            }
            try {
                setPossibleIPs(JSON.parse(storage))
            } catch (err) {
                console.error('Unable to parse possible IPs from storage.', err)
            }
            return
        }
        localStorage.setItem(
            POSSIBLE_IPS_STORAGE_KEY,
            JSON.stringify(possibleIPs),
        )
    }, [isLocalNetworkConnectionEnabled, possibleIPs])

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
        enabled: isLocalNetworkConnectionEnabled,
    })

    if (error) {
        console.error('Error querying auto tool server IP', error)
    }

    useEffect(() => {
        if (!autoToolServerIP) {
            return
        }
        setPossibleIPs((prev) => {
            if (prev.find((entry) => entry.value === autoToolServerIP)) {
                return prev
            }
            return [
                { value: autoToolServerIP, connectionSuccess: false },
                ...prev,
            ].slice(0, MAX_NUM_POSSIBLE_IPS)
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
                const IPs = [
                    'localhost',
                    ...possibleIPs
                        .sort(byConnectionSuccess)
                        .map((possibleIP) => possibleIP.value),
                ]

                let ws: WebSocket | null = null

                for (const IP of IPs) {
                    console.log('Trying to connect to', IP)

                    ws = await new Promise((resolve) => {
                        const currentWebsocket = new WebSocket(
                            `ws://${IP}:5555`,
                        )

                        const timeoutId = setTimeout(() => {
                            currentWebsocket.close()
                            resolve(null)
                        }, WEBSOCKET_CONNECTION_TRY_TIME)

                        currentWebsocket.addEventListener('open', () => {
                            clearTimeout(timeoutId)
                            resolve(currentWebsocket)
                        })

                        currentWebsocket.addEventListener('error', () => {
                            clearTimeout(timeoutId)
                            currentWebsocket.close()
                            resolve(null)
                        })
                    })

                    if (ws === null) {
                        continue
                    }

                    if (isLocalNetworkConnectionEnabled) {
                        setPossibleIPs((prev) =>
                            prev
                                .map((entry) => {
                                    if (entry.value !== IP) {
                                        return {
                                            ...entry,
                                            connectionSuccess: false,
                                        }
                                    }
                                    return {
                                        ...entry,
                                        connectionSuccess: true,
                                    }
                                })
                                .sort(byConnectionSuccess),
                        )
                    }

                    console.log('Connected to', IP)
                    break
                }

                return ws
            },
            enabled: !isWebsocketDisabled,
            refetchInterval: isConnected
                ? Infinity
                : MAX_NUM_POSSIBLE_IPS * WEBSOCKET_CONNECTION_TRY_TIME + 1000,
        })

    useEffect(() => {
        if (isWebsocketDisabled || websocket?.readyState !== 1) {
            websocket?.close()
            setIsConnected(false)
            return
        }

        let isRefetching = false

        const onConnectionLost = () => {
            if (isRefetching) {
                return
            }
            setIsConnected(false)
            refetchWebsocket()
            isRefetching = true
        }

        websocket.addEventListener('error', onConnectionLost)
        websocket.addEventListener('close', onConnectionLost)

        const handleMessage = (event: MessageEvent) => {
            const messageCode = parseInt(event.data)

            if (Number.isNaN(messageCode)) {
                console.warn('websocket on message listener expects a number')
                return
            }

            switch (messageCode) {
                // onNext syllable
                case 0: {
                    onNext()
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
            websocket.removeEventListener('error', onConnectionLost)
            websocket.removeEventListener('close', onConnectionLost)
            websocket.removeEventListener('message', handleMessage)
        }
    }, [onNext, isWebsocketDisabled, websocket, refetchWebsocket])

    return isConnected
}
