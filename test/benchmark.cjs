"use strict";

const autocannon = require("autocannon");

async function testTrace() {
  const result = await autocannon({
    url: "http://localhost:3000/collector/t",
    connections: 10, //default
    pipelining: 1, // default
    duration: 10, // default
    amount: 500 * 1000,
    method: 'POST',
    headers: {
      'content-type': 'text/plain;charset=UTF-8',
    },
    body: '[{"head":{"code":"$page_load","lib":"js","lib_version":"0.0.1","time":1752163777172,"aaid":"a87488f9c95832c89cf174877d59383e","sid":"ef0100878d34c184e1c03a13887f9b30"},"body":{"url":"http://localhost:5173/","title":"Vite + TS","referrer":"http://localhost:5173/","dpr":1.5,"user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36","language":"zh-CN","screen_width":1280,"screen_height":720,"window_width":1280,"window_height":720}},{"head":{"code":"$page_view","lib":"js","lib_version":"0.0.1","time":1752163777180,"aaid":"a87488f9c95832c89cf174877d59383e","sid":"ef0100878d34c184e1c03a13887f9b30"},"body":{"url":"http://localhost:5173/","title":"Vite + TS","referrer":"http://localhost:5173/","dpr":1.5,"user_agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36","language":"zh-CN","screen_width":1280,"screen_height":720,"window_width":1280,"window_height":720}}]'
  });
  console.log(result.requests.average);
}

async function test() {
  await testTrace();
}

test();
