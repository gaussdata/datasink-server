// 导入需要的函数
import { ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK } from "@/consts/date.js";
import { DateLevel } from "@/types/date";
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
  format,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfWeek,
  subDays,
  subHours,
  subMinutes,
  subMonths,
  subWeeks
} from "date-fns";

/**
 * 生成过去 count 分钟的数组
 * @param count 分钟数
 * @returns 分钟数组
 */
export const generateLastMinutes = (count = 60) => {
  const minutesArray = [];
  for (let i = count - 1; i >= 0; i--) {
    // 计算当前时间减去 i 分钟
    const date = subMinutes(new Date(), i)
    const formattedDate = format(date, "yyyy-MM-dd HH:mm");
    minutesArray.push(formattedDate);
  }
  return minutesArray;
};

export const generateMinutesByTime = (startTime: number, endTime: number) => {
  const minutesArray = [];
  const start = startOfMinute(startTime);
  const end = endOfMinute(endTime);
  let current = start;
  while (current < end) {
    minutesArray.push(format(current, "yyyy-MM-dd HH:mm"));
    current = addMinutes(current, 1);
  }
  return minutesArray;
}

/**
 * 生成过去 count 小时的数组
 * @param count 小时数
 * @returns 小时数组
 */
export const generateLastHours = (count = 24) => {
  const hoursArray = [];
  for (let i = count - 1; i >= 0; i--) {
    // 计算当前时间减去 i 小时
    const date = subHours(new Date(), i)
    const formattedDate = format(date, "yyyy-MM-dd HH");
    hoursArray.push(formattedDate);
  }
  return hoursArray;
};

/**
 * 生成时间范围内的小时数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 
 */
export const generateHoursByTime = (startTime: number, endTime: number) => {
  const hoursArray = [];
  const start = startOfHour(startTime);
  const end = endOfHour(endTime);
  let current = start;
  while (current < end) {
    hoursArray.push(format(current, "yyyy-MM-dd HH"));
    current = addHours(current, 1);
  }
  return hoursArray;
}

/**
 * 生成过去 count 天的数组
 * @param count 
 * @returns 
 */
export const generateLastDays = (count = 7) => {
  const daysArray = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    // 格式化为 'yyyy-MM-dd'
    const formattedDate = format(date, "yyyy-MM-dd");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

/**
 * 生成时间范围内的天数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 
 */
export const generateDaysByTime = (startTime: number, endTime: number) => {
  const daysArray = [];
  const start = startOfDay(startTime);
  const end = endOfDay(endTime);
  let current = start;
  while (current < end) {
    daysArray.push(format(current, "yyyy-MM-dd"));
    current = addDays(current, 1);
  }
  return daysArray;
}

/**
 * 生成过去 count 周的数组
 * @param count 
 * @returns 周数组
 */
export const generateLastWeeks = (count = 4) => {
  const daysArray = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = startOfWeek(subWeeks(new Date(), i))
    const formattedDate = format(date, "yyyy-ww");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

/**
 * 生成时间范围内的周数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 
 */
export const generateWeeksByTime = (startTime: number, endTime: number) => {
  const daysArray = [];
  const start = startOfWeek(startTime);
  const end = endOfWeek(endTime);
  let current = start;
  while (current < end) {
    daysArray.push(format(current, "yyyy-ww"));
    current = addWeeks(current, 1);
  }
  return daysArray;
}

/**
 * 生成过去 count 月的数组
 * @param count 
 * @returns 
 */
export const generateLastMonths = (count = 6) => {
  const daysArray = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const formattedDate = format(date, "yyyy-MM");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

/**
 * 生成时间范围内的月数组
 * @param startTime 开始时间
 * @param endTime 结束时间
 * @returns 
 */
export const generateMonthsByTime = (startTime: number, endTime: number) => {
  const daysArray = [];
  const start = startOfMonth(startTime);
  const end = endOfMonth(endTime);
  let current = start;
  while (current < end) {
    daysArray.push(format(current, "yyyy-MM"));
    current = addMonths(current, 1);
  }
  return daysArray;
}

/**
 * 生成时间范围内的日期数组
 * @param startTime 
 * @param endTime 
 * @param unit 
 * @returns 
 */
export const generateDatesByTime = (startTime: number, endTime: number, unit: DateLevel) => {
  switch (unit) {
    case 'minute':
      return generateMinutesByTime(startTime, endTime);
    case 'hour':
      return generateHoursByTime(startTime, endTime);
    case 'day':
      return generateDaysByTime(startTime, endTime);
    case 'week':
      return generateWeeksByTime(startTime, endTime);
    case 'month':
      return generateMonthsByTime(startTime, endTime);
  }
}

export const clampStartTime = (startTime: number, endTime: number, distance: number) => {
  if (endTime - distance < startTime) {
    return startTime;
  }
  return endTime - distance;
}

export const clampStartTimeByUnit = (startTime: number, endTime: number, unit: DateLevel) => {
  switch (unit) {
    case 'minute':
      return clampStartTime(startTime, endTime, 60 * ONE_MINUTE);
    case 'hour':
      return clampStartTime(startTime, endTime, 24 * ONE_HOUR);
    case 'day':
      return clampStartTime(startTime, endTime, 30 * ONE_DAY);
    case 'week':
      return clampStartTime(startTime, endTime, 24 * ONE_WEEK);
    case 'month':
      return clampStartTime(startTime, endTime, 24 * ONE_MONTH);
  }
}


export const clampEndTime = (startTime: number, endTime: number, distance: number) => {
  if (startTime + distance > endTime) {
    return endTime;
  }
  return startTime + distance;
}