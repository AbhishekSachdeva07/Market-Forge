import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DatabaseModule } from './database/database.module';
import { InjestModule } from './injest/injest.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { Instrument } from './instruments/entities/instrument.entity';
import { NotificationModule } from './notification/notification.module';
import { UsersModule } from './users/users.module';
import { OtpModule } from './common/otp/otp.module';
import { JwtService } from './guard/jwt/jwt-token.service';
import { JwtTokenModule } from './guard/jwt/jwt-token.module';
import { AdminJwtModule } from './guard/admin-jwt/admin-jwt.module';
import { AdminTokenModule } from './guard/admin-token/admin-token.module';
import { TokenModule } from './guard/token/token.module';
import { ApiKeysModule } from './api-keys/api-keys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    SchedulerModule,

    TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    autoLoadEntities: true,
    synchronize: false,
  }),
    DatabaseModule,
    InjestModule,
    InstrumentsModule,
    NotificationModule,
    UsersModule,
    OtpModule,
    JwtTokenModule,
    AdminJwtModule,
    AdminTokenModule,
    TokenModule,
    ApiKeysModule,
  ],


  controllers: [AppController],
  providers: [AppService, JwtService],
})
export class AppModule {}
