import sqlite3  from 'sqlite3';

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
    viewport_height: vo.properties.$viewport_height
  }
  return row
}


class EventModel {
  constructor() {
    const file = "db/log.db"
    const db = new sqlite3.Database(file)  
    this.connection = db
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
    this.connection.run(query, (err, result) => {
      if (err) throw err;
      console.log("Events table created");
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
    this.connection.all(
      query,
      [
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
      ],
      (err, result) => {
        if (err) throw err;
        console.log("Event added");
      }
    );
  }

  async getTop10() {
    return new Promise((resolve, reject) => {
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
          resolve(rows);
        }
      });
    });
  }

  async getPv() {
    return new Promise((resolve, reject) => {
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
          resolve(rows);
        }
      });
    });
  }

  close() {
    this.db.close();
  }
}

const eventModel = new EventModel()
export default eventModel;