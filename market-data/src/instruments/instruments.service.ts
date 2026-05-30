import { Injectable } from '@nestjs/common';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { Instrument } from './entities/instrument.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class InstrumentsService {

  constructor(
    @InjectRepository(Instrument)
    private readonly instrumentRepository: Repository<Instrument>
  ){
  }

  findAll() {
    const instruments = this.instrumentRepository.find();
    return instruments;
  }
}
