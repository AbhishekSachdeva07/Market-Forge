import { Module } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { InstrumentsController } from './instruments.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Instrument } from './entities/instrument.entity';
import { RedisModule } from 'src/database/redis/redis.module';
import { ApiKeysModule } from 'src/api-keys/api-keys.module';
import { TokenModule } from 'src/guard/token/token.module';
import { ApiKey } from 'src/api-keys/entity/api-key.entity';

@Module({
   imports: [
    TypeOrmModule.forFeature([Instrument, ApiKey]),
    RedisModule,
    TokenModule
  ],
  controllers: [InstrumentsController],
  providers: [InstrumentsService],
})
export class InstrumentsModule {}
