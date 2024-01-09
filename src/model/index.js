import mysql from 'mysql';
import config from '../../config/index.js';

class EventModel {
  constructor(config) {
    this.connection = mysql.createConnection(config);
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
    this.connection.query(query, (err, result) => {
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
    this.connection.query(
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
              title,
              COUNT(*) AS title_count,
              COUNT(*) * 100.0 / (SELECT COUNT(*) FROM events) AS percentage
        FROM events
        WHERE title IS NOT NULL
        GROUP BY title
        ORDER BY title_count DESC
        LIMIT 10;`;
      this.connection.query(query, (err, rows) => {
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
const eventModel = new EventModel(config.mysql)

export default eventModel;