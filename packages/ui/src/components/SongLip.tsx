import { useState } from 'react'

type Lip = {
    id: string
    songTitle: string
    artistName: string
    singerName: string
    status: 'pending' | 'staged' | 'live' | 'done' | 'deleted'
    sortNumber: number
}

export default function SongLip({ lip }: Readonly<{ lip: Lip }>) {
    const [count, setCount] = useState(0)

    return (
        <div className='relative h-24 w-full max-w-96 select-none'>
            <div className='absolute left-1 top-1 h-full w-full bg-black' />
            <section className='relative h-full w-full border-2 border-black bg-white p-2 text-black'>
                <p>
                    <span onClick={() => setCount(count + 1)}>{count}</span>
                    &nbsp; {lip.singerName}
                </p>
                <p>{lip.artistName}</p>
                <p>{lip.songTitle}</p>
            </section>
        </div>
    )
}
