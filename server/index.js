import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'


import { Server } from 'socket.io'
import { createServer } from 'node:http'

dotenv.config()

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {}
})

const db = createClient({
    url: "libsql://frank-tinkerer-tukkedd.turso.io",
    authToken: process.env.DB_TOKEN
})

await db.execute(`
    CREATE TABLE IF NOT EXISTS message (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT
    )
`)

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.on('disconnect', () => {
        console.log('an user has been disconnect');
    })

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg)
    })

})

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
})