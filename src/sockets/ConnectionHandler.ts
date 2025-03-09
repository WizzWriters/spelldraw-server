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
  }
}
