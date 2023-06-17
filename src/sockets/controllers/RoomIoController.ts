import Logger from 'js-logger'
import BoardService from '../../services/BoardService'

export default class RoomIoController {
  private static logger = Logger.get('RoomController')

  public static async create(room: string) {
    RoomIoController.logger.debug(`Room ${room} created`)
  }

  public static async delete(room: string) {
    RoomIoController.logger.debug(`Room ${room} deleted`)
    const boardService = new BoardService()
    const boardId = room
    boardService.deleteIfExists(boardId)
  }
}
