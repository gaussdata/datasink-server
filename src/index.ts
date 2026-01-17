import express from 'express'
import middlewareCors from './middlewares/cors.js'
import middlewareLog from './middlewares/log.js'
import { MigrationService } from './migrations/index.js'
import routerAnalysis from './routers/analysis.router.js'
import routerCollector from './routers/collector.router.js'
import logger from './utils/logger.js'

const migrationService = new MigrationService()
migrationService.init()

const app = express()

app.set('trust proxy', 1)
// text 解析
app.use(express.text())
// json 解析
app.use(express.json({ limit: '1024kb' }))

// cors 跨域
app.use(middlewareCors) // use nginx

app.use(middlewareLog)

// 当客户端以get方式访问/路由时
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello Express')
})

app.use('/collector', routerCollector)
app.use('/analysis', routerAnalysis)

// 程序监听3000端口
app.listen(3000, () => {
  logger.info('Server Listen at port 3000, Run at http://localhost:3000')
})
