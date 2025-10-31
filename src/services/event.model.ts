export interface IEventVo {
  head: {
    code: string
    time: number
    aaid: string
    sid: string
    lib: string
    lib_version: string
  }
  body: {
    url: string
    title: string
    referrer: string
    screen_width: number
    screen_height: number
    screen_resolution: string
    window_width: number
    window_height: number
    window_resolution: string
    user_agent: string
    os: string
    browser: string
    device_type: string
    timezone: string
    language: string
  }
}

export interface IEventDto {
  event_id: string
  event_time: number
  aa_id: string
  session_id: string
  lib: string
  lib_version: string
  url: string
  title: string
  referrer: string
  screen_width: number
  screen_height: number
  screen_resolution: string
  viewport_width: number
  viewport_height: number
  viewport_resolution: string
  user_agent: string
  os: string
  browser: string
  device_type: string
  timezone: string
  language: string
}
