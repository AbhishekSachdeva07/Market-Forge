import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { Instrument } from './entities/instrument.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from 'src/database/redis/redis.service';
import { untilNext7 } from 'src/utils/timeUtils';

@Injectable()
export class InstrumentsService {

  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>,
    private readonly redisService: RedisService
  ){
  }

  async findAll() {
    const cached = await this.redisService.getClient().get('instruments:latest');
    if(cached){
      console.log('Cache hit for instruments');
      return JSON.parse(cached);
    }
    const instruments = await this.instrumentRepository.find();
    await this.redisService.getClient().set('instruments:latest', JSON.stringify(instruments), 'EX', untilNext7());
    return instruments;
  }

  async find(tradingSymbol: string): Promise<Instrument> {
    const cachedKey = `TRADINGSYMBOL:${tradingSymbol}`;
    const cached = await this.redisService.getClient().get(cachedKey);
    if(cached){
      console.log(`Cache hit for instruments ${tradingSymbol}`);
      return JSON.parse(cached);
    }
    const instrument = await this.instrumentRepository.findOne({
      where: {
        tradingSymbol
      }
    })
    if(instrument){
      await this.redisService.getClient().set(`TRADINGSYMBOL:${tradingSymbol}`, JSON.stringify(instrument), 'EX', untilNext7());
      return instrument;
    }
    throw new NotFoundException("Trading Symbol Not Found");
  }
}
