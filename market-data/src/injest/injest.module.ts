import { Module } from '@nestjs/common';
import { InjestService } from './injest.service';

@Module({
  providers: [InjestService]
})
export class InjestModule {}
