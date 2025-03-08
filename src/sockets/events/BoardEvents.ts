import { Socket, Server } from 'socket.io'
import BoardIoController from '../controllers/BoardIoController'
import User from '../../models/User'

function registerBoardEvents(server: Server, socket: Socket, user: User) {
  socket.on(
    'create_board',
    async (_, callback) =>
      await BoardIoController.create(socket, user, callback)
  )

  socket.on(
    'join_board',
    async (data, callback) =>
      await BoardIoController.join(server, socket, user, data, callback)
  )
}

export { registerBoardEvents }
