import express from "express";
import eventModel from "../models/event.js";
const router = express.Router();

router.get("/top10", (req, res) => {
  eventModel.getTop10().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
});

router.get("/pvuv", (req, res) => {
  eventModel.getPv().then((result) => {
    res.send({
      code: 200,
      message: "success",
      data: result,
    });
  });
});

export default router;