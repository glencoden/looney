import { api } from '@repo/api/provider'
import Button from '@repo/ui/Button'

function App() {
    const { data } = api.setlist.get.useQuery()

    console.log('data', data)

    return (
        <>
            <h1>Vite + React</h1>
            <Button />
        </>
    )
}

export default App
