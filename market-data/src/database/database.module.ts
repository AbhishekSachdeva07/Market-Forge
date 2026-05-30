import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RedisModule } from './redis/redis.module';

@Module({
    providers: [DatabaseService],
    imports: [RedisModule],
})
export class DatabaseModule {}
