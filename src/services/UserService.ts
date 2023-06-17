import Logger from 'js-logger'
import User from '../models/User'

export default class UserService {
  private logger = Logger.get('UserServices')

  public async create(): Promise<User> {
    return new User()
  }
}
