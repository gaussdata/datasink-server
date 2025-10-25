import express from 'express'
import logger from '../utils/logger.js'

const router = express.Router()

/**
 * 日志中间件
 * @param {*} req 请求对象
 * @param {*} res 响应对象
 * @param {*} next 下一个中间件
 */
function log(req: express.Request, res: express.Response, next: express.NextFunction) {
  const { method, url } = req // 获取请求方法、URL和IP地址
  const start = Date.now() // 记录请求开始时间
  res.on('finish', () => { // 监听响应结束事件
    const duration = Date.now() - start // 计算请求耗时
    const { statusCode } = res // 获取响应状态码
    const logMessage = `${new Date().toLocaleString()} ${statusCode} ${method} ${url} - ${duration}ms` // 构造日志信息
    logger.debug(logMessage) // 记录日志信息
  })
  next()
}
router.all('*', log)

export default router
