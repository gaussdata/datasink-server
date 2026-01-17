import fs from 'node:fs'
import { formatInTimeZone } from 'date-fns-tz'
import morgan from 'morgan'

const accessLogStream = fs.createWriteStream('logs/access.log', { flags: 'a' })
morgan.token('date', () => {
  return formatInTimeZone(new Date(), 'Asia/Shanghai', 'yyyy-MM-dd HH:mm:ss')
})
const log = morgan('combined', { stream: accessLogStream })

export default log
