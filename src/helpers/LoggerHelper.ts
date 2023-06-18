import Logger, { type ILogLevel } from 'js-logger'

export default {
  initializeLogger() {
    Logger.useDefaults()

    let logLevel: ILogLevel
    switch (process.env.LOG_LEVEL) {
      case 'DEBUG':
        logLevel = Logger.DEBUG
        break
      case 'INFO':
        logLevel = Logger.INFO
        break
      case 'WARN':
        logLevel = Logger.WARN
        break
      case 'ERROR':
        logLevel = Logger.ERROR
        break
      case 'OFF':
        logLevel = Logger.OFF
        break
      default:
        console.warn('Unknown log level, using default value: INFO')
        logLevel = Logger.INFO
        break
    }
    Logger.setLevel(logLevel)
  }
}
