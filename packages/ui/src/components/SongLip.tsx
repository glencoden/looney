import { useState } from 'react'

export default function SongLip() {
    const [count, setCount] = useState(0)

    return (
        <div className='w-full max-w-96 select-none border-2 border-black bg-white p-2 text-black drop-shadow'>
            <p>
                <span onClick={() => setCount(count + 1)}>{count}</span>
                &nbsp; Glen Coden
            </p>
            <p>Britney Spears</p>
            <p>Hit me baby one more time</p>
        </div>
    )
}
