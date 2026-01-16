import type { Request, Response } from 'express'
import type { DateLevel } from '@/types/date.js'
import { cacheResponse } from '@/decorators/cache.decorator.js'
import eventService from '@/services/event.service.js'

class Analysis {
  @cacheResponse()
  async getHosts(req: Request, res: Response) {
    const hosts = await eventService.getHosts()
    res.send({
      data: hosts,
    })
    return {
      data: hosts,
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
  async getTopReferers(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now() } = req.query
    const topReferersInfo = await eventService.getTopReferers(Number(start_time), Number(end_time))
    res.send({
      data: topReferersInfo,
    })
    return {
      data: topReferersInfo,
    }
  }

  @cacheResponse()
  async getTopOs(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now() } = req.query
    const topOsInfo = await eventService.getTopOs(Number(start_time), Number(end_time))
    res.send({
      data: topOsInfo,
    })
    return {
      data: topOsInfo,
    }
  }

  @cacheResponse()
  async getTopBrowser(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now() } = req.query
    const topBrowserInfo = await eventService.getTopBrowser(Number(start_time), Number(end_time))
    res.send({
      data: topBrowserInfo,
    })
    return {
      data: topBrowserInfo,
    }
  }
}

const analysis = new Analysis()

export default analysis
