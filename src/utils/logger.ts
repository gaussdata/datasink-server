import { createLogger, format, transports } from 'winston'

const { combine, timestamp, label, printf } = format

const customFormat = printf(({ level, label, message, timestamp }) => {
  return `${new Date(timestamp as string).toLocaleString()} [${level}] [${label}]: ${message}`
})

const logger = createLogger({
  format: combine(
    label({ label: 'default' }),
    timestamp(),
    customFormat,
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'logs/combined.log' })],
})

export default logger
