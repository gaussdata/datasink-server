import fs from 'node:fs'
import { format } from 'date-fns'
import morgan from 'morgan'

const accessLogStream = fs.createWriteStream('logs/access.log', { flags: 'a' })
morgan.token('date', () => {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss')
})
const log = morgan('combined', { stream: accessLogStream })

export default log
