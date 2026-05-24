import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { InjestService } from 'src/injest/injest.service';
import { InjestModule } from 'src/injest/injest.module';

@Module({
  providers: [SchedulerService],
  imports: [InjestModule],
})
export class SchedulerModule {}
