import type { NextFunction, Request, Response } from 'express'
import express from 'express'

const router = express.Router()

function cors(req: Request, res: Response, next: NextFunction) {
  // 设置允许跨域的域名，具体的域名更安全
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*') // 替换为你具体的域名
  if (req.method === 'OPTIONS') {
    // 允许的header类型，添加Authorization等常用头部
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
    // 使预检请求在24小时内有效
    res.header('Access-Control-Max-Age', '86400') // 24小时
    // 响应204状态码表示没有内容
    res.sendStatus(204)
    return // 明确返回
  }
  next() // 继续处理其它请求
}

router.all('*', cors)

export default router
