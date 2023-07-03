import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getHello() {
    await this.cacheManager.set('myname', 'Thang Cute');
    const cachedItem = await this.cacheManager.get('myname');
    console.log('cached_item :>> ', cachedItem);
    return 'Hello World!';
  }
}
