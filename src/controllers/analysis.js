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
}

const analysis = new Analysis();

export default analysis;
