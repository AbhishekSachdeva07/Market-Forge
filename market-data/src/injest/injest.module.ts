import { Module } from '@nestjs/common';
import { InjestService } from './injest.service';
import { Instrument } from 'src/instruments/entities/instrument.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instrument]),
    NotificationModule,
  ],
  providers: [InjestService],
  exports : [InjestService]
})
export class InjestModule {}
