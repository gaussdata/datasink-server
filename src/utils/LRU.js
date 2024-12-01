export default class LRU {
  constructor(max = 10, ttl = 10 * 1000) {
    // 默认 TTL 设置为 10 * 1000 毫秒（即 10 秒钟）
    this.max = max;
    this.ttl = ttl;
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (item !== undefined) {
      const { value, timestamp } = item;
      // 检查是否过期
      if (Date.now() - timestamp < this.ttl) {
        // 刷新缓存项，如果没有过期
        this.cache.delete(key);
        this.cache.set(key, { value, timestamp });
        return value;
      } else {
        // 如果过期，删除该项
        this.cache.delete(key);
      }
    }
    return undefined; // 如果没有找到有效的项，返回 undefined
  }

  set(key, val) {
    // 如果缓存中已存在，删除旧项
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size === this.max) {
      // 如果达到最大容量，则逐出某个项
      this.evict();
    }
    // 将项和当前时间戳一起存储
    this.cache.set(key, { value: val, timestamp: Date.now() });
  }

  evict() {
    const key = this.first();
    this.cache.delete(key);
  }

  first() {
    return this.cache.keys().next().value;
  }
}