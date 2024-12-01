import sqlite3 from "sqlite3";
import LRU from "../utils/LRU.js";

const cacheService = new LRU();

export function createRow(vo) {
  const row = {
    event_id: vo.event,
    event_time: vo.time,
    //
    aa_id: vo.anonymous_id,
    cookie_id: vo.identities?.$identity_cookie_id,
    device_id: vo.distinct_id,
    //
    lib: vo.lib?.$lib,
    lib_method: vo.lib?.$lib_method,
    lib_version: vo.lib?.$lib_version,
    //
    is_first_day: vo.properties.$is_first_day ? 1 : 0,
    latest_referrer: vo.properties.$latest_referrer,
    //
    url: vo.properties.$url,
    url_path: vo.properties.$url_path,
    title: vo.properties.$title,
    //
    screen_width: vo.properties.$screen_width,
    screen_height: vo.properties.$screen_height,
    viewport_width: vo.properties.$viewport_width,
    viewport_height: vo.properties.$viewport_height,
  };
  return row;
}

class EventModel {
  constructor() {
    const file = "db/log.db";
    const db = new sqlite3.Database(file);
    this.connection = db;
    this.createTable();
  }

  createTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS events 
    (
       event_id TEXT, 
       event_time BIGINT,
       aa_id TEXT,
       cookie_id TEXT,
       device_id TEXT,
       lib TEXT,
       lib_method TEXT,
       lib_version TEXT,
       is_first_day INT,
       latest_referrer TEXT,
       url TEXT,
       url_path TEXT,
       title TEXT,
       screen_width INT,
       screen_height INT,
       viewport_width INT,
       viewport_height INT
      )`;
    return Promise((resolve, reject) => {
      this.connection.run(query, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      });
    })
    
  }

  addEvent(event) {
    const query = `
    INSERT INTO events (
      event_id,  event_time,
      aa_id, cookie_id, device_id,
      lib, lib_method, lib_version, is_first_day,
      latest_referrer, url, url_path, title,
      screen_width, screen_height, viewport_width, viewport_height
    ) VALUES (
      ?, ?, 
      ?, ?, ?, 
      ?, ?, ?, ?,
      ?, ?, ?, ?, 
      ?, ?, ?, ?
    )`;
    const params = [
      event.event_id,
      event.event_time,
      event.aa_id,
      event.cookie_id,
      event.device_id,
      event.lib,
      event.lib_method,
      event.lib_version,
      event.is_first_day,
      event.latest_referrer,
      event.url,
      event.url_path,
      event.title,
      event.screen_width,
      event.screen_height,
      event.viewport_width,
      event.viewport_height,
    ]
    return new Promise((resolve, reject) => {
      this.connection.all(
        query,
        params,
        (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        }
      );  
    })
    
  }

  addEvents(events) {  
    if (!Array.isArray(events) || events.length === 0) {  
        console.log("No events to add.");  
        return;  
    }  

    // 创建插入语句  
    const query = `  
    INSERT INTO events (  
      event_id, event_time,  
      aa_id, cookie_id, device_id,  
      lib, lib_method, lib_version, is_first_day,  
      latest_referrer, url, url_path, title,  
      screen_width, screen_height, viewport_width, viewport_height  
    ) VALUES `;  

    // 生成占位符和参数数组  
    const placeholders = events.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");  
    const params = [];  

    // 填充参数数组  
    events.forEach(event => {  
        params.push(  
            event.event_id,  
            event.event_time,  
            event.aa_id,  
            event.cookie_id,  
            event.device_id,  
            event.lib,  
            event.lib_method,  
            event.lib_version,  
            event.is_first_day,  
            event.latest_referrer,  
            event.url,  
            event.url_path,  
            event.title,  
            event.screen_width,  
            event.screen_height,  
            event.viewport_width,  
            event.viewport_height  
        );  
    });  

    // 完整的查询  
    const fullQuery = query + placeholders;  
    return new Promise((resolve, reject) => {
      this.connection.all(fullQuery, params, (err, result) => {
        if (err) {
          reject(err)
        } else {
          console.log(`${events.length} events added`);  
          resolve(result)
        }
      });  
    })
    
}  

  async getTop10() {
    const CACHE_KEY_TOP10 = "cache-top10";
    const result = cacheService.get(CACHE_KEY_TOP10);
    if (result) {
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    }
    const req = new Promise((resolve, reject) => {
      const query = `
      SELECT 
        title AS page_title,
        COUNT(*) AS view_count,
        COUNT(*) * 100.0 / (SELECT COUNT(*) FROM EVENTS) AS view_percent
      FROM EVENTS
      WHERE event_id = '$pageview'
      GROUP BY page_title
      ORDER BY view_count DESC
      LIMIT 10;`;
      this.connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          cacheService.set(CACHE_KEY_TOP10, rows);
          resolve(rows);
        }
      });
    });
    cacheService.set(CACHE_KEY_TOP10, req);
    return req;
  }

  async getPv() {
    const CACHE_KEY_PVUV = "cache-pvuv";
    const result = cacheService.get(CACHE_KEY_PVUV);
    if (result) {
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    }
    const req = new Promise((resolve, reject) => {
      const query = `
      SELECT 
        COUNT(1) AS pv, 
        COUNT(DISTINCT(aa_id)) AS uv, 
        DATE(DATETIME(event_time / 1000, 'unixepoch')) AS DATE   
      FROM EVENTS 
      WHERE event_id = '$pageview'
      GROUP BY DATE;`;
      this.connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          cacheService.set(CACHE_KEY_PVUV, rows);
          resolve(rows);
        }
      });
    });
    cacheService.set(CACHE_KEY_PVUV, req);
    return req;
  }

  close() {
    this.db.close();
  }
}

const eventModel = new EventModel();
export default eventModel;