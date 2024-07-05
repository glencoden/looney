import express from 'express'

const PORT = 5555

const app = express()

app.get('/', (req, res) => {
    res.send('glen was here')
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}.`))