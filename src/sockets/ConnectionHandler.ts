import { Server, Socket } from 'socket.io'
import UserService from '../services/UserService'
import Logger from 'js-logger'
import { registerEvents } from './events/EventRouter'

export class ConnectionHandler {
  private static logger = Logger.get('ConnectionHandler')

  public static async handleConnection(server: Server, socket: Socket) {
    const userService = new UserService()
    const user = await userService.create()

    ConnectionHandler.logger.debug(
      `Socket connected: ${socket.id}. User id: ${user.id}`
    )
    registerEvents(server, socket, user)

    socket.on('disconnecting', async () => {
      ConnectionHandler.logger.debug(`Socket ${socket.id} disconnecting`)
      for (const room of socket.rooms) {
        if (room == socket.id) continue
        ConnectionHandler.logger.debug(
          `Socket ${socket.id} leaving ${room} room`
        )
        socket.to(room).emit('user_left', { board_user_id: user.id })
      }
    })
  }
}
