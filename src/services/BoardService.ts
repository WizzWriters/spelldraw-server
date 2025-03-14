import Logger from 'js-logger'
import { BoardRepository } from '../infrastructure/repositories/BoardRepository'
import { Board } from '../models/Board'
import crypto from 'crypto'

export default class BoardService {
  private logger = Logger.get('BoardService')
  private boardRepository = new BoardRepository()

  public async create(userId: crypto.UUID): Promise<Board | null> {
    const newBoard = new Board(userId)
    const boardId = await this.boardRepository.save(newBoard)
    if (!boardId) return null
    this.logger.debug('Created new board: ', boardId)
    return newBoard
  }

  public async getBoardById(boardId: crypto.UUID): Promise<Board | null> {
    const board = await this.boardRepository.getById(boardId)
    return board
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
