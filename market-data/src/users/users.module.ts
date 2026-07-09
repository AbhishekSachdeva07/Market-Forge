import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { OtpModule } from 'src/common/otp/otp.module';
import { RedisModule } from 'src/database/redis/redis.module';
import { User } from './entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { JwtTokenModule } from 'src/guard/jwt/jwt-token.module';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User]),OtpModule, RedisModule, JwtTokenModule],
  providers: [UsersService],
})
export class UsersModule {}
