import { Socket } from 'socket.io'
import UserIoController from '../controllers/UserIoController'

function registerUserEvents(socket: Socket) {
  socket.on('position_update', (data) =>
    UserIoController.updatePosition(socket, data)
  )
}

export { registerUserEvents }
