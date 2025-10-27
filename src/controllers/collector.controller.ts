import type { Request, Response } from 'express'
import eventService from '@/services/event.service.js'
import logger from '@/utils/logger.js'

// 单个请求最大大小
const MAX_JSON_SIZE = 100 * 1024 // 100KB

class Collector {
  // 存储事件的队列
  eventQueue: any[] = []
  // 定义队列最大长度
  QUEUE_MAX_LENGTH: number = 20 * 1000
  // 定义每批写入日志的大小
  BATCH_SIZE: number = 200
  // 每间隔 10 毫秒清理一轮日志
  WRITE_INTERVAL: number = 20

  constructor() {
    setInterval(() => {
      this.comsume()
    }, this.WRITE_INTERVAL)
  }

  private createRow(vo: any) {
    const dto = {
      event_id: vo.head?.code,
      event_time: vo.head?.time,
      //
      aa_id: vo.head?.aaid,
      session_id: vo.head?.sid,
      //
      lib: vo.head?.lib,
      lib_version: vo.head?.lib_version,
      //
      url: vo.body.url,
      title: vo.body.title,
      referrer: vo.body.referrer,
      //
      screen_width: vo.body.screen_width,
      screen_height: vo.body.screen_height,
      viewport_width: vo.body.window_width,
      viewport_height: vo.body.window_height,
      //
      user_agent: vo.body.user_agent,
      os: vo.body.os,
      browser: vo.body.browser,
      device_type: vo.body.device_type,
    }
    return dto
  }

  // 生产 - 添加事件到队列
  private async produce(row: any) {
    const event = this.createRow(row)
    // 如果接近队列上限，裁切一半数据
    if (this.eventQueue.length > this.QUEUE_MAX_LENGTH) {
      this.eventQueue = this.eventQueue.slice(0, this.QUEUE_MAX_LENGTH / 2)
    }
    this.eventQueue.push(event)
  }

  // 消费
  private async comsume() {
    // 如果队列为空，直接返回
    if (this.eventQueue.length === 0) {
      return false
    }
    // 提前分好批次
    const batch = this.eventQueue.splice(0, this.BATCH_SIZE)
    try {
      // 等待异步操作完成
      await eventService.addEvents(batch)
      logger.info(`Recived ${batch.length} events, remain ${this.eventQueue.length} events`)
    }
    catch (error) {
      logger.error(`Batch insert ${batch.length} events error ${error}`)
      // 可以选择在这里重试或记录错误，具体取决于需求
    }
  }

  // 入口 - 处理请求
  public track(req: Request, res: Response) {
    const jsonData = req.body

    if (!jsonData) {
      logger.error('No parameters provided in request')
      return res.status(400).send('Bad Request: No parameters provided') // 400 BAD REQUEST
    }

    if (jsonData.length > MAX_JSON_SIZE) {
      logger.error('Request data too large:', jsonData.length)
      return res.status(413).send('Content Too Large') // 413 CONTENT TOO LARGE
    }

    let list
    try {
      if (Array.isArray(jsonData)) {
        list = jsonData
      }
      else if (typeof jsonData === 'string') {
        list = JSON.parse(jsonData)
      }
      else {
        logger.error('Invalid data format')
        return res.status(400).send('Bad Request: Invalid data format') // 400 BAD REQUEST
      }
      logger.info(`Received data with ${list.length} records`)
      list.forEach((row: any) => {
        this.produce(row)
      })
    }
    catch (error) {
      logger.error('Failed to process data:', error)
      return res.status(500).send('Internal Server Error: Failed to process data') // 500 INTERNAL SERVER ERROR
    }

    res.send('OK')
  }
}

export const collector = new Collector()
