import { createClient } from 'redis'
import Logger from 'js-logger'

const logger = Logger.get('RedisClient')

const redisClient = createClient({
  url: process.env.DATABASE_URL
})

redisClient.on('error', (error) => logger.error(`Redis error: ${error}`))

redisClient.connect().then(() => {
  logger.debug('Connection to redis DB established!')
})

export { redisClient }
