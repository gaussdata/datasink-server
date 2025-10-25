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
);`;

export const createInsertSql = `
INSERT INTO events 
    (
    event_id, event_time, aa_id, session_id, lib, 
    lib_version, url, title, referrer, screen_width,
    screen_height, viewport_width, viewport_height, user_agent
    )
VALUES`;

export const createCountSql = ` 
SELECT
    COALESCE(COUNT(1), 0) AS count  -- 事件数量
FROM events`;

export const createViewSql = ` 
SELECT
    COALESCE(COUNT(1), 0) AS pv,  -- 访问量  
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv  -- 独立用户数
FROM events e
WHERE
    e.event_id = '$page_view'
`;

export const createPVUVSql = (
  start_time: number,
  end_time: number,
  date_evel: string
) => {
  let dateFormat = "";
  switch (date_evel) {
    case "minute":
      dateFormat = "%Y-%m-%d %H:%M";
      break;
    case "hour":
      dateFormat = "%Y-%m-%d %H";
      break;
    case "day":
      dateFormat = "%Y-%m-%d";
      break;
    case "week":
      dateFormat = "%Y-%W";
      break;
    case "month":
      dateFormat = "%Y-%m";
      break;
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
`;
};

export const createMeticsSql = (start_time: number, end_time: number) => `
    SELECT
    COALESCE(COUNT(1), 0) AS pageviews,
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS visitors,
    COALESCE(COUNT(DISTINCT e.session_id), 0) AS visits
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
`;

export const createTopPagesSql = (start_time: number, end_time: number) => `
SELECT
    e.url,
    COUNT(1) AS pv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${start_time}
    AND e.event_time <= ${end_time}
GROUP BY e.url
ORDER BY pv DESC
LIMIT 10
`;
