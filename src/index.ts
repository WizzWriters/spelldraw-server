import express from 'express'
import 'dotenv/config'
import { Server } from 'socket.io'
import http from 'http'
import cors from 'cors'
import { createClient } from 'redis'

const port = process.env.PORT

const redisClient = createClient({
  url: process.env.DATABASE_URL
})

redisClient.on('error', (err) => console.log('Redis error: ' + err))
redisClient.connect().then(() => {
  console.log('Connection to redis DB established!')
})

const app = express()

app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.APPLICATION_URL,
    methods: ['GET', 'POST']
  }
})

const BOARD_SET = 'boards'

io.on('connection', async (socket) => {
  const userId = crypto.randomUUID()
  console.log(`Socket connected: ${socket.id}. User id: ${userId}`)

  socket.on('create_board', async (_, callback) => {
    const boardId = crypto.randomUUID()
    console.log('Creating new board: ', boardId)
    await redisClient.sAdd(BOARD_SET, boardId)
    socket.join(boardId)
    callback({ status: 0, data: { id: boardId } })
  })

  socket.on('join_board', async (data, callback) => {
    const boardExists = await redisClient.sIsMember(BOARD_SET, data.board_id)
    if (!boardExists) {
      callback({ status: -1 })
      return
    }

    socket.join(data.board_id)
    console.log(`User ${userId} joined the ${data.board_id} board`)

    socket.to(data.board_id).emit('user_joined', { board_user_id: userId })
    callback({
      status: 0,
      data: {
        board_id: data.board_id,
        board_user_id: userId
      }
    })
  })

  socket.on('position_update', (data) => {
    socket.to(data.board_id).emit('position_update', data)
  })

  socket.on('shape_create', (data) => {
    socket.to(data.board_id).emit('shape_create', data)
  })

  socket.on('shape_delete', (data) => {
    socket.to(data.board_id).emit('shape_delete', data)
  })

  socket.on('disconnecting', async () => {
    console.log(`Socket ${socket.id} disconnecting`)

    for (const room of socket.rooms) {
      if (room == socket.id) continue
      console.log(`Socket ${socket.id} leaving ${room} room`)
      socket.to(room).emit('user_left', { board_user_id: userId })
    }
  })
})

io.of('/').adapter.on('create-room', (room) => {
  console.log(`Room ${room} created`)
})

io.of('/').adapter.on('delete-room', async (room) => {
  console.log(`Room ${room} deleted`)
  const isBoard = await redisClient.sIsMember(BOARD_SET, room)
  if (isBoard) {
    await redisClient.sRem(BOARD_SET, room)
    console.log(`Board ${room} deleted`)
  }
})

app.get('/', (req, res) => {
  res.send('Hi!')
})

server.listen(port, () => {
  console.log(`⚡Server is listening on port ${port}`)
})
