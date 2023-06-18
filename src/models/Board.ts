import crypto from 'crypto'

export class Board {
  public readonly id = crypto.randomUUID()
}
