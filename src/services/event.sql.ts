import { MetricType } from '../types/metrics.js'

export const createEventsSql = `
CREATE TABLE IF NOT EXISTS events 
(
    event_id VARCHAR, 
    event_time BIGINT,
    aa_id VARCHAR,
    session_id VARCHAR,
    lib VARCHAR,
    lib_version VARCHAR,
    url VARCHAR,
    title VARCHAR,
    referrer VARCHAR,
    screen_width INT,
    screen_height INT,
    viewport_width INT,
    viewport_height INT,
    user_agent VARCHAR
);
`
export function addColumnsToEvents(table: string, column: string, dataType: string) {
  return `ALTER TABLE ${table} ADD COLUMN ${column} ${dataType};`
}

export const createInsertSql = `
INSERT INTO events 
    (
    event_id, event_time, aa_id, session_id, lib, 
    lib_version, url, title, referrer, screen_width,
    screen_height, viewport_width, viewport_height, user_agent, browser, os, device_type
    )
VALUES`

export const createCountSql = ` 
SELECT
    COALESCE(COUNT(1), 0) AS count  -- 事件数量
FROM events`

export const createViewSql = ` 
SELECT
    COALESCE(COUNT(1), 0) AS pv,  -- 访问量  
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  -- 独立用户数
FROM events e
WHERE
    e.event_id = '$page_view'
`

export function createPVUVSql(start_time: number, end_time: number, date_evel: string) {
  let dateFormat = ''
  switch (date_evel) {
    case 'minute':
      dateFormat = '%Y-%m-%d %H:%M'
      break
    case 'hour':
      dateFormat = '%Y-%m-%d %H'
      break
    case 'day':
      dateFormat = '%Y-%m-%d'
      break
    case 'week':
      dateFormat = '%Y-%W'
      break
    case 'month':
      dateFormat = '%Y-%m'
      break
  }
  return `
SELECT
    strftime('${dateFormat}', datetime(e.event_time/1000, 'unixepoch', '+8 hours')) AS date,
    COALESCE(COUNT(1), 0) AS pv,
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
GROUP BY date
ORDER BY date
`
}

export function createMeticsSql(start_time: number, end_time: number) {
  return `
    SELECT
    COALESCE(COUNT(1), 0) AS ${MetricType.PAGEVIEWS},
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS ${MetricType.VISITORS},
    COALESCE(COUNT(DISTINCT e.session_id), 0) AS ${MetricType.VISITS},
    -- 跳出率计算
      CASE 
        WHEN COUNT(DISTINCT e.session_id) > 0 THEN
          ROUND(
            (SELECT COUNT(DISTINCT session_id) 
              FROM events 
              WHERE event_id = '$page_view'
                AND event_time >= ${start_time}
                AND event_time <= ${end_time}
                AND session_id IN (
                  SELECT session_id 
                  FROM events 
                  WHERE event_id = '$page_view'
                    AND event_time >= ${start_time}
                    AND event_time <= ${end_time}
                  GROUP BY session_id 
                  HAVING COUNT(*) <= 2
                )
            ) * 100.0 / COUNT(DISTINCT e.session_id),
            2
          )
        ELSE 0
      END AS ${MetricType.BOUNCES},
      -- 平均会话时长计算
      COALESCE(
        (SELECT ROUND(AVG(session_duration), 2)
          FROM (
            SELECT MAX(event_time) - MIN(event_time) AS session_duration
            FROM events
            WHERE event_id = '$page_view'
              AND event_time >= ${start_time}
              AND event_time <= ${end_time}
            GROUP BY session_id
            HAVING COUNT(*) > 1 OR MAX(event_time) > MIN(event_time)
          ) WHERE session_duration > 0
        ), 0
      ) AS ${MetricType.TOTAL_TIME}
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
`
}

export function createTopPagesSql(start_time: number, end_time: number) {
  return `
SELECT
    CASE 
        WHEN INSTR(e.url, '?') > 0 THEN SUBSTR(e.url, 1, INSTR(e.url, '?') - 1)
        WHEN INSTR(e.url, '#') > 0 THEN SUBSTR(e.url, 1, INSTR(e.url, '#') - 1)
        ELSE e.url 
    END AS clean_url,
    COUNT(1) AS pv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
GROUP BY clean_url
ORDER BY pv DESC
LIMIT 10
`
}

export function createTopRefererSql(start_time: number, end_time: number) {
  return `
SELECT
    CASE 
        WHEN INSTR(e.referrer, '://') > 0 THEN 
            SUBSTR(
                e.referrer,
                1,
                INSTR(e.referrer, '://') + 2 + 
                CASE 
                    WHEN INSTR(SUBSTR(e.referrer, INSTR(e.referrer, '://') + 3), '/') > 0 THEN 
                        INSTR(SUBSTR(e.referrer, INSTR(e.referrer, '://') + 3), '/') - 1
                    ELSE LENGTH(SUBSTR(e.referrer, INSTR(e.referrer, '://') + 3))
                END
            )
        WHEN INSTR(e.referrer, '/') > 0 THEN 
            SUBSTR(e.referrer, 1, INSTR(e.referrer, '/') - 1)
        ELSE e.referrer 
    END AS referrer_no_path,
    COUNT(1) AS pv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
GROUP BY referrer_no_path
ORDER BY pv DESC
LIMIT 10
`
}

export function createTopOsSql(start_time: number, end_time: number) {
  return `
SELECT
    e.os,
    COUNT(1) AS pv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
GROUP BY os
ORDER BY pv DESC
LIMIT 10
`
}

export function createTopBrowserSql(start_time: number, end_time: number) {
  return `
SELECT
    e.browser,
    COUNT(1) AS pv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
GROUP BY browser
ORDER BY pv DESC
LIMIT 10
`
}
