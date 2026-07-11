import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as zlib from 'zlib';
import { InjestService } from 'src/injest/injest.service';
import dayjs from 'dayjs';
import AdmZip from 'adm-zip';
import { Readable } from 'stream';
import csv from 'csv-parser';

@Injectable()
export class SchedulerService {

    constructor(
        private readonly injestService: InjestService,
    ){}

    @Cron("0 0 7 * * *")
    // @Cron(CronExpression.EVERY_MINUTE)
    async executeInjestData(){
        const NSEFile = await axios.get(`${process.env.NSE_URL}`,{
          responseType: 'arraybuffer',
        },);
        const decompressed = zlib.gunzipSync(
            NSEFile.data,
        );

        const jsonString = decompressed.toString('utf-8');

        await this.injestService.filterAndSaveDate(jsonString);
    }

    @Cron('0 0 20 * * 1-5', {
        timeZone: 'Asia/Kolkata',
    })
    async executeDailyCandles(){
        // const date = dayjs().format('YYYYMMDD');
        const date = dayjs().subtract(1, 'day').format('YYYYMMDD');
        const dailyCandle = await axios.get(`${process.env.DAILY_CANDLE_URL_HEAD}${date}${process.env.DAILY_CANDLE_URL_TAIL}`, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://www.nseindia.com/',
            },
        });
        
        const zip = new AdmZip(dailyCandle.data);
        

        // Get first file (CSV)
        const csvFile = zip.getEntries()[0];

        // CSV as string
        const csvString = csvFile.getData().toString('utf8');

        const rows: any[] = [];

        await new Promise<void>((resolve, reject) => {
            Readable.from(csvString)
                .pipe(csv())
                .on('data', (row) => rows.push(row))
                .on('end', resolve)
                .on('error', reject);
        });

        await this.injestService.filterAndSaveDataToHistoricalTable(rows);
    }
}

