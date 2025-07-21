// 导入需要的函数
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  endOfDay,
  endOfHour,
  endOfMonth,
  endOfWeek,
  format,
  startOfDay,
  startOfHour,
  startOfMonth,
  startOfWeek,
  subDays,
  subHours,
  subMonths,
  subWeeks
} from "date-fns";

export const ONE_HOUR = 3600 * 1000;
export const ONE_DAY = 24 * ONE_HOUR;
export const ONE_WEEK = 7 * ONE_DAY;
export const ONE_MONTH = 30 * ONE_DAY;

// 生成过去 count 小时的数组
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

// 过去 count 天
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

// 过去 4 周
export const generateLastWeeks = (count = 4) => {
  const daysArray = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = startOfWeek(subWeeks(new Date(), i))
    const formattedDate = format(date, "yyyy-ww");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

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

export const generateLastMonths = (count = 6) => {
  const daysArray = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    const formattedDate = format(date, "yyyy-MM");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

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

export const clampStartTime = (startTime: number, endTime: number, distance: number) => {
  if (endTime - distance < startTime) {
    return startTime;
  }
  return endTime - distance;
}

export const clampEndTime = (startTime: number, endTime: number, distance: number) => {
  if (startTime + distance > endTime) {
    return endTime;
  }
  return startTime + distance;
}