import winston from 'winston'

// 定义不同日志级别的文件路径
const logLevels = {
  debug: {
    type: 'file',
    filename: 'debug.log',
  },
  error: {
    type: 'file',
    filename: 'error.log',
  },
  info: {
    type: 'cosole',
    filename: '',
  },
}

const transports = Object.entries(logLevels).map(([level, config]) => {
  const { type, filename } = config
  if (type === 'cosole') {
    return new winston.transports.Console({
      level,
      format: winston.format.simple(),
    })
  }
  return new winston.transports.File({
    level,
    filename: `logs/${filename}`,
    format: winston.format.simple(),
  })
})

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports,
})

export default logger
