import { Database } from '../utils/database.js';
import { createCountSql, createEventsSql, createInsertSql, createViewSql } from './event_sql.js';

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
      connection.run(query, (err, result) => {
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

  addEvent(event) {
    return this.addEvents([event]); // 调用 addEvents 方法，传入单个事件数组
  }

  async addEvents(events) {

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
      connection.run(query, params, (err, result) => {
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

  close() {
    this.connection.close();
  }
}

const eventModel = new EventModel();

export default eventModel;
