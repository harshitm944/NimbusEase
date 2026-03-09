import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisMockService {
  private readonly logger = new Logger(RedisMockService.name);
  private storage: Map<string, any[]> = new Map();

  async lpush(key: string, value: string): Promise<number> {
    if (!this.storage.has(key)) {
      this.storage.set(key, []);
    }
    const list = this.storage.get(key);
    // Parse the value before storing if it's JSON, because the guard expects objects back from lrange
    let parsedValue;
    try {
      parsedValue = JSON.parse(value);
    } catch (e) {
      parsedValue = value;
    }
    list.unshift(parsedValue);
    return list.length;
  }

  async ltrim(key: string, start: number, stop: number): Promise<string> {
    if (!this.storage.has(key)) return 'OK';
    const list = this.storage.get(key);
    
    // Redis ltrim handles negative indices, but for our mock we'll keep it simple
    // or implement basic positive range. Guard uses (0, 49)
    const newList = list.slice(start, stop + 1);
    this.storage.set(key, newList);
    return 'OK';
  }

  async lrange(key: string, start: number, stop: number): Promise<any[]> {
    if (!this.storage.has(key)) return [];
    const list = this.storage.get(key);
    
    // Redis stop is inclusive. -1 means end of list.
    const actualStop = stop === -1 ? list.length : stop + 1;
    return list.slice(start, actualStop);
  }

  async del(key: string): Promise<number> {
    const deleted = this.storage.delete(key);
    return deleted ? 1 : 0;
  }
}
