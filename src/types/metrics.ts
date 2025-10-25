export enum MetricType {
  PAGEVIEWS = "pageviews",
  VISITORS = "visitors",
  VISITS = "visits",
  BOUNCES = "bounces",
  TOTAL_TIME = 'totaltime',
}

export class Metrics {
  [MetricType.PAGEVIEWS]: number = 0;
  [MetricType.VISITORS]: number = 0;
  [MetricType.VISITS]: number = 0;
  [MetricType.BOUNCES]: number = 0;
  [MetricType.TOTAL_TIME]: number = 0;
}