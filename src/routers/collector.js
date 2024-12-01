import express from "express";
import querystring from "querystring";
import logger from "../utils/logger.js";
import eventModel, { createRow } from "../models/event.js";

const router = express.Router();

// 处理请求并返回响应的辅助函数
const sendErrorResponse = (res, statusCode, message) => {
  res.status(statusCode).send(message);
};

// 单个请求最大大小
const MAX_JSON_SIZE = 10 * 1024; // 10KB
// 队列初始化
const eventQueue = [];
// 定义每批写入日志的大小
const BATCH_SIZE = 200;
// 定义每轮最多批次
const BATCH_COUNT = 50;
// 每 5 秒清理一轮日志
const WRITE_INTERVAL = 5 * 1000;

// 定时处理队列的函数
const processEventQueue = async () => {
  // 如果队列为空，直接返回
  if (eventQueue.length === 0) {
    return;
  }

  // 提前分好批次
  const batches = [];
  while (eventQueue.length > 0 && batches.length < BATCH_COUNT) {
    // 从队列中提取指定数量的数据进行处理
    batches.push(eventQueue.splice(0, BATCH_SIZE));
  }

  // 使用 for...of 循环串行处理每个批次
  let index = 0;
  let batchCount = batches.length;
  for (const batch of batches) {
    index++;
    try {
      await eventModel.addEvents(batch); // 等待异步操作完成
      console.log(`${index} / ${batchCount} Processed ${batch.length} events`);
    } catch (error) {
      console.error(`${index} / ${batchCount} Error processing events:`, error);
      // 可以选择在这里重试或记录错误，具体取决于需求
    }
  }
};

// 启动定时器
setInterval(processEventQueue, WRITE_INTERVAL);

// 接收埋点消息
router.post("/t", (req, res) => {
  const urlParams = req.body;

  if (!urlParams) {
    return sendErrorResponse(res, 400, "Bad Request: No parameters provided"); // 400 BAD REQUEST
  }
  // url string => object
  let params;
  try {
    params = querystring.parse(urlParams);
  } catch (error) {
    return sendErrorResponse(
      res,
      400,
      "Bad Request: Unable to parse parameters"
    );
  }
  const base64Data = params.data || "";
  if (!base64Data) {
    return sendErrorResponse(res, 400, "Bad Request: No data provided");
  }

  // base64 to json
  let jsonData;
  try {
    jsonData = Buffer.from(base64Data, "base64").toString();
  } catch (error) {
    return sendErrorResponse(
      res,
      400,
      "Bad Request: Unable to decode base64 data"
    );
  }

  if (jsonData.length > MAX_JSON_SIZE) {
    return sendErrorResponse(res, 413, "Content Too Large"); // 413 CONTENT TOO LARGE
  }

  // logger.info(jsonData);

  let json;
  try {
    json = JSON.parse(jsonData);
    const row = createRow(json);
    if (row.event_id) {
      // eventModel.addEvent(row);
      eventQueue.push(row);
    }
  } catch (error) {
    logger.error("Error processing JSON data: ", error);
    return sendErrorResponse(
      res,
      500,
      "Internal Server Error: Failed to process data"
    ); // 500 INTERNAL SERVER ERROR
  }

  res.send("OK");
});

export default router;
