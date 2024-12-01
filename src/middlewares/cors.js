function cors(req, res, next) {
  if (req.method === "OPTIONS") {
    // 设置允许跨域的域名，具体的域名更安全
    res.header("Access-Control-Allow-Origin", "https://yourdomain.com"); // 替换为你具体的域名
    // 允许的header类型，添加Authorization等常用头部
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    // 跨域允许的请求方式
    res.header(
      "Access-Control-Allow-Methods",
      "DELETE, PUT, POST, GET, OPTIONS"
    );
    // 使预检请求在24小时内有效
    res.header("Access-Control-Max-Age", "86400"); // 24小时
    // 响应204状态码表示没有内容
    res.sendStatus(204);
    return; // 明确返回
  }

  next(); // 继续处理其它请求
}

export default cors;