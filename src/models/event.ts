import { clampStartTime, generateDaysByTime, generateHoursByTime, generateMonthsByTime, generateWeeksByTime, ONE_DAY, ONE_HOUR, ONE_MONTH, ONE_WEEK } from '@/utils/date.js';
import { Database } from '../utils/database.js';
import { createCountSql, createDaySql, createEventsSql, createHourSql, createInsertSql, createMonthSql, createTopPagesSql, createViewSql, createWeekSql } from './event_sql.js';

function rows2Result(rows: any[], dates: string[]) {
  const map: any = {};
  rows.forEach((row: any) => {
    map[row.date] = row;
  });
  return dates.map((date: any) => {
    return {
      date,
      pv: map[date]?.pv || 0,
      uv: map[date]?.uv || 0,
    };
  });
}


class EventModel {


  constructor() {
    this.init();
  }

  init() {
    this.createTable()
  }

  async createTable() {
    console.log('create table events');
    const query = createEventsSql;
    const connection = await Database.getConnection()
    return new Promise((resolve, reject) => {
      connection.run(query, (err: any, result: any) => {
        if (err) {
          console.log('create table error', err);
          reject(err);
        } else {
          console.log('create table success', result);
          resolve(result);
        }
      });
    });
  }

  addEvent(event: any) {
    return this.addEvents([event]); // 调用 addEvents 方法，传入单个事件数组
  }

  async addEvents(events: any) {

    if (!Array.isArray(events) || events.length === 0) {
      console.log("No events to add.");
      return;
    }

    const placeholders = events.map(() =>
      '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).join(', ');

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
      event.user_agent
    ]);
    const query = `${createInsertSql} ${placeholders}`;
    const connection = await Database.getConnection();
    return new Promise((resolve, reject) => {
      connection.run(query, params, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async getCount() {
    const query = createCountSql;
    const connection = await Database.getConnection();
    return await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0] || { pv: 0, uv: 0 });
        }
      });
    });
  }

  async getView() {
    const query = createViewSql;
    const connection = await Database.getConnection();
    return await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows[0] || { pv: 0, uv: 0 });
        }
      });
    });
  }

  async getPVUV(start_time: number, end_time: number, date_level: string) {
    let query = '';
    let dates: string[] = [];
    switch (date_level) {
      case 'hour': {
        const startTime = clampStartTime(start_time, end_time, 24 * ONE_HOUR);
        query = createHourSql(startTime, end_time);
        dates = generateHoursByTime(startTime, end_time);
      }
        break;
      case 'day':
        {
          const startTime = clampStartTime(start_time, end_time, 30 * ONE_DAY);
          query = createDaySql(startTime, end_time);
          dates = generateDaysByTime(startTime, end_time);
        }
        break;
      case 'week': {
        const startTime = clampStartTime(start_time, end_time, 24 * ONE_WEEK);
        query = createWeekSql(start_time, end_time);
        dates = generateWeeksByTime(startTime, end_time);
      }
        break;
      case 'month': {
        const startTime = clampStartTime(start_time, end_time, 24 * ONE_MONTH);
        query = createMonthSql(startTime, end_time);
        dates = generateMonthsByTime(startTime, end_time);
      }
        break;
      default:
        break;
    }    
    const connection = await Database.getConnection();
    return await new Promise((resolve, reject) => {
      connection.all(query, (err: Error, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows2Result(rows, dates));
        }
      });
    });
  }

  async getTopPages(start_time: number, end_time: number) {
    const query = createTopPagesSql(start_time, end_time);
    const connection = await Database.getConnection();
    return await new Promise((resolve, reject) => {
      connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

const eventModel = new EventModel();

export default eventModel;
