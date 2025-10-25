export type DateLevel = "minute" | "hour" | "day" | "week" | "month";

export enum MetricType {
  PAGEVIEWS = "pageviews",
  VISITORS = "visitors",
  VISITS = "visits",
}

export class Metics {
  [MetricType.PAGEVIEWS]: number = 0;
  [MetricType.VISITORS]: number = 0;
  [MetricType.VISITS]: number = 0;
}