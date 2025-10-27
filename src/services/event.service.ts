import type { DateLevel } from '@/types/date.js'
import { Metrics } from '@/types/metrics.js'
import { Database } from '@/utils/database.js'
import { clampStartTimeByUnit, generateDatesByTime } from '@/utils/date.js'
import logger from '@/utils/logger.js'
import { ignoreError } from '@/utils/promise.js'
import {
  addColumnsToEvents,
  createCountSql,
  createEventsSql,
  createInsertSql,
  createMeticsSql,
  createPVUVSql,
  createTopBrowserSql,
  createTopOsSql,
  createTopPagesSql,
  createTopRefererSql,
  createViewSql,
} from './event.sql.js'

class EventService {
  constructor() {
    this.init()
  }

  async init() {
    await this.createTable()
    await ignoreError(this.addColumns('events', 'os', 'VARCHAR(100)'))
    await ignoreError(this.addColumns('events', 'browser', 'VARCHAR(100)'))
    await ignoreError(this.addColumns('events', 'device_type', 'VARCHAR(100)'))
  }

  async createTable() {
    const query = createEventsSql
    logger.info('create table events')
    try {
      const result = await Database.query(query)
      logger.info('create table success', result)
    }
    catch (error) {
      logger.error('create table error', error)
    }
  }

  async addColumns(table: string, column: string, dataType: string) {
    const query = addColumnsToEvents(table, column, dataType)
    logger.info('add columns to events', column)
    try {
      const result = await Database.query(query)
      logger.info('add columns to events success', result)
    }
    catch (error) {
      logger.error('add columns to events error', error)
    }
  }

  async addEvents(events: any) {
    if (!Array.isArray(events) || events.length === 0) {
      logger.info('No events to add.', events)
      return
    }

    const placeholders = events
      .map(() => `(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
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
      event.os,
      event.browser,
      event.device_type,
    ])
    const query = `${createInsertSql} ${placeholders}`
    return Database.insert(query, params)
  }

  async getCount() {
    const query = createCountSql
    const rows = await Database.query(query) || []
    return rows[0] || { pv: 0, uv: 0 }
  }

  async getView() {
    const query = createViewSql
    const rows = await Database.query(query) || []
    return rows[0] || { pv: 0, uv: 0 }
  }

  async getPVUV(start_time: number, end_time: number, date_level: DateLevel) {
    const startTime = clampStartTimeByUnit(start_time, end_time, date_level)
    const query = createPVUVSql(startTime, end_time, date_level)
    const dates = generateDatesByTime(startTime, end_time, date_level)
    const rows = await Database.query(query) || []
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

  async getTopPages(start_time: number, end_time: number) {
    const query = createTopPagesSql(start_time, end_time)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        url: row.clean_url,
      }
    })
  }

  async getTopReferers(start_time: number, end_time: number) {
    const query = createTopRefererSql(start_time, end_time)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        url: row.referrer_no_path,
      }
    })
  }

  async getMetrics(start_time: number, end_time: number) {
    const query = createMeticsSql(start_time, end_time)
    const rows = await Database.query(query) || []
    return rows[0] || new Metrics()
  }

  async getTopOs(start_time: number, end_time: number) {
    const query = createTopOsSql(start_time, end_time)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        os: row.os,
      }
    })
  }

  async getTopBrowser(start_time: number, end_time: number) {
    const query = createTopBrowserSql(start_time, end_time)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        browser: row.browser,
      }
    })
  }
}

const eventService = new EventService()

export default eventService
