import express from "express";
import eventModel from "../models/event.js";
const router = express.Router();

const getTop10 = (req, res) => {
  eventModel.getTop10().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
}

const getTop10Article = (req, res) => {
  eventModel.getTop10Article().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
}

const getHour24 = (req, res) => {
  eventModel.getHour24().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
}

const getDay7 = (req, res) => {
  eventModel.getDay7().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
}

const getWeek4 = (req, res) => {
  eventModel.getWeek4().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
}

const getMonth6 = (req, res) => {
  eventModel.getMonth6().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
}

router.get("/top10", getTop10);
router.get("/pv-top10", getTop10);
router.get("/article-top10", getTop10Article);
router.get("/pvuv", getDay7);
router.get("/pvuv-hour24", getHour24);
router.get("/pvuv-day7", getDay7);
router.get("/pvuv-week4", getWeek4);
router.get("/pvuv-month6", getMonth6);

export default router;