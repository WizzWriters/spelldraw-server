import { Server, Socket } from 'socket.io'
import Logger from 'js-logger'
import User from '../../models/User'
import BoardService from '../../services/BoardService'
import crypto from 'crypto'
import UserService from '../../services/UserService'

export default class UserIoController {
  private static logger = Logger.get('UserIoController')

  public static updatePosition(socket: Socket, data: any) {
    socket.to(data.board_id).volatile.emit('position_update', data)
  }

  public static async disconnect(server: Server, socket: Socket, user: User) {
    UserIoController.logger.debug(`Socket ${socket.id} disconnecting`)
    const boardService = new BoardService()
    const userService = new UserService()

    for (const room of socket.rooms) {
      const board = await boardService.getBoardById(room as crypto.UUID)
      if (!board) continue

      if (board.hostId == user.id) {
        this.logger.debug(`Host ${user.id} leaving ${room} room`)
        socket.to(room).emit('host_left')
        socket.to(room).emit('user_left', { board_user_id: user.id })
        server.socketsLeave(board.id)
        boardService.deleteIfExists(board.id)
      } else {
        this.logger.debug(`User ${user.id} leaving ${room} room`)
        socket.to(room).emit('user_left', { board_user_id: user.id })
      }
    }

    await userService.deleteIfExists(user.id)
  }
}
