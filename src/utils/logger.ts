import winston from 'winston';

// 定义不同日志级别的文件路径
const logLevels = {
    debug: 'access.log' // 新增 access 日志
};

// 为每个日志级别创建对应的文件传输
const transports = Object.entries(logLevels).map(([level, filename]) => {
    return new winston.transports.File({
        level: level,
        filename: `logs/${filename}`,
        format: winston.format.simple()
    });
});

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: transports
});

export default logger;