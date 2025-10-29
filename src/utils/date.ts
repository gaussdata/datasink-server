import type { DateLevel } from '@/types/date'
import {
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addWeeks,
  endOfDay,
  endOfHour,
  endOfMinute,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfWeek,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subWeeks,
} from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
// 导入需要的函数
import {
  ONE_DAY,
  ONE_HOUR,
  ONE_MINUTE,
  ONE_MONTH,
  ONE_WEEK,
} from '@/consts/date.js'

/**
 * 生成过去 count 分钟的数组
 * @param count 分钟数
 * @returns 分钟数组
 */
export function generateLastMinutes(count = 60) {
  const minutesArray = []
  for (let i = count - 1; i >= 0; i--) {
    // 计算当前时间减去 i 分钟
    const date = subMinutes(new Date(), i)
    const formattedDate = formatInTimeZone(
      date,
      'Asia/Shanghai',
      'yyyy-MM-dd HH:mm',
    )
    minutesArray.push(formattedDate)
  }
  return minutesArray
}

export function generateMinutesByTime(startTime: number, endTime: number) {
  const minutesArray = []
  const start = startOfMinute(startTime)
  const end = endOfMinute(endTime)
  let current = start
  while (current < end) {
    minutesArray.push(
      formatInTimeZone(current, 'Asia/Shanghai', 'yyyy-MM-dd HH:mm'),
    )
    current = addMinutes(current, 1)
  }
  return minutesArray
}

/**
 * 生成过去 count 小时的数组
 * @param count 小时数
 * @returns 小时数组
 */
export function generateLastHours(count = 24) {
  const hoursArray = []
  for (let i = count - 1; i >= 0; i--) {
    // 计算当前时间减去 i 小时
    const date = subHours(new Date(), i)
    const formattedDate = formatInTimeZone(
      date,
      'Asia/Shanghai',
      'yyyy-MM-dd HH',
    )
    hoursArray.push(formattedDate)
  }
  return hoursArray
}

/**
 * 生成时间范围内的小时数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns date array of hours
 */
export function generateHoursByTime(startTime: number, endTime: number) {
  const hoursArray = []
  const start = startOfHour(startTime)
  const end = endOfHour(endTime)
  let current = start
  while (current < end) {
    hoursArray.push(
      formatInTimeZone(current, 'Asia/Shanghai', 'yyyy-MM-dd HH'),
    )
    current = addHours(current, 1)
  }
  return hoursArray
}

/**
 * 生成过去 count 天的数组
 * @param count
 * @returns date array of days
 */
export function generateLastDays(count = 7) {
  const daysArray = []
  for (let i = count - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    // 格式化为 'yyyy-MM-dd'
    const formattedDate = formatInTimeZone(date, 'Asia/Shanghai', 'yyyy-MM-dd')
    daysArray.push(formattedDate)
  }
  return daysArray
}

/**
 * 生成时间范围内的天数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns date array of days
 */
export function generateDaysByTime(startTime: number, endTime: number) {
  const daysArray = []
  const start = startOfDay(startTime)
  const end = endOfDay(endTime)
  let current = start
  while (current < end) {
    daysArray.push(formatInTimeZone(current, 'Asia/Shanghai', 'yyyy-MM-dd'))
    current = addDays(current, 1)
  }
  return daysArray
}

/**
 * 生成过去 count 周的数组
 * @param count
 * @returns date array of weeks
 */
export function generateLastWeeks(count = 4) {
  const daysArray = []
  for (let i = count - 1; i >= 0; i--) {
    const date = startOfWeek(subWeeks(new Date(), i))
    const formattedDate = formatInTimeZone(date, 'Asia/Shanghai', 'yyyy-ww')
    daysArray.push(formattedDate)
  }
  return daysArray
}

/**
 * 生成时间范围内的周数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns date array of weeks
 */
export function generateWeeksByTime(startTime: number, endTime: number) {
  const daysArray = []
  const start = startOfWeek(startTime)
  const end = endOfWeek(endTime)
  let current = start
  while (current < end) {
    daysArray.push(formatInTimeZone(current, 'Asia/Shanghai', 'yyyy-ww'))
    current = addWeeks(current, 1)
  }
  return daysArray
}

/**
 * 生成过去 count 月的数组
 * @param count
 * @returns date array of months
 */
export function generateLastMonths(count = 6) {
  const daysArray = []
  for (let i = count - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const formattedDate = formatInTimeZone(date, 'Asia/Shanghai', 'yyyy-MM')
    daysArray.push(formattedDate)
  }
  return daysArray
}

/**
 * 生成时间范围内的月数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns date array of months
 */
export function generateMonthsByTime(startTime: number, endTime: number) {
  const daysArray = []
  const start = startOfMonth(startTime)
  const end = endOfMonth(endTime)
  let current = start
  while (current < end) {
    daysArray.push(formatInTimeZone(current, 'Asia/Shanghai', 'yyyy-MM'))
    current = addMonths(current, 1)
  }
  return daysArray
}

/**
 * 生成时间范围内的日期数组
 * @param startTime
 * @param endTime
 * @param unit
 * @returns {string[]} date array
 */
export function generateDatesByTime(startTime: number, endTime: number, unit: DateLevel) {
  switch (unit) {
    case 'minute':
      return generateMinutesByTime(startTime, endTime)
    case 'hour':
      return generateHoursByTime(startTime, endTime)
    case 'day':
      return generateDaysByTime(startTime, endTime)
    case 'week':
      return generateWeeksByTime(startTime, endTime)
    case 'month':
      return generateMonthsByTime(startTime, endTime)
  }
}

/**
 *
 * @param startTime
 * @param endTime
 * @param distance
 * @returns timestamp
 */
export function clampStartTime(startTime: number, endTime: number, distance: number) {
  if (endTime - distance < startTime) {
    return startTime
  }
  return endTime - distance
}

/**
 *
 * @param startTime
 * @param endTime
 * @param unit
 * @returns timestamp
 */
export function clampStartTimeByUnit(startTime: number, endTime: number, unit: DateLevel) {
  switch (unit) {
    case 'minute':
      return clampStartTime(startTime, endTime, 120 * ONE_MINUTE)
    case 'hour':
      return clampStartTime(startTime, endTime, 72 * ONE_HOUR)
    case 'day':
      return clampStartTime(startTime, endTime, 90 * ONE_DAY)
    case 'week':
      return clampStartTime(startTime, endTime, 24 * ONE_WEEK)
    case 'month':
      return clampStartTime(startTime, endTime, 24 * ONE_MONTH)
  }
}

/**
 *
 * @param startTime
 * @param endTime
 * @param distance
 * @returns timestamp
 */
export function clampEndTime(startTime: number, endTime: number, distance: number) {
  if (startTime + distance > endTime) {
    return endTime
  }
  return startTime + distance
}
