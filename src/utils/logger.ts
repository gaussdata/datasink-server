import { formatInTimeZone } from 'date-fns-tz'
import { createLogger, format, transports } from 'winston'

const { combine, timestamp, label, printf } = format

const customFormat = printf(({ level, label, message, timestamp }) => {
  const date = formatInTimeZone(new Date(timestamp as string), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss')
  return `[${date}] [${level}] [${label}]: ${message}`
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
