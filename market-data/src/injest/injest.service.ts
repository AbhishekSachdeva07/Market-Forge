import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { RedisService } from 'src/database/redis/redis.service';
import { Instrument } from 'src/instruments/entities/instrument.entity';
import { NotificationType } from 'src/notification/notification.enum';
import { NotificationService } from 'src/notification/notification.service';
import { Repository } from 'typeorm';
import { receiveMessageOnPort } from 'worker_threads';

@Injectable()
export class InjestService{

    constructor(
        @InjectRepository(Instrument)
        private readonly instrumentRepository : Repository<Instrument>,
        private readonly notificationService: NotificationService,
        private readonly redisService : RedisService
    ){}

    async filterAndSaveDate(data: any){
        const rawData = JSON.parse(data);
        const filteredData = rawData.filter(item => item?.segment === "NSE_EQ" && ["EQ", "BE","SM"].includes(item?.instrument_type));
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

        const currentData = await this.instrumentRepository.find();

        const dataMap = new Map(currentData.map(item => [item.isin, item]));

        const validData:any[] = [];
        const invalidData:any[] = [];

        for(const record of formattedData){
            const existingRecord = dataMap.get(record.isin);
            if(existingRecord){
                record.createdAt = existingRecord.createdAt;
                record.updatedAt = new Date();
                if(existingRecord.instrumentKey === record.instrumentKey && existingRecord.instrumentType !== record.instrumentType){
                    invalidData.push({
                        isin: record.isin,
                        symbol: record.tradingSymbol,
                        oldInstrumentKey: existingRecord.instrumentKey,
                        newInstrumentKey: record.instrumentKey,
                        oldSeries: existingRecord.instrumentType,
                        newSeries: record.instrumentType,
                    });
                    continue;
                }
            }
            validData.push(record);
        }

        for( let i = 0; i<validData.length; i+=batchSize){
            const batch = validData.slice(i, i+batchSize);
            await this.instrumentRepository.upsert(batch, ['instrumentKey']);
        }       
        
        await this.redisService.getClient().del('instruments:latest');
        
        console.log('Data Inserted/Updated Successfully');

        if(invalidData.length > 0){
            await this.notificationService.sendMail(JSON.stringify(invalidData), 'ISIN Series Conflict Detected', NotificationType.ISIN_SERIES_CONFLICT, process.env.EMAIL_RECEIVER!);
        }
        else{
            await this.notificationService.sendMail(`Total ${formattedData.length} records processed successfully`, 'Data Ingestion Success', NotificationType.DATA_INGESTION_SUCCESS, process.env.EMAIL_RECEIVER!);
        }
    }
}
