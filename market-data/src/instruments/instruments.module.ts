import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Instrument } from './entities/instrument.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Instrument]),
  ],
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
})
export class InstrumentsModule {}
