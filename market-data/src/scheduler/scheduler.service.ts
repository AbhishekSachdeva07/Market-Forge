import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as zlib from 'zlib';
import { InjestService } from 'src/injest/injest.service';

@Injectable()
export class SchedulerService {

    constructor(
        private readonly injestService: InjestService,
    ){}

    @Cron(CronExpression.EVERY_10_SECONDS)
    executeCron(){
        console.log(`Running at time ${new Date().toISOString()}`);
    }

    @Cron("0 0 7 * * *")
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
}
