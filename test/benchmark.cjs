"use strict";

const autocannon = require("autocannon");

async function testTrace() {
  const result = await autocannon({
    url: "http://localhost:3000/t",
    connections: 10, //default
    pipelining: 1, // default
    duration: 10, // default
    method: 'POST',
    headers: {
      'content-type': 'text/plain',
    },
    body: 'data=eyJpZGVudGl0aWVzIjp7IiRpZGVudGl0eV9jb29raWVfaWQiOiIxOTJmN2QzOWRkOGYwYy0wYWI3OTZlZTVmMTg4My0yNjAxMTk1MS0xNDQwMDAwLTE5MmY3ZDM5ZGRhZmI1IiwiJGlkZW50aXR5X2Fub255bW91c19pZCI6IjE5MmY3ZDM5ZGQ4ZjBjLTBhYjc5NmVlNWYxODgzLTI2MDExOTUxLTE0NDAwMDAtMTkyZjdkMzlkZGFmYjUifSwiZGlzdGluY3RfaWQiOiIxOTJmN2QzOWRkOGYwYy0wYWI3OTZlZTVmMTg4My0yNjAxMTk1MS0xNDQwMDAwLTE5MmY3ZDM5ZGRhZmI1IiwibGliIjp7IiRsaWIiOiJqcyIsIiRsaWJfbWV0aG9kIjoiY29kZSIsIiRsaWJfdmVyc2lvbiI6IjEuMjYuMTgifSwicHJvcGVydGllcyI6eyIkdGltZXpvbmVfb2Zmc2V0IjotNDgwLCIkc2NyZWVuX2hlaWdodCI6MTA4MCwiJHNjcmVlbl93aWR0aCI6MTkyMCwiJHZpZXdwb3J0X2hlaWdodCI6OTI5LCIkdmlld3BvcnRfd2lkdGgiOjEwMDAsIiRsaWIiOiJqcyIsIiRsaWJfdmVyc2lvbiI6IjEuMjYuMTgiLCIkbGF0ZXN0X3RyYWZmaWNfc291cmNlX3R5cGUiOiJ1cmznmoRkb21haW7op6PmnpDlpLHotKUiLCIkbGF0ZXN0X3NlYXJjaF9rZXl3b3JkIjoidXJs55qEZG9tYWlu6Kej5p6Q5aSx6LSlIiwiJGxhdGVzdF9yZWZlcnJlciI6InVybOeahGRvbWFpbuino%2BaekOWksei0pSIsIiRyZWZlcnJlciI6Imh0dHA6Ly8xOTIuMTY4LjQuMTk4L2NvbXB1dGVyL2FsZ29yaXRobS9tZWRpdW0vIiwiJHVybCI6Imh0dHA6Ly8xOTIuMTY4LjQuMTk4L2NvbXB1dGVyL2FsZ29yaXRobS9tZWRpdW0vc3RyaW5nLmh0bWwiLCIkdXJsX3BhdGgiOiIvY29tcHV0ZXIvYWxnb3JpdGhtL21lZGl1bS9zdHJpbmcuaHRtbCIsIiR0aXRsZSI6Iueul%2BazlSDlipvmiaPkuK3nuqcgfCBHYXVzcyBaaG91IiwiJGlzX2ZpcnN0X2RheSI6ZmFsc2UsIiRpc19maXJzdF90aW1lIjpmYWxzZSwiJHJlZmVycmVyX2hvc3QiOiIxOTIuMTY4LjQuMTk4In0sImFub255bW91c19pZCI6IjE5MmY3ZDM5ZGQ4ZjBjLTBhYjc5NmVlNWYxODgzLTI2MDExOTUxLTE0NDAwMDAtMTkyZjdkMzlkZGFmYjUiLCJ0eXBlIjoidHJhY2siLCJldmVudCI6IiRwYWdldmlldyIsInRpbWUiOjE3MzMwNDE4OTkyNTAsIl90cmFja19pZCI6NTgzOTI5MjUxLCJfZmx1c2hfdGltZSI6MTczMzA0MTg5OTI1MX0%3D&ext=crc%3D1575620168'
  });
  const time = result.latency.average;
  const qps = result.requests.average
  const total = result.requests.total;
  console.log(`Trace\t qps: ${qps} time(ms): ${time} total: ${total}`);
}

async function testPageView() {
  const result = await autocannon({
    url: "http://localhost:3000/pvuv",
    connections: 10, //default 10
    pipelining: 1, // default 1
    duration: 10, // default 10
  });
  const time = result.latency.average;
  const qps = result.requests.average
  const total = result.requests.total;
  console.log(`Pageview qps: ${qps} time(ms): ${time} total: ${total}`);
}


async function testTop10() {
  const result = await autocannon({
    url: "http://localhost:3000/top10",
    connections: 10, //default 10
    pipelining: 1, // default 1
    duration: 10, // default 10
  });
  const time = result.latency.average;
  const qps = result.requests.average
  const total = result.requests.total;
  console.log(`Top10\t qps: ${qps} time(ms): ${time} total: ${total}`);
}

async function test() {
  await testTrace();
  await testPageView();
  await testTop10();
}

test();
