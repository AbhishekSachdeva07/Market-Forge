import { Controller, Get, Post, Body, Patch, Param, Delete, Version } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}
  @Get()
  @Version('1')
  findAll() {
    return this.instrumentsService.findAll();
  }
}
