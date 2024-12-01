# datasink-server

简单埋点日志接收服务

## API

```bash
# 上报事件
POST /t
```

```bash
# 获取每日浏览次数和人数
GET /pvuv
```

```bash
# 获取 Top10 访问页面
GET /top10
```

## Benchmark

```bash
$ node test/benchmark.cjs 
Trace    qps: 3735.46 time(ms): 2.29 total: 41087
Pageview qps: 5436.91 time(ms): 1.27 total: 59802
Top10    qps: 5533.64 time(ms): 1.21 total: 60865
```
