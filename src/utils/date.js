// 导入需要的函数
import {
  format,
  startOfWeek,
  subDays,
  subHours,
  subMonths,
  subWeeks
} from "date-fns";

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

// 过去 4 周
export const generateLastWeeks = (count = 4) => {
  const daysArray = [];
  for (let i = count - 1; i >= 0; i--) {
    const date = startOfWeek(subWeeks(new Date(), i), 0)
    // 格式化为 'yyyy-ww'
    const formattedDate = format(date, "yyyy-ww");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

export const generateLastMonths = (count = 6) => {
  const daysArray = [];
  for (let i = count -1 ; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    // 格式化为 'yyyy-ww'
    const formattedDate =  format(date, "yyyy-MM");
    daysArray.push(formattedDate);
  }
  return daysArray;
};