import Logger from 'js-logger'
import User from '../models/User'
import UserRepository from '../infrastructure/repositories/UserRepository'

export default class UserService {
  private logger = Logger.get('UserService')
  private userRepository = new UserRepository()

  public async create(socketId: string): Promise<User | null> {
    const newUser = new User(socketId)
    const userId = await this.userRepository.save(newUser)
    if (!userId) return null
    this.logger.debug('Created new user: ', userId)
    return newUser
  }

  public async getById(userId: string): Promise<User | null> {
    return await this.userRepository.getById(userId)
  }

  public async deleteIfExists(userId: string) {
    const user = await this.userRepository.getById(userId)
    if (!user) return
    this.userRepository.delete(user)
    this.logger.debug(`User ${userId} deleted`)
  }
}
