import Logger from 'js-logger'
import User from '../../models/User'
import { redisClient } from '../RedisClient'

export default class UserRepository {
  private logger = Logger.get('BoardRepository')

  public async save(user: User): Promise<string | null> {
    try {
      await redisClient.hSet(this.getUserKey(user.id), {
        socket_id: user.socketId
      })
      return user.id
    } catch (err) {
      this.logger.error('Error while saving the user: ', err)
      return null
    }
  }

  public async getById(userId: string): Promise<User | null> {
    try {
      const userDbKey = this.getUserKey(userId)
      const userExists = await redisClient.exists(userDbKey)
      if (!userExists) return null
      const socketId = await redisClient.hGet(userDbKey, 'socket_id')
      if (!socketId) return null

      const user = new User(socketId)
      Object.defineProperties(user, { id: { value: userId } })
      return user
    } catch (err) {
      this.logger.error('Error while retrieving data: ', err)
      return null
    }
  }

  public async delete(user: User) {
    try {
      await redisClient.del(this.getUserKey(user.id))
    } catch (err) {
      this.logger.error('Error while deleting user: ', err)
    }
  }

  private getUserKey(userId: string): string {
    return `user:${userId}`
  }
}
