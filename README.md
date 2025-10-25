# datasink-server

一个简洁的埋点数据接收与分析服务。使用 Node.js + Express + SQLite 搭建，支持高并发事件接入、按时间粒度的 PV/UV 统计、Top 页面、基本指标聚合，并内置缓存与访问日志。

## 主要特性

- 事件采集：`POST /collector/t` 批量接收埋点数据（文本格式，JSON 数组）并异步批量写入。
- 数据存储：本地 `SQLite`，首次启动自动建表，数据文件位于 `db/sqlite3.db`。
- 分析查询：提供总量统计、PV/UV 按时间粒度、Top 页面、基础指标（pageviews/visitors/visits）。
- 缓存与限流：分析接口 60s 级别的响应缓存，采集端队列化批量插入（默认每批 200 条）。
- 日志与 CORS：请求访问日志写入 `logs/access.log`；内置跨域支持。

## 快速开始

1. 安装依赖
   - 使用 npm：`npm install`
   - 或使用 pnpm：`pnpm install`
2. 开发模式启动：`npm run dev`
3. 生产模式启动：`npm start`
4. 服务默认监听：`http://localhost:3000`

首次启动会创建 `db/sqlite3.db` 数据库文件。访问日志写入 `logs/access.log`。
