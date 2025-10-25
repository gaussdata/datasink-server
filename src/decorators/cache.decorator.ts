import type { Request, Response } from 'express'
import { Cache } from '@/utils/cache.js'

const cache = new Cache(100, 60 * 1000)
// 编写一个装饰器实现缓存功能
export function cacheResponse(ttl: number = 60 * 1000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value

    descriptor.value = async function (req: Request, res: Response) {
      const cacheKey = `api:${req.method}:${req.url}`
      try {
        const cached = await cache.get(cacheKey)
        if (cached) {
          let result = cached
          if (cached instanceof Promise) {
            result = await cached
          }
          res.header('X-Cache', 'HIT')
          return res.send(result)
        }
      }
      catch (err) {
        console.error('Cache get error:', err)
      }
      res.header('X-Cache', 'MISS')
      const promise = originalMethod.call(this, req, res)
      try {
        await cache.set(cacheKey, promise, ttl)
      }
      catch (err) {
        console.error('cache set promise error:', err)
      }
      const result = await promise
      try {
        await cache.set(cacheKey, result, ttl)
      }
      catch (err) {
        console.error('cache set value error:', err)
      }
      return result
    }

    return descriptor
  }
}
