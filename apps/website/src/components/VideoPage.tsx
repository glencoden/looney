import { useState, useEffect } from 'react'
import { LoadingSpinner } from './LoadingSpinner'

const SHOW_VIDEO_SAFETY_TIMEOUT = 2_000

export function VideoPage() {
    const [showVideo, setShowVideo] = useState(false)

    const onVideoReady = () => {
        setShowVideo(true)
    }

    useEffect(() => {
        const timeoutId = setTimeout(onVideoReady, SHOW_VIDEO_SAFETY_TIMEOUT)

        return () => {
            clearTimeout(timeoutId)
        }
    }, [])

    return (
        <>
            {!showVideo && <LoadingSpinner />}

            <div className={`video-box ${showVideo ? 'show-video' : ''}`}>
                <video
                    className="video-element"
                    src="/teaser-1v5.m4v"
                    autoPlay
                    playsInline
                    muted
                    loop
                    controls
                    onCanPlay={onVideoReady}
                />
            </div>
        </>
    )
}
