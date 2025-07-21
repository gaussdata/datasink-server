import { Request, Response } from "express";
import eventModel from "../models/event.js";
import { cacheResponse } from "@/decorators/cache.decorator.js";

class Analysis {
  @cacheResponse()
  async getCount(req: Request, res: Response) {
    const countInfo = await eventModel.getCount();
    res.send({
      data: countInfo
    })
    return {
      data: countInfo
    }
  }

  @cacheResponse()
  async getView(req: Request, res: Response) {
    const viewInfo = await eventModel.getView();
    res.send({
      data: viewInfo
    })
    return {
      data: viewInfo
    }
  }

  @cacheResponse()
  async getPVUV(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now(), date_level = 'day' } = req.query;
    const pvuvInfo = await eventModel.getPVUV(start_time as number, end_time as number, date_level as string);
    res.send({
      data: pvuvInfo
    })
    return {
      data: pvuvInfo
    }
  }

  @cacheResponse()
  async getTopPages(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now() } = req.query;
    const topPagesInfo = await eventModel.getTopPages(start_time as number, end_time as number)
    res.send({
      data: topPagesInfo
    })
    return {
      data: topPagesInfo
    }
  }

}

const analysis = new Analysis();

export default analysis;
