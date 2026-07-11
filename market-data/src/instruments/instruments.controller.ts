import { Controller, Get, Post, Body, Patch, Param, Delete, Version, UseGuards } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import { CreateInstrumentDto } from './dto/create-instrument.dto';
import { UpdateInstrumentDto } from './dto/update-instrument.dto';
import { TokenGuard } from 'src/guard/token/token.guard';
import { AdminTokenGuard } from 'src/guard/admin-token/admin-token.guard';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly instrumentsService: InstrumentsService) {}
  @Get()
  @Version('1')
  @UseGuards(TokenGuard)
  findAll() {
    return this.instrumentsService.findAll();
  }

  @Get(':tradingSymbol')
  @Version('1')
  @UseGuards(TokenGuard)
  find(@Param('tradingSymbol') tradingSymbol: string){
    return this.instrumentsService.find(tradingSymbol);
  }
}
