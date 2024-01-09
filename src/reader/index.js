import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import eventModel  from '../model/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const filepath = path.resolve(__dirname, '../../logs-merge/index.log');

const readInterface = readline.createInterface({
  input: fs.createReadStream(filepath),
  output: false,
  console: false
});

function getJsonSafe(json, fallback){
  try {
    return JSON.parse(json)
  } catch (error) {
    return fallback
  }
}

readInterface.on('line', function(line) {
  const json = line.replace('info:', '');
  const jsonObject = getJsonSafe(json, {
    identities: {},
    properties: {},
    lib: {},
  })
  try {
    const row = createRow(jsonObject);
    // 插入数据库
    eventModel.addEvent(row)  
  } catch (error) {
    console.log(jsonObject)
  }
});

function createRow(vo){
  const row = {
    event_id: vo.event,
    event_time: vo.time,
    // 
    aa_id: vo.anonymous_id,
    cookie_id: vo.identities?.$identity_cookie_id,
    device_id: vo.distinct_id,
    // 
    lib: vo.lib?.$lib,
    lib_method: vo.lib?.$lib_method,
    lib_version: vo.lib?.$lib_version,
    // 
    is_first_day: vo.properties.$is_first_day ? 1 : 0,
    latest_referrer: vo.properties.$latest_referrer,
    // 
    url: vo.properties.$url,
    url_path: vo.properties.$url_path,
    title: vo.properties.$title,
    // 
    screen_width: vo.properties.$screen_width,
    screen_height: vo.properties.$screen_height,
    viewport_width: vo.properties.$viewport_width,
    viewport_height: vo.properties.$viewport_height
  }
  return row
}