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

readInterface.on('close',() => {
  process.exit()
})
