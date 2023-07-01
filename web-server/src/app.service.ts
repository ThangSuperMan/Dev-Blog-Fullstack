import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getHello() {
    // const ttl = 10;
    // await this.cacheManager.set('cached_item', { key: 32 }, ttl);
    // await this.cacheManager.del('cached_item');
    // const cachedItem = await this.cacheManager.get('cached_item');
    // console.log('cachedItem :>> ', cachedItem);
    await this.cacheManager.set('myname', 'Thang Cute');
    const cachedItem = await this.cacheManager.get('myname');
    console.log('cached_item :>> ', cachedItem);
    return 'Hello World!'.repeat(1000);
  }
}
