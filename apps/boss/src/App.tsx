import { api } from '@repo/api/client'
import Button from '@repo/ui/Button'

function App() {
    const { data } = api.setlist.get.useQuery(undefined, { refetchInterval: 3000 })

    console.log('data', data)

    return (
        <>
            <h1>Vite + React</h1>
            <Button />
        </>
    )
}

export default App
