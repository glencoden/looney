import { formatRelative } from 'date-fns'
import { de } from 'date-fns/locale'
import { useGet } from '../utils/useGet'
import { LoadingSpinner } from './LoadingSpinner'
import { VerticalSpacer } from './VerticalSpacer'

const animations = ['slide-top', 'slide-bottom', 'slide-left', 'slide-right']

interface Event {
    start: string
    venue: string
    description?: string
}

export function EventsPage() {
    const { data, error, isLoading } = useGet(
        'https://api.looneytunez.de/calendar/events',
    )

    const getRandomAnimation = () => animations[Math.floor(Math.random() * 4)]

    return (
        <>
            <VerticalSpacer />

            {isLoading && <LoadingSpinner />}

            {!isLoading && error && <pre>{JSON.stringify(error, null, 4)}</pre>}

            {!isLoading && !error && !Array.isArray(data?.data) && (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}

            {!isLoading && !error && Array.isArray(data?.data) && (
                <>
                    {[...data.data].reverse().map((event: Event) => {
                        const venueParts = event.venue.split('/')
                        const venueName = venueParts[0]
                            .trim()
                            .replace(/\s/g, '\u00a0')
                        const venueLocation = venueParts[1]
                            ? `in ${venueParts[1].trim()}`
                            : ''

                        return (
                            <div key={event.start} className="event-box">
                                <p className={`date ${getRandomAnimation()}`}>
                                    {formatRelative(
                                        new Date(event.start),
                                        new Date(),
                                        { locale: de },
                                    )}
                                    {venueLocation && ` ${venueLocation}`}
                                </p>
                                <h3 className={`venue ${getRandomAnimation()}`}>
                                    {venueName}
                                </h3>
                                <p className={`description ${getRandomAnimation()}`}>
                                    {event.description || 'Looneytunez live!'}
                                </p>
                            </div>
                        )
                    })}
                </>
            )}

            <VerticalSpacer />
        </>
    )
}
