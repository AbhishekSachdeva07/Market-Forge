import { Injectable } from '@nestjs/common';
import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
    constructor(private readonly dataSource : DataSource){}
    async onModuleInit() {
        if(this.dataSource.isInitialized){
            console.log("Database connected successfully.")
        }
        else{
            console.log("Database connection failed.")
        }
    }
}
