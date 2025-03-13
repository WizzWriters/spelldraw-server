import { Server, Socket } from 'socket.io'
import BoardService from '../../services/BoardService'
import User from '../../models/User'
import UserService from '../../services/UserService'

export default class BoardIoController {
  public static async create(socket: Socket, user: User, callback: any) {
    const boardService = new BoardService()
    const newBoard = await boardService.create(user.id)

    if (!newBoard) {
      callback({ status: 1, data: null })
      return
    }

    socket.join(newBoard.id)
    callback({ status: 0, data: { id: newBoard.id } })
  }

  public static async join(
    server: Server,
    socket: Socket,
    user: User,
    data: any,
    callback: any
  ) {
    const boardService = new BoardService()
    const userService = new UserService()
    const boardId = data.board_id
    const board = await boardService.getBoardById(boardId)

    if (!board) {
      callback({ status: 1 })
      return
    }

    const boardHost = await userService.getById(board.hostId)
    if (!boardHost) {
      callback({ status: 2 })
      return
    }

    const result = await boardService.addUser(boardId, user.id)
    if (!result) {
      callback({ status: 3 })
      return
    }

    socket.join(boardId)
    socket.to(boardId).emit('user_joined', { board_user_id: user.id })
    socket
      .to(boardHost.socketId)
      .emit('shape_list_share_req', { socket: socket.id })

    callback({
      status: 0,
      data: { board_id: boardId, board_user_id: user.id }
    })
  }
}
