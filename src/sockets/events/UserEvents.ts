import { Server, Socket } from 'socket.io'
import UserIoController from '../controllers/UserIoController'
import User from '../../models/User'

function registerUserEvents(server: Server, socket: Socket, user: User) {
  socket.on('position_update', (data) =>
    UserIoController.updatePosition(socket, data)
  )

  socket.on('disconnecting', async () => {
    await UserIoController.disconnect(server, socket, user)
  })
}

export { registerUserEvents }
