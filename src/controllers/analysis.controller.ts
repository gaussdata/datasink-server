import type { Request, Response } from 'express'
import type { DateLevel } from '@/types/date.js'
import { cacheResponse } from '@/decorators/cache.decorator.js'
import eventService from '@/services/event.service.js'

class Analysis {
  @cacheResponse()
  async getCount(req: Request, res: Response) {
    const countInfo = await eventService.getCount()
    res.send({
      data: countInfo,
    })
    return {
      data: countInfo,
    }
  }

  @cacheResponse()
  async getView(req: Request, res: Response) {
    const viewInfo = await eventService.getView()
    res.send({
      data: viewInfo,
    })
    return {
      data: viewInfo,
    }
  }

  @cacheResponse()
  async getPVUV(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now(), date_level = 'day' } = req.query
    const pvuvInfo = await eventService.getPVUV(Number(start_time), Number(end_time), date_level as DateLevel)
    res.send({
      data: pvuvInfo,
    })
    return {
      data: pvuvInfo,
    }
  }

  @cacheResponse()
  async getTopPages(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now() } = req.query
    const topPagesInfo = await eventService.getTopPages(Number(start_time), Number(end_time))
    res.send({
      data: topPagesInfo,
    })
    return {
      data: topPagesInfo,
    }
  }

  @cacheResponse()
  async getMetrics(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now() } = req.query
    const metricsInfo = await eventService.getMetrics(Number(start_time), Number(end_time))
    res.send({
      data: metricsInfo,
    })
    return {
      data: metricsInfo,
    }
  }
}

const analysis = new Analysis()

export default analysis
