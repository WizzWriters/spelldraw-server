import Logger from 'js-logger'
import { Board } from '../../models/Board'
import { redisClient } from '../RedisClient'
import crypto from 'crypto'

const BOARDS_SET = 'boards'

export class BoardRepository {
  private logger = Logger.get('BoardRepository')

  public async save(board: Board): Promise<string | null> {
    try {
      await redisClient.sAdd(BOARDS_SET, board.id)
      await redisClient.hSet(this.getBoardKey(board.id), { host: board.hostId })
      return board.id
    } catch (err) {
      this.logger.error('Error while saving the board: ', err)
      return null
    }
  }

  public async getById(boardId: string): Promise<Board | null> {
    try {
      const boardExists = await redisClient.sIsMember(BOARDS_SET, boardId)
      if (!boardExists) return null
      const hostId = await redisClient.hGet(this.getBoardKey(boardId), 'host')
      if (!hostId) return null

      const board = new Board(hostId as crypto.UUID)
      Object.defineProperties(board, { id: { value: boardId } })
      return board
    } catch (err) {
      this.logger.error('Error while retrieving data: ', err)
      return null
    }
  }

  public async delete(board: Board) {
    try {
      await redisClient.sRem(BOARDS_SET, board.id)
      await redisClient.del(this.getBoardKey(board.id))
    } catch (err) {
      this.logger.error('Error while deleting board: ', err)
    }
  }

  private getBoardKey(boardId: string): string {
    return `board:${boardId}`
  }
}
