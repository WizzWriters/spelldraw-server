import { Server, Socket } from 'socket.io'
import BoardService from '../../services/BoardService'
import User from '../../models/User'

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
    const boardId = data.board_id
    const boardService = new BoardService()
    if (!(await boardService.addUser(boardId, user.id))) {
      callback({ status: -1 })
      return
    }

    const roomId = boardId
    let chosenSocket: null | string = null

    const boardSockets = server.of('/').adapter.rooms.get(roomId)
    if (boardSockets && boardSockets.size > 0) {
      for (const boardSocket of boardSockets) {
        if (boardSocket == socket.id) continue
        chosenSocket = boardSocket
        break
      }
    }

    socket.join(roomId)
    socket.to(boardId).emit('user_joined', { board_user_id: user.id })
    if (chosenSocket) {
      socket
        .to(chosenSocket)
        .emit('shape_list_share_req', { socket: socket.id })
    }

    callback({
      status: 0,
      data: { board_id: boardId, board_user_id: user.id }
    })
  }
}
