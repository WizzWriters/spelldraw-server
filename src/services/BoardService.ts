import Logger from 'js-logger'
import { BoardRepository } from '../infrastructure/repositories/BoardRepository'
import { Board } from '../models/Board'

export default class BoardService {
  private logger = Logger.get('BoardService')
  private boardRepository = new BoardRepository()

  public async create(): Promise<Board> {
    const newBoard = new Board()
    await this.boardRepository.save(newBoard)
    this.logger.debug('Created new board: ', newBoard.id)
    return newBoard
  }

  public async addUser(boardId: string, userId: string): Promise<boolean> {
    const board = await this.boardRepository.getById(boardId)
    if (!board) return false
    this.logger.debug(`User ${userId} joined the ${board.id} board`)
    return true
  }

  public async deleteIfExists(boardId: string) {
    const board = await this.boardRepository.getById(boardId)
    if (board != null) {
      this.boardRepository.delete(board)
      this.logger.debug(`Board ${boardId} deleted`)
    }
  }
}
