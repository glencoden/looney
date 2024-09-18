import { api } from '@repo/api/provider/client-side'
import Button from '@repo/ui/Button'

function App() {
    const { data } = api.test.hello.useQuery()

    console.log('data', data)

    return (
        <>
            <h1>Vite + React</h1>
            <p>{data}</p>
            <Button />
        </>
    )
}

export default App
