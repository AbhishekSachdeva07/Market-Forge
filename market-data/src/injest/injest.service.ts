import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as zlib from 'zlib';

@Injectable()
export class InjestService implements OnModuleInit {

    async onModuleInit(){
        const file = fs.readFileSync(
            'C:/Users/Abhishek/Downloads/NSE.json',
            'utf-8'
        );
        this.filterAndSaveDate(file);
    }

    filterAndSaveDate(data: any){
        const rawData = JSON.parse(data);
        const filteredData = rawData.filter(item => item?.segment === "NSE_EQ");
        console.log(filteredData.length);
    }
}
