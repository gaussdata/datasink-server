import eventModel from "../models/event.js";

export function createRow(vo) {
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
  };
  return dto;
}

class Collector {
  // 队列初始化
  constructor() {
    this.eventQueue = [];
    // 定义每批写入日志的大小
    this.BATCH_SIZE = 200;
    // 定义每轮最多批次
    this.BATCH_COUNT = 50;
    // 定义队列最大长度
    this.QUEUE_MAX_LENGTH = this.BATCH_COUNT * this.BATCH_SIZE * 2;
    // 每间隔 100 毫秒清理一轮日志
    this.WRITE_INTERVAL = 100;

    // 启动队列处理
    this.processEventQueue();
  }

  // 添加事件到队列
  addEvent(row) {
    const event = createRow(row);
    // 如果接近队列上限，裁切一半数据
    if (this.eventQueue.length > this.QUEUE_MAX_LENGTH) {
      this.eventQueue = this.eventQueue.slice(0, this.QUEUE_MAX_LENGTH / 2);
    }
    this.eventQueue.push(event);
  }

  // 定时处理队列的函数
  async processEventQueue() {
    // 如果队列为空，直接返回
    if (this.eventQueue.length === 0) {
      // 执行下一轮检查
      setTimeout(() => this.processEventQueue(), this.WRITE_INTERVAL);
      return false;
    }

    // 提前分好批次
    const batches = [];
    while (this.eventQueue.length > 0) {
      batches.push(this.eventQueue.splice(0, this.BATCH_SIZE));
    }

    // 使用 for...of 循环串行处理每个批次
    let index = 0;
    let batchCount = batches.length;
    for (const batch of batches) {
      index++;
      try {
        console.log(`${index} / ${batchCount} Processed ${batch.length} events`);
        // 等待异步操作完成
        await eventModel.addEvents(batch); 
        console.log(`${index} / ${batchCount} Recived ${batch.length} events`);
      } catch (error) {
        console.error(`${index} / ${batchCount} Error processing events:`, error);
        // 可以选择在这里重试或记录错误，具体取决于需求
      }
    }
    // 执行下一轮检查
    setTimeout(() => this.processEventQueue(), this.WRITE_INTERVAL);
  }
}

export const collector = new Collector();
