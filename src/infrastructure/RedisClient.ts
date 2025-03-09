import { createClient } from 'redis'
import Logger from 'js-logger'

const logger = Logger.get('RedisClient')

if (!process.env.DATABASE_URL) throw new Error('Redis database URL not set')

const redisClient = createClient({
  url: process.env.DATABASE_URL
})

redisClient.on('error', (error) => logger.error(`Redis error: ${error}`))

redisClient.connect().then(() => {
  logger.debug('Connection to redis DB established!')
})

export { redisClient }
