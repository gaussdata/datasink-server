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
// 定义队列最大长度
const QUEUE_MAX_LENGTH = BATCH_COUNT * BATCH_SIZE * 2;
// 每间隔 100 毫秒清理一轮日志
const WRITE_INTERVAL = 100;

const addEventToQueue = (event) => {
  // 如果接近队列上限，裁切一半数据
  if (eventQueue.length > QUEUE_MAX_LENGTH) {
    eventQueue.slice(0, QUEUE_MAX_LENGTH / 2);
  }
  eventQueue.push(event);
}

// 定时处理队列的函数
const processEventQueue = async () => {
  // 如果队列为空，直接返回
  if (eventQueue.length === 0) {
    // 执行下一轮检查
    setTimeout(processEventQueue, WRITE_INTERVAL)
    return false;
  }

  // 提前分好批次
  const batches = [];
  while (eventQueue.length > 0) {
    batches.push(eventQueue.splice(0, BATCH_SIZE));
  }

  // 使用 for...of 循环串行处理每个批次
  let index = 0;
  let batchCount = batches.length;
  for (const batch of batches) {
    index++;
    try {
      // 等待异步操作完成
      await eventModel.addEvents(batch); 
      console.log(`${index} / ${batchCount} Processed ${batch.length} events`);
    } catch (error) {
      console.error(`${index} / ${batchCount} Error processing events:`, error);
      // 可以选择在这里重试或记录错误，具体取决于需求
    }
  }
  // 执行下一轮检查
  setTimeout(processEventQueue, WRITE_INTERVAL)
};

processEventQueue();

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
      addEventToQueue(row);
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
