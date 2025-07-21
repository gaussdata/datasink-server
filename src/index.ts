import express from "express";
import routerCollector from "./routers/collector.js";
import routerAnalysis from "./routers/analysis.js";
import middlewareCors from "./middlewares/cors.js";
import middlewareLog from "./middlewares/log.js";

const app = express();

app.set('trust proxy', 1);
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
