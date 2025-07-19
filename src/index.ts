import express from "express";
// import rateLimit from "express-rate-limit";
import routerCollector from "./routers/collector";
import routerAnalysis from "./routers/analysis";
import middlewareCors from "./middlewares/cors";
import middlewareLog from "./middlewares/log";

const app = express();

app.set('trust proxy', 1)
// 限制 IP 访问频率
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 一分钟内
//   max: 300, // 最多访问 300 次
//   message: "访问过于频繁，请稍后再试。",
// });

// 应用限制 IP 访问频率中间件 性能测试时请关闭此插件
// app.use(limiter); // use nginx

// text 解析
app.use(express.text());

// cors 跨域
app.use(middlewareCors); // use nginx

app.use(middlewareLog);

// 当客户端以get方式访问/路由时
app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.use('/collector', routerCollector)
app.use('/analysis', routerAnalysis)

// 程序监听3000端口
app.listen(3000, () => {
  console.log("Server Listen at port 3000 http://localhost:3000");
});
