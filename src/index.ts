import express from 'express'
import 'dotenv/config'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'

const port = process.env.PORT
const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)
})

app.get('/', (req, res) => {
  res.send('Hi!')
})

server.listen(port, () => {
  console.log(`⚡Server is listening on port ${port}`)
})
