import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { JwtTokenService } from 'src/guard/jwt/jwt-token.service';
import { JwtTokenModule } from 'src/guard/jwt/jwt-token.module';
import { JwtGuard } from 'src/guard/jwt/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from './entity/api-key.entity';
import { User } from 'src/users/entity/user.entity';
import { RedisModule } from 'src/database/redis/redis.module';

@Module({
  imports: [JwtTokenModule,RedisModule , TypeOrmModule.forFeature([
    ApiKey, User
  ])],
  providers: [ApiKeysService],
  controllers: [ApiKeysController],
  exports: [ApiKeysService]
})
export class ApiKeysModule {}
