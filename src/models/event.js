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
    return new Promise((resolve, reject) => {
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
    const CACHE_KEY_TOP10 = "cache-pv-top10";
    const result = cacheService.get(CACHE_KEY_TOP10);
    if (result) {
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    }
    const req = new Promise((resolve, reject) => {
      const query = `
      WITH top_pages AS (  
          SELECT   
              title AS page_title,  
              COUNT(*) AS view_count  
          FROM EVENTS  
          WHERE event_id = '$pageview'   
            AND title IS NOT NULL        -- 确保标题不为空  
            AND title <> ''              -- 确保标题不为空字符串  
          GROUP BY title  
          ORDER BY view_count DESC  
          LIMIT 10  
      ),  
      total_count AS (  
          SELECT SUM(view_count) AS total_view_count  
          FROM top_pages  
      )  
      SELECT   
          tp.page_title,  
          tp.view_count,  
          tp.view_count * 100.0 / tc.total_view_count AS view_percent  
      FROM top_pages tp, total_count tc;`;
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

  async getHour24() {
    const CACHE_KEY_PVUV = "cache-pvuv-hour24";
    const result = cacheService.get(CACHE_KEY_PVUV);
    if (result) {
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    }
    const req = new Promise((resolve, reject) => {
      const query = `
      WITH RECURSIVE hour_range AS (  
          SELECT strftime('%Y-%m-%d %H:00:00', 'now', 'localtime', '-23 hours') AS hour_start  -- 开始于 24小时前  
          UNION ALL  
          SELECT strftime('%Y-%m-%d %H:00:00', hour_start, '+1 hour')  -- 每次递归增加1小时  
          FROM hour_range   
          WHERE hour_start < strftime('%Y-%m-%d %H:00:00', 'now', 'localtime')  -- 直到当前小时  
      )  
      SELECT   
          hr.hour_start as hour,  
          COALESCE(COUNT(e.event_id), 0) AS pv,  
          COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  
      FROM hour_range hr  
      LEFT JOIN EVENTS e   
          ON hr.hour_start = strftime('%Y-%m-%d %H:00:00', DATETIME(e.event_time / 1000, 'unixepoch', '+8 hours'), 'localtime')  
          AND e.event_id = '$pageview'  
      GROUP BY hr.hour_start  
      ORDER BY hr.hour_start;`;
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

  async getDay7() {
    const CACHE_KEY_PVUV = "cache-pvuv-day7";
    const result = cacheService.get(CACHE_KEY_PVUV);
    if (result) {
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    }
    const req = new Promise((resolve, reject) => {
      const query = `
      WITH RECURSIVE date_range AS (  
        SELECT 
          DATE('now', '-6 days') AS DATE   -- 开始日期为 7 天前  
        UNION ALL
          SELECT DATE(DATE, '+1 day')   
        FROM date_range
        WHERE DATE < DATE('now')                -- 直到今天  
      )  
      SELECT   
          dr.DATE as day,  
          COALESCE(COUNT(e.event_id), 0) AS pv,  
          COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  
      FROM date_range dr  
      LEFT JOIN EVENTS e   
          ON dr.DATE = DATE(DATETIME(e.event_time / 1000, 'unixepoch', '+8 hours'))  
          AND e.event_id = '$pageview'  
      GROUP BY dr.DATE  
      ORDER BY dr.DATE;`;
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

  getWeek4() {
    const CACHE_KEY_PVUV = "cache-pvuv-week4";
    const result = cacheService.get(CACHE_KEY_PVUV);
    if (result) {
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    }
    const req = new Promise((resolve, reject) => {
      const query = `
      WITH RECURSIVE week_range AS (  
        SELECT 
          DATE('now', 'weekday 0', '-27 days') AS week_start  -- 获取 28 天前的周日  
        UNION ALL
          SELECT DATE(week_start, '+7 days')  
        FROM week_range   
        WHERE week_start < DATE('now', 'weekday 1')  -- 直到当前周的周日  
      )  
      SELECT   
        wr.week_start as week_start,
        COALESCE(COUNT(e.event_id), 0) AS pv,  
        COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  
      FROM week_range wr  
      LEFT JOIN EVENTS e 
        ON e.event_time >= (strftime('%s', wr.week_start) * 1000)  -- 从周一的 0 点开始  
        AND e.event_time < (strftime('%s', DATE(wr.week_start, '+7 days')) * 1000)  -- 到下周一的 0 点  
        AND e.event_id = '$pageview'  
      GROUP BY wr.week_start  
      ORDER BY wr.week_start;`;
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


  getMonth6() {
    const CACHE_KEY_PVUV = "cache-pvuv-month6";
    const result = cacheService.get(CACHE_KEY_PVUV);
    if (result) {
      if (result instanceof Promise) {
        return result;
      }
      return Promise.resolve(result);
    }
    const req = new Promise((resolve, reject) => {
      const query = `
      WITH RECURSIVE month_range AS (  
          SELECT DATE('now', 'start of month', '-5 months') AS month_start  -- 6 个月前的月初  
          UNION ALL  
          SELECT DATE(month_start, '+1 month')  
          FROM month_range   
          WHERE month_start < DATE('now', 'start of month')  -- 直到当前月的月初  
      )  
      SELECT   
          strftime('%Y-%m', month_start) AS month,  -- 格式化为 YYYY-MM  
          COALESCE(COUNT(e.event_id), 0) AS pv,  -- 访问量  
          COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  -- 独立用户数  
      FROM month_range mr  
      LEFT JOIN EVENTS e   
          ON mr.month_start = DATE(DATETIME(e.event_time / 1000, 'unixepoch', '+8 hours'), 'start of month')  -- 确保匹配到每月的月初  
          AND e.event_id = '$pageview'  
      GROUP BY month  
      ORDER BY month;`;
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