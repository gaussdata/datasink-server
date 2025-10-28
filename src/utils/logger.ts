import winston from 'winston'

// 定义不同日志级别的文件路径
const logLevels = {
  debug: 'debug.log',
  info: 'info.log',
  warn: 'warn.log',
  error: 'error.log',
}

const transports = [
  new winston.transports.Console({
    level: 'info',
    format: winston.format.simple(),
  }),
  ...Object.entries(logLevels).map(([level, filename]) => {
    return new winston.transports.File({
      level,
      filename: `logs/${filename}`,
      format: winston.format.simple(),
    })
  }),
]

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports,
})

export default logger
