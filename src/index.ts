import express from 'express'
import 'dotenv/config'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import LoggerHelper from './helpers/LoggerHelper'
import RoomIoController from './sockets/controllers/RoomIoController'
import { ConnectionHandler } from './sockets/ConnectionHandler'

LoggerHelper.initializeLogger()

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', async (socket) =>
  ConnectionHandler.handleConnection(io, socket)
)
io.of('/').adapter.on('create-room', RoomIoController.create)
io.of('/').adapter.on('delete-room', RoomIoController.delete)

app.get('/', (req, res) => {
  res.send('Hi!')
})

const serverPort = process.env.PORT
if (!serverPort) throw new Error('Server port not set')

server.listen(serverPort, () => {
  console.log(`⚡ Server is listening on port ${process.env.PORT}`)
})
