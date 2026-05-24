import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Instrument } from 'src/instruments/entities/instrument.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InjestService{

    constructor(
        @InjectRepository(Instrument)
        private readonly instrumentRepository : Repository<Instrument>,
    ){}

    async filterAndSaveDate(data: any){
        const rawData = JSON.parse(data);
        const filteredData = rawData.filter(item => item?.segment === "NSE_EQ");
        console.log(filteredData.length);
        const formattedData = filteredData.map((item) => ({
            instrumentKey: item.instrument_key,
            exchangeToken: item.exchange_token,
            segment: item.segment,
            exchange: item.exchange,
            isin: item.isin,
            tradingSymbol: item.trading_symbol,
            name: item.name,
            instrumentType: item.instrument_type,
            securityType: item.security_type,
            lotSize: item.lot_size,
            freezeQuantity: item.freeze_quantity,
            tickSize: item.tick_size,
            qtyMultiplier: item.qty_multiplier,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const batchSize = Number(process.env.UPSERT_BATCH_SIZE);

        for( let i = 0; i<formattedData.length; i+=batchSize){
            const batch = formattedData.slice(i, i+batchSize);
            await this.instrumentRepository.upsert(batch, ['instrumentKey']);
        }        
        console.log('Data Inserted/Updated Successfully');
    }
}
