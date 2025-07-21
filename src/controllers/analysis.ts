import { Request, Response } from "express";
import eventModel from "../models/event.js";

class Analysis {
  async getCount(req: Request, res: Response) {

    const countInfo = await eventModel.getCount();
    res.send({
      data: countInfo
    })
  }
  
  async getView(req: Request, res: Response) {
    const viewInfo = await eventModel.getView();
    res.send({
      data: viewInfo
    })
  }

  async getPVUV(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now(), date_level = 'day' } = req.query;
    const pvuvInfo = await eventModel.getPVUV(start_time as number, end_time as number, date_level as string);
    res.send({
      data: pvuvInfo
    })
  }
  
  async getTopPages(req: Request, res: Response) {
    const { start_time = 0, end_time = Date.now() } = req.query;
    const topPagesInfo = await eventModel.getTopPages(start_time as number, end_time as number)
    res.send({
      data: topPagesInfo
    })
  }

}

const analysis = new Analysis();

export default analysis;
