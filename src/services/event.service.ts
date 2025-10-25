import type { DateLevel } from '@/types/date.js'
import { Metrics } from '@/types/metrics.js'
import { Database } from '@/utils/database.js'
import { clampStartTimeByUnit, generateDatesByTime } from '@/utils/date.js'
import logger from '@/utils/logger.js'
import {
  createCountSql,
  createEventsSql,
  createInsertSql,
  createMeticsSql,
  createPVUVSql,
  createTopPagesSql,
  createViewSql,
} from './event.sql.js'

function rows2Result(rows: any[], dates: string[]) {
  const map: any = {}
  rows.forEach((row: any) => {
    map[row.date] = row
  })
  return dates.map((date: any) => {
    return {
      date,
      pv: map[date]?.pv || 0,
      uv: map[date]?.uv || 0,
    }
  })
}

class EventService {
  constructor() {
    this.init()
  }

  init() {
    this.createTable()
  }

  async createTable() {
    logger.info('create table events')
    const query = createEventsSql
    const connection = await Database.getConnection()
    return new Promise((resolve, reject) => {
      connection.run(query, (err: any, result: any) => {
        if (err) {
          logger.info('create table error', err)
          reject(err)
        }
        else {
          logger.info('create table success', result)
          resolve(result)
        }
      })
    })
  }

  addEvent(event: any) {
    return this.addEvents([event]) // 调用 addEvents 方法，传入单个事件数组
  }

  async addEvents(events: any) {
    if (!Array.isArray(events) || events.length === 0) {
      logger.info('No events to add.', events)
      return
    }

    const placeholders = events
      .map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .join(', ')

    const params = events.flatMap(event => [
      event.event_id,
      event.event_time,
      event.aa_id,
      event.session_id,
      event.lib,
      event.lib_version,
      event.url,
      event.title,
      event.referrer,
      event.screen_width,
      event.screen_height,
      event.viewport_width,
      event.viewport_height,
      event.user_agent,
    ])
    const query = `${createInsertSql} ${placeholders}`
    const connection = await Database.getConnection()
    return new Promise((resolve, reject) => {
      connection.run(query, params, (err: any, result: any) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    })
  }

  async getCount() {
    const query = createCountSql
    const connection = await Database.getConnection()
    return await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(rows[0] || { pv: 0, uv: 0 })
        }
      })
    })
  }

  async getView() {
    const query = createViewSql
    const connection = await Database.getConnection()
    return await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(rows[0] || { pv: 0, uv: 0 })
        }
      })
    })
  }

  async getPVUV(start_time: number, end_time: number, date_level: DateLevel) {
    const startTime = clampStartTimeByUnit(start_time, end_time, date_level)
    const query = createPVUVSql(startTime, end_time, date_level)
    const dates = generateDatesByTime(startTime, end_time, date_level)
    const connection = await Database.getConnection()
    return await new Promise((resolve, reject) => {
      connection.all(query, (err: Error, rows: any[]) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(rows2Result(rows, dates))
        }
      })
    })
  }

  async getTopPages(start_time: number, end_time: number) {
    const query = createTopPagesSql(start_time, end_time)
    const connection = await Database.getConnection()
    return await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err)
        }
        else {
          const result = rows.map((row: any) => {
            return {
              pv: row.pv,
              url: row.clean_url,
            }
          })
          resolve(result)
        }
      })
    })
  }

  async getMetrics(start_time: number, end_time: number) {
    const query = createMeticsSql(start_time, end_time)
    const connection = await Database.getConnection()
    return await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(rows[0] || new Metrics())
        }
      })
    })
  }
}

const eventService = new EventService()

export default eventService
