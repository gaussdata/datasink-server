import eventModel from "../models/event.js";

class Analysis {
  async getCount(req, res) {
    const countInfo = await eventModel.getCount();
    res.send({
      data: countInfo
    })
  }
  
  async getView(req, res) {
    const viewInfo = await eventModel.getView();
    res.send({
      data: viewInfo
    })
  }

  async getPVUV(req, res) {
    const { start_time, end_time, date_level } = req.query;
    const pvuvInfo = await eventModel.getPVUV(start_time, end_time, date_level);
    res.send({
      data: pvuvInfo
    })
  }
  
  async getTopPages(req, res) {
    const { start_time, end_time } = req.query;
    const topPagesInfo = await eventModel.getTopPages(start_time, end_time)
    res.send({
      data: topPagesInfo
    })
  }

}

const analysis = new Analysis();

export default analysis;
