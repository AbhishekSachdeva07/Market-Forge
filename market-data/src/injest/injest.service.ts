import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import dayjs from 'dayjs';
import { RedisService } from 'src/database/redis/redis.service';
import { HistoricalCandle } from 'src/instruments/entities/historical.candle.entity';
import { Instrument } from 'src/instruments/entities/instrument.entity';
import { NotificationType } from 'src/notification/notification.enum';
import { NotificationService } from 'src/notification/notification.service';
import { getHistoricalCandles } from 'src/utils/candles';
import { Repository } from 'typeorm';
import { receiveMessageOnPort } from 'worker_threads';

@Injectable()
export class InjestService{

    constructor(
        @InjectRepository(Instrument)
        private readonly instrumentRepository : Repository<Instrument>,
        @InjectRepository(HistoricalCandle)
        private readonly historicalCandle: Repository<HistoricalCandle>,
        private readonly notificationService: NotificationService,
        private readonly redisService : RedisService
    ){}

    async filterAndSaveDate(data: any){
        const rawData = JSON.parse(data);
        const filteredData = rawData.filter(item => item?.segment === "NSE_EQ" && ["EQ", "BE","SM","BZ","ST","BT"].includes(item?.instrument_type));
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
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        }));

        const batchSize = Number(process.env.UPSERT_BATCH_SIZE);

        const currentData = await this.instrumentRepository.find();

        const dataMap = new Map(currentData.map(item => [item.isin, item]));

        const incomingISINs = new Set(formattedData.map((item)=>item.isin));

        const validData:any[] = [];

        for(const record of formattedData){
            const existingRecord = dataMap.get(record.isin);
            if(existingRecord){
                record.createdAt = existingRecord.createdAt;
                record.updatedAt = new Date();
                record.isActive = true;
            }
            validData.push(record);
        }

        for( let i = 0; i<validData.length; i+=batchSize){
            const batch = validData.slice(i, i+batchSize);
            await this.instrumentRepository.upsert(batch, ['isin']);
        }       

        const inactiveISIN = currentData.filter((data) => data.isActive && !incomingISINs.has(data.isin));

        if(inactiveISIN.length > 0){
            await this.instrumentRepository.createQueryBuilder().update().set({
                isActive: false,
                updatedAt: new Date()
            })
            .where("isin IN (:...isins)",{
                isins: inactiveISIN,
            })
            .execute();
        }
        
        await this.redisService.getClient().del('instruments:latest');

        await this.notificationService.sendMail(`Total ${formattedData.length} records processed successfully`, 'Data Ingestion Success', NotificationType.DATA_INGESTION_SUCCESS, process.env.EMAIL_RECEIVER!);
    }

    async filterAndSaveDataToHistoricalTable(data: any){
        const currentInstrumentTableData = await this.instrumentRepository.find({
            where: {
                isActive: true
            }
        });
        const instrumentISINs = new Set(
            currentInstrumentTableData.map((data)=>data.isin)
        );
        const candles: any[] = [];
        for(const row of data){
            if(!instrumentISINs.has(row.ISIN)){
                continue;
            }
            candles.push({
                isin: row.ISIN,
                tradingDate: row.TradDt,
                open: Number(row.OpnPric),
                high: Number(row.HghPric),
                low: Number(row.LwPric),
                close: Number(row.ClsPric),
                volume: Number(row.TtlTradgVol),
            })
        }
        await this.historicalCandle.upsert(
            candles,
            ['isin','tradingDate']
        )

       const csvIsins = new Set(data.map((row) => row.ISIN));

        const dataNotPresent = currentInstrumentTableData.filter(
        (instrument) => !csvIsins.has(instrument.isin),
        );

        if(dataNotPresent.length > 0){
            //fallback
            const date = dayjs().subtract(1, "day").format("YYYY-MM-DD");
            let count = 0;
            for(const rowData of dataNotPresent){
                if(count > 26){
                    await this.notificationService.sendMail(`Total ${candles.length} records processed successfully`, 'Historical Data Ingestion Success', NotificationType.DATA_INGESTION_SUCCESS, process.env.EMAIL_RECEIVER!);
                    return;
                }
                const data = await getHistoricalCandles(rowData.instrumentKey,process.env.ACCESS_TOKEN!,date,date);
                if (!data?.length) {
                    continue;
                }

                const candle = candles[0];

                await this.historicalCandle.upsert(
                    [{
                        isin: rowData.isin,
                        tradingDate: date,
                        open: candle[1],
                        high: candle[2],
                        low: candle[3],
                        close: candle[4],
                        volume: candle[5],
                    }],
                    ['isin', 'tradingDate'],
                );
                count+=1;
            }
        }
        await this.notificationService.sendMail(`Total ${candles.length} records processed successfully`, 'Historical Data Ingestion Success', NotificationType.DATA_INGESTION_SUCCESS, process.env.EMAIL_RECEIVER!);
    }
}
