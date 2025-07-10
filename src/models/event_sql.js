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