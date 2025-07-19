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

export const createHour24Sql = timestamp => `
SELECT
    date(e.event_time/1000, 'unixepoch') AS hour,
    COALESCE(COUNT(1), 0) AS pv,
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${timestamp}
GROUP BY hour
ORDER BY hour
`

export const createDay30Sql = timestamp => `
SELECT
    date(e.event_time/1000, 'unixepoch') AS day,
    COALESCE(COUNT(1), 0) AS pv,
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${timestamp}

GROUP BY day
ORDER BY day
`

export const createWeek24Sql = timestamp => `
SELECT
    date(e.event_time/1000, 'unixepoch') AS week,
    COALESCE(COUNT(1), 0) AS pv,
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${timestamp}
GROUP BY week
ORDER BY week
`


export const createMonth24Sql = timestamp => `
SELECT
    date(e.event_time/1000, 'unixepoch') AS month,
    COALESCE(COUNT(1), 0) AS pv,
    COALESCE(COUNT(DISTINCT e.aa_id), 0) AS uv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${timestamp}
GROUP BY month
ORDER BY month
`

export const createTopPagesSql = timestamp => `
SELECT
    e.url,
    COUNT(1) AS pv
FROM events e
WHERE
    e.event_id = '$page_view'
    AND e.event_time >= ${timestamp}
GROUP BY e.url
ORDER BY pv DESC
LIMIT 10
`