# datasink-server

一个简洁的埋点数据接收与分析服务。

## Intro

使用 Node.js + Express + SQLite 搭建，支持高并发事件接入、按时间粒度的 PV/UV 统计、Top 页面、基本指标聚合，并内置缓存与访问日志。

## API

- `POST /collector/t` 埋点接口

- `GET /analysis/metrics` 访问量统计
- `GET /analysis/pvuv` 访问量趋势
- `GET /analysis/top-pages` 页面 Top10
- `GET /analysis/top-referers` 来源 Top10
- `GET /analysis/top-oses` 操作系统 Top10
- `GET /analysis/top-browsers` 浏览器 Top10
