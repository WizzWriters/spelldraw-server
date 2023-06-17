import { Board } from '../../models/Board'
import { redisClient } from '../RedisClient'

const BOARDS_SET = 'boards'

export class BoardRepository {
  public async save(board: Board): Promise<string> {
    await redisClient.sAdd(BOARDS_SET, board.id)
    return board.id
  }

  public async getById(boardId: string): Promise<Board | null> {
    const boardExists = await redisClient.sIsMember(BOARDS_SET, boardId)
    if (!boardExists) return null
    const board = new Board()
    Object.defineProperties(board, { id: { value: boardId } })
    return board
  }

  public async delete(board: Board) {
    await redisClient.sRem(BOARDS_SET, board.id)
  }
}
