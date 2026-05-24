import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
    @Cron(CronExpression.EVERY_10_SECONDS)
    executeCron(){
        console.log(`Running at time ${new Date().toISOString()}`);
    }
}
