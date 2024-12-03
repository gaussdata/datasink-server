// 导入需要的函数
import {
  format,
  setHours,
  startOfWeek,
  subDays,
  subHours,
  subMonths,
  subWeeks
} from "date-fns";

// 生成过去 24 小时的数组
export const generateLast24Hours = () => {
  const hoursArray = [];
  for (let i = 23; i >= 0; i--) {
    // 计算当前时间减去 i 小时
    const date = subHours(new Date(), i)
    const formattedDate = format(date, "yyyy-MM-dd HH");
    hoursArray.push(formattedDate);
  }
  return hoursArray;
};

console.log(generateLast24Hours());

// 过去 7 天
export const generateLast7Days = () => {
  const daysArray = [];
  for (let i = 7; i >= 0; i--) {
    const date = subDays(new Date(), i);
    // 格式化为 'yyyy-MM-dd'
    const formattedDate = format(date, "yyyy-MM-dd");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

console.log(generateLast7Days());

// 过去 4 周
export const generateLast4Weeks = () => {
  const daysArray = [];
  for (let i = 3; i >= 0; i--) {
    const date = startOfWeek(subWeeks(new Date(), i), 0)
    // 格式化为 'yyyy-ww'
    const formattedDate = format(date, "yyyy-ww");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

console.log(generateLast4Weeks());

// 过去 6 月
export const generateLast6Months = () => {
  const daysArray = [];
  for (let i = 5; i >= 0; i--) {
    const date = subMonths(new Date(), i)
    // 格式化为 'yyyy-ww'
    const formattedDate =  format(date, "yyyy-MM");
    daysArray.push(formattedDate);
  }
  return daysArray;
};

console.log(generateLast6Months());