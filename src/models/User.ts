import crypto from 'crypto'

export default class User {
  public readonly id = crypto.randomUUID()
}
