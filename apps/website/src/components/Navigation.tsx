import { useState, useEffect } from 'react'
import { Button } from './Button'

export function Navigation() {
    const [currentPathname, setCurrentPathname] = useState('/')

    useEffect(() => {
        const extracted = location.pathname.split('/').filter(Boolean).pop()

        if (!extracted || extracted === 'looney-website') {
            setCurrentPathname('/')
        } else {
            setCurrentPathname(`/${extracted}`)
        }
    }, [])

    return (
        <>
            <div className="navigation-background"></div>

            <div className="logo">
                <a href="/">
                    <img className="logo-shadow" src="/logo-black.png" alt="black" />
                    <img className="logo-image" src="/logo.png" alt="main" />
                    <img
                        className={`logo-glow ${currentPathname === '/' ? 'logo-glow-active' : ''}`}
                        src="/logo-white.png"
                        alt="glow"
                    />
                </a>
            </div>

            <nav className="navigation">
                <a href="/events" className="nav-item nav-item-0">
                    <Button isActive={currentPathname === '/events'} label="Events" />
                </a>
                <a href="/songs" className="nav-item nav-item-1">
                    <Button isActive={currentPathname === '/songs'} label="Songs" />
                </a>
                <a href="/references" className="nav-item nav-item-2">
                    <Button isActive={currentPathname === '/references'} label="References" />
                </a>
                <a href="/contact" className="nav-item nav-item-3">
                    <Button isActive={currentPathname === '/contact'} label="Contact" />
                </a>
            </nav>
        </>
    )
}
