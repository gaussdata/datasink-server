import express from 'express';
import querystring from 'querystring';
import logger from "./logger/index.js";
import rateLimit from 'express-rate-limit'
import eventModel from './model/index.js';

const app = express();

// 限制 IP 访问频率
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 一分钟内
  max: 300, // 最多访问 300 次
  message: '访问过于频繁，请稍后再试。',
});

// 应用限制 IP 访问频率中间件
app.use(limiter);

// text 解析
app.use(express.text())

// cors 跨域
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  // next
  next();
});

// 当客户端以get方式访问/路由时
app.get("/", (req, res) => {
  res.send("Hello Express");
});


// 接收埋点消息
app.post("/sa.gif", (req, res) => {
  const urlParams = req.body;
  const params = querystring.parse(urlParams)
  const base64Data = params.data || '';
  const jsonData = Buffer.from(base64Data, 'base64').toString();
  if (jsonData.length > 10 * 1024) {
    res.status(413)
    res.send("Content Too Large");
    return false;
  }
  logger.info(jsonData);
  res.send("OK");
});

app.get('/top10', (req, res) => {
  console.log(req.url)
  eventModel.getTop10().then(result => {
    console.log(result)
    res.send({
      code: 200,
      message: 'success',
      data: result
    })
  })
})

// 程序监听3000端口
app.listen(3000, () => {
  console.log('服务器已启动，端口号为 3000');
});
