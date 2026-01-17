import fs from 'node:fs'
import morgan from 'morgan'

const accessLogStream = fs.createWriteStream('logs/access.log', { flags: 'a' })
morgan.token('date', () => {
  return new Date().toLocaleString()
})
const log = morgan('combined', { stream: accessLogStream })

export default log
