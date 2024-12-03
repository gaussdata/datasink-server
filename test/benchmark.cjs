"use strict";

const autocannon = require("autocannon");

async function testTrace() {
  const result = await autocannon({
    url: "http://localhost:3000/t",
    connections: 10, //default
    pipelining: 1, // default
    duration: 10, // default
    amount: 500 * 1000,
    method: 'POST',
    headers: {
      'content-type': 'text/plain',
    },
    body: 'data=eyJpZGVudGl0aWVzIjp7IiRpZGVudGl0eV9jb29raWVfaWQiOiIxOTJmN2QzOWRkOGYwYy0wYWI3OTZlZTVmMTg4My0yNjAxMTk1MS0xNDQwMDAwLTE5MmY3ZDM5ZGRhZmI1IiwiJGlkZW50aXR5X2Fub255bW91c19pZCI6IjE5MmY3ZDM5ZGQ4ZjBjLTBhYjc5NmVlNWYxODgzLTI2MDExOTUxLTE0NDAwMDAtMTkyZjdkMzlkZGFmYjUifSwiZGlzdGluY3RfaWQiOiIxOTJmN2QzOWRkOGYwYy0wYWI3OTZlZTVmMTg4My0yNjAxMTk1MS0xNDQwMDAwLTE5MmY3ZDM5ZGRhZmI1IiwibGliIjp7IiRsaWIiOiJqcyIsIiRsaWJfbWV0aG9kIjoiY29kZSIsIiRsaWJfdmVyc2lvbiI6IjEuMjYuMTgifSwicHJvcGVydGllcyI6eyIkdGltZXpvbmVfb2Zmc2V0IjotNDgwLCIkc2NyZWVuX2hlaWdodCI6MTA4MCwiJHNjcmVlbl93aWR0aCI6MTkyMCwiJHZpZXdwb3J0X2hlaWdodCI6OTI5LCIkdmlld3BvcnRfd2lkdGgiOjEwMTYsIiRsaWIiOiJqcyIsIiRsaWJfdmVyc2lvbiI6IjEuMjYuMTgiLCIkbGF0ZXN0X3RyYWZmaWNfc291cmNlX3R5cGUiOiJ1cmznmoRkb21haW7op6PmnpDlpLHotKUiLCIkbGF0ZXN0X3NlYXJjaF9rZXl3b3JkIjoidXJs55qEZG9tYWlu6Kej5p6Q5aSx6LSlIiwiJGxhdGVzdF9yZWZlcnJlciI6InVybOeahGRvbWFpbuino%2BaekOWksei0pSIsIiRyZWZlcnJlciI6IiIsIiR1cmwiOiJodHRwOi8vMTkyLjE2OC40LjE5OC8iLCIkdXJsX3BhdGgiOiIvIiwiJHRpdGxlIjoiR2F1c3MgWmhvdSIsIiRpc19maXJzdF9kYXkiOmZhbHNlLCIkaXNfZmlyc3RfdGltZSI6ZmFsc2UsIiRyZWZlcnJlcl9ob3N0IjoiIn0sImFub255bW91c19pZCI6IjE5MmY3ZDM5ZGQ4ZjBjLTBhYjc5NmVlNWYxODgzLTI2MDExOTUxLTE0NDAwMDAtMTkyZjdkMzlkZGFmYjUiLCJ0eXBlIjoidHJhY2siLCJldmVudCI6IiRwYWdldmlldyIsInRpbWUiOjE3MzMyMzU1NjUxMjksIl90cmFja19pZCI6ODU1MTI1MTI5LCJfZmx1c2hfdGltZSI6MTczMzIzNTU2NTEyOX0%3D&ext=crc%3D1557374731'
  });
  console.log(result.requests.average);
}

async function test() {
  await testTrace();
}

test();
