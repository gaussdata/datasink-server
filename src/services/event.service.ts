import type { IEventDto } from './event.model.js'
import type { DateLevel } from '@/types/date.js'
import { Metrics } from '@/types/metrics.js'
import { Database } from '@/utils/database.js'
import { clampStartTimeByUnit, generateDatesByTime } from '@/utils/date.js'
import logger from '@/utils/logger.js'
import {
  createEventsSql,
  createInsertSql,
  createMeticsSql,
  createPVUVSql,
  createTopBrowserSql,
  createTopOsSql,
  createTopPagesSql,
  createTopRefererSql,
} from './event.sql.js'

class EventService {
  constructor() {
    this.init()
  }

  async init() {
    await this.createTable()
  }

  async createTable() {
    const query = createEventsSql('events')
    logger.info('create table events')
    try {
      await Database.exec(query)
      logger.info('create table success')
    }
    catch (error) {
      logger.error('create table error', error)
    }
  }

  async getHosts() {
    const query = `SELECT DISTINCT host FROM events`
    const rows = await Database.query(query) || []
    return rows.map((row: any) => row.host)
  }

  async addEvents(events: IEventDto[]) {
    if (!Array.isArray(events) || events.length === 0) {
      logger.info('No events to add.', events)
      return
    }
    const flatFn = (event: IEventDto) => [
      event.event_id,
      event.event_time,
      event.aa_id,
      event.session_id,
      event.lib,
      event.lib_version,
      event.url,
      event.host,
      event.title,
      event.referrer,
      event.screen_width,
      event.screen_height,
      event.screen_resolution,
      event.viewport_width,
      event.viewport_height,
      event.user_agent,
      event.os,
      event.browser,
      event.device_type,
      event.timezone,
      event.language,
    ]
    const params = events.flatMap(flatFn)
    const placeholders = events
      .map(() => `(${Array.from({ length: flatFn(events[0]).length }).map(() => '?').join(', ')})`)
      .join(', ')
    const query = `${createInsertSql} ${placeholders}`
    return Database.insert(query, params)
  }

  async getPVUV(start_time: number, end_time: number, date_level: DateLevel, host: string) {
    const startTime = clampStartTimeByUnit(start_time, end_time, date_level)
    const query = createPVUVSql(startTime, end_time, date_level, host)
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

  async getTopPages(start_time: number, end_time: number, host: string) {
    const query = createTopPagesSql(start_time, end_time, host)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        url: row.clean_url,
        value: row.pv,
        label: row.clean_url,
        is_url: true,
      }
    })
  }

  async getTopReferers(start_time: number, end_time: number, host: string) {
    const query = createTopRefererSql(start_time, end_time, host)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        url: row.referrer_no_path || 'Direct',
        value: row.pv,
        label: row.referrer_no_path || 'Direct',
        is_url: true,
      }
    })
  }

  async getMetrics(start_time: number, end_time: number, host: string) {
    const query = createMeticsSql(start_time, end_time, host)
    const rows = await Database.query(query) || []
    return rows[0] || new Metrics()
  }

  async getTopOs(start_time: number, end_time: number, host: string) {
    const query = createTopOsSql(start_time, end_time, host)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        os: row.os || 'Unknown',
        value: row.pv,
        label: row.os || 'Unknown',
      }
    })
  }

  async getTopBrowser(start_time: number, end_time: number, host: string) {
    const query = createTopBrowserSql(start_time, end_time, host)
    const rows = await Database.query(query) || []
    return rows.map((row: any) => {
      return {
        pv: row.pv,
        browser: row.browser || 'Unknown',
        value: row.pv,
        label: row.browser || 'Unknown',
      }
    })
  }
}

const eventService = new EventService()

export default eventService
