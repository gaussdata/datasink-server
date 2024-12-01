import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * Stream 合并的递归调用
 * @param { Array } scripts
 * @param { Stream } fileWriteStream
 */
function streamMergeRecursive(scripts = [], fileWriteStream, sourceFileDirectory) {
  // 递归到尾部情况判断
  if (!scripts.length) {
    return fileWriteStream.end(); // 最后关闭可写流，防止内存泄漏
  }

  const currentFile = path.resolve(__dirname, sourceFileDirectory, scripts.shift());
  const currentReadStream = fs.createReadStream(currentFile); // 获取当前的可读流

  currentReadStream.pipe(fileWriteStream, { end: false });
  currentReadStream.on('end', function() {
    streamMergeRecursive(scripts, fileWriteStream, sourceFileDirectory);
  });

  currentReadStream.on('error', function(error) { // 监听错误事件，关闭可写流，防止内存泄漏
    console.error(error);
    fileWriteStream.close();
  });
}
/**
 * Stream 合并
 * @param { String } sourceFileDirectory 源文件目录
 * @param { String } targetFile 目标文件
 */
function streamMerge(sourceFileDirectory, targetFile) {
  const scripts =  fs.readdirSync(path.resolve(__dirname, sourceFileDirectory)); // 获取源文件目录下的所有文件
  const fileWriteStream = fs.createWriteStream(path.resolve(__dirname, targetFile)); // 创建一个可写流

  // fs.readdir 读取出来的结果，根据具体的规则做下排序，防止因为顺序不对导致最终合并之后的文件无效。  
  return streamMergeRecursive(scripts, fileWriteStream, sourceFileDirectory);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
streamMerge(path.resolve(__dirname, '../../logs'), path.resolve(__dirname, '../../logs-merge/index.log'))