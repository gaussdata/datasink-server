import express from "express";
import logger from "../utils/logger.js";
import { collector } from "../controllers/collector.js";

const router = express.Router();

// 单个请求最大大小
const MAX_JSON_SIZE = 10 * 1024; // 10KB

// 接收埋点消息
router.post("/t", (req, res) => {
  const jsonData = req.body;

  if (!jsonData) {
    return res.status(400).send("Bad Request: No parameters provided"); // 400 BAD REQUEST
  }

  if (jsonData.length > MAX_JSON_SIZE) {
    return res.status(413).send("Content Too Large"); // 413 CONTENT TOO LARGE
  }

  logger.info(jsonData);

  let list;
  try {
    list = JSON.parse(jsonData);
    list.forEach((row) => {
      collector.addEvent(row);
    });
  } catch (error) {
    logger.error("Error processing JSON data: ", error);
    return res.status(500).send("Internal Server Error: Failed to process data"); // 500 INTERNAL SERVER ERROR
  }

  res.send("OK");
});

export default router;
