import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Instrument } from './entities/instrument.entity';
import { RedisModule } from 'src/database/redis/redis.module';

@Module({
   imports: [
    TypeOrmModule.forFeature([Instrument]),
    RedisModule,
  ],
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
})
export class InstrumentsModule {}
