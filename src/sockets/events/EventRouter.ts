import { Server, Socket } from 'socket.io'
import User from '../../models/User'
import { registerBoardEvents } from './BoardEvents'
import { registerShapeEvents } from './ShapeEvents'
import { registerUserEvents } from './UserEvents'

/* Normally user would not be needed here, but we don't have sessions */
function registerEvents(server: Server, socket: Socket, user: User) {
  registerBoardEvents(server, socket, user)
  registerShapeEvents(socket)
  registerUserEvents(server, socket, user)
}

export { registerEvents }
