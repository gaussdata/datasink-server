export class Cache {
  max = 10;
  ttl = 60 * 1000; // 默认 TTL 设置为 60 * 1000 毫秒（即 60 秒钟）
  cache: Map<string, { value: any, timestamp: number, ttl: number }> = new Map();

  constructor(max = 10, ttl = 60 * 1000) {
    this.max = max;
    this.ttl = ttl;
    this.cache = new Map();
  }

  get(key:string) {
    const item = this.cache.get(key);
    if (item !== undefined) {
      const { value, timestamp, ttl } = item;
      // 检查是否过期
      if (Date.now() - timestamp < ttl) {
        // 刷新缓存项，如果没有过期
        this.cache.delete(key);
        this.cache.set(key, { value, timestamp, ttl });
        return value;
      } else {
        // 如果过期，删除该项
        this.cache.delete(key);
      }
    }
    return undefined; // 如果没有找到有效的项，返回 undefined
  }

  set(key:string, val: any, ttl = this.ttl) {
    // 如果缓存中已存在，删除旧项
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size === this.max) {
      // 如果达到最大容量，则逐出某个项
      this.evict();
    }
    // 将项和当前时间戳一起存储
    this.cache.set(key, { value: val, timestamp: Date.now(), ttl: ttl});
  }

  evict() {
    const key = this.first();
    if (key) {
      this.cache.delete(key);
    }
  }

  first() {
    return this.cache.keys().next().value;
  }

  delete(key:string) {
    this.cache.delete(key);
  }
}