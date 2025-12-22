import { formatRelative } from 'date-fns'
import { de } from 'date-fns/locale'
import { VerticalSpacer } from './VerticalSpacer'

const animations = ['slide-top', 'slide-bottom', 'slide-left', 'slide-right']

interface Event {
    start: string
    venue: string
    description?: string
}

interface EventsPageProps {
    events: Event[]
}

export function EventsPage({ events }: EventsPageProps) {
    const getRandomAnimation = () => animations[Math.floor(Math.random() * 4)]

    return (
        <>
            <VerticalSpacer />

            {[...events].reverse().map((event) => {
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

            <VerticalSpacer />
        </>
    )
}
