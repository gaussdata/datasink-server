import sqlite3 from "sqlite3";
import LRU from "../utils/LRU.js";
import {
  generateLast24Hours,
  generateLast4Weeks,
  generateLast6Months,
  generateLast7Days,
} from "../utils/date.js";
import { setMinutes, startOfWeek, subHours, subWeeks } from "date-fns";

const cacheService = new LRU();
const USE_CACHE = true;

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
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
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
    ];
    return new Promise((resolve, reject) => {
      this.connection.all(query, params, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
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
    const placeholders = events
      .map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .join(", ");
    const params = [];

    // 填充参数数组
    events.forEach((event) => {
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
          reject(err);
        } else {
          console.log(`${events.length} events added`);
          resolve(result);
        }
      });
    });
  }

  async getTop10() {
    const CACHE_KEY_TOP10 = "cache-pv-top10";
    if (USE_CACHE) {
      const result = cacheService.get(CACHE_KEY_TOP10);
      if (result) {
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      }
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
    if (USE_CACHE) {
      const result = cacheService.get(CACHE_KEY_PVUV);
      if (result) {
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      }
    }
    const startTime = new Date(setMinutes(subHours(new Date(), 23), 0));
    const req = new Promise((resolve, reject) => {
      const query = `
      SELECT   
        strftime('%Y-%m-%d %H', DATETIME(e.event_time / 1000, 'unixepoch', '+8 hours')) AS hour,
        COUNT(e.event_id) AS pv,  
        COUNT(DISTINCT e.aa_id) AS uv  
      FROM EVENTS e  
      WHERE
        e.event_time > ${startTime.getTime()} 
        AND
        e.event_id = '$pageview'  
      GROUP BY hour  
      ORDER BY hour;`;
      this.connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const map = {};
          rows.forEach((row) => {
            map[row.hour] = row;
          });
          const result = generateLast24Hours().map((hour) => {
            return {
              hour,
              pv: map[hour]?.pv || 0,
              uv: map[hour]?.uv || 0,
            };
          });
          cacheService.set(CACHE_KEY_PVUV, result);
          resolve(result);
        }
      });
    });
    cacheService.set(CACHE_KEY_PVUV, req);
    return req;
  }

  async getDay7() {
    const CACHE_KEY_PVUV = "cache-pvuv-day7";
    if (USE_CACHE) {
      const result = cacheService.get(CACHE_KEY_PVUV);
      if (result) {
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      }
    }
    const startTime = new Date(generateLast7Days()[0]);
    const req = new Promise((resolve, reject) => {
      const query = `
      SELECT   
          strftime('%Y-%m-%d', DATETIME(e.event_time / 1000, 'unixepoch', '+8 hours'))  as day,
          COALESCE(COUNT(e.event_id), 0) AS pv,  
          COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv 
      FROM EVENTS e  
      WHERE
        e.event_time > ${startTime.getTime()}
        AND
        e.event_id = '$pageview'  
      GROUP BY day  
      ORDER BY day;`;
      this.connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const map = {};
          rows.forEach((row) => {
            map[row.day] = row;
          });
          const result = generateLast7Days().map((day) => {
            return {
              day,
              pv: map[day]?.pv || 0,
              uv: map[day]?.uv || 0,
            };
          });
          cacheService.set(CACHE_KEY_PVUV, result);
          resolve(result);
        }
      });
    });
    cacheService.set(CACHE_KEY_PVUV, req);
    return req;
  }

  getWeek4() {
    const CACHE_KEY_PVUV = "cache-pvuv-week4";
    if (USE_CACHE) {
      const result = cacheService.get(CACHE_KEY_PVUV);
      if (result) {
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      }
    }
    const startTime = new Date(startOfWeek(subWeeks(new Date(), 3), 0));
    const req = new Promise((resolve, reject) => {
      const query = `
      SELECT   
        strftime('%Y-%W', DATETIME(e.event_time / 1000, 'unixepoch', '+8 hours')) as week,
        COALESCE(COUNT(e.event_id), 0) AS pv,  
        COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  
      FROM EVENTS e
      WHERE
        e.event_time > ${startTime.getTime()} 
        AND 
        e.event_id = '$pageview'  
      GROUP BY week  
      ORDER BY week;`;
      this.connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const map = {};
          rows.forEach((row) => {
            map[row.week] = row;
          });
          const result = generateLast4Weeks().map((week) => {
            return {
              week,
              pv: map[week]?.pv || 0,
              uv: map[week]?.uv || 0,
            };
          });
          cacheService.set(CACHE_KEY_PVUV, result);
          resolve(result);
        }
      });
    });
    cacheService.set(CACHE_KEY_PVUV, req);
    return req;
  }

  getMonth6() {
    const CACHE_KEY_PVUV = "cache-pvuv-month6";
    if (USE_CACHE) {
      const result = cacheService.get(CACHE_KEY_PVUV);
      if (result) {
        if (result instanceof Promise) {
          return result;
        }
        return Promise.resolve(result);
      }
    }
    const startTime = new Date(generateLast6Months()[0]);
    const req = new Promise((resolve, reject) => {
      const query = `
      SELECT   
          strftime('%Y-%m', DATETIME(e.event_time / 1000, 'unixepoch', '+8 hours')) AS month,
          COALESCE(COUNT(e.event_id), 0) AS pv,  -- 访问量  
          COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  -- 独立用户数  
      FROM EVENTS e
      WHERE
        e.event_time > ${startTime.getTime()} 
        AND 
        e.event_id = '$pageview'  
      GROUP BY month  
      ORDER BY month;`;
      this.connection.all(query, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const map = {};
          rows.forEach((row) => {
            map[row.month] = row;
          });
          const result = generateLast6Months().map((month) => {
            return {
              month,
              pv: map[month]?.pv || 0,
              uv: map[month]?.uv || 0,
            };
          });
          cacheService.set(CACHE_KEY_PVUV, result);
          resolve(result);
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
