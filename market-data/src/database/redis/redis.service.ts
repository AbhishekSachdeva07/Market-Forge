import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis/built/Redis';

@Injectable()
export class RedisService implements OnModuleInit {
    private redis: Redis;

    constructor(){
        console.log('RedisService Instance Created');
        this.redis =  new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT!),
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            tls: {
                rejectUnauthorized: false,
            },
        })

        this.redis.on('error', (err)=>{
            console.error('Redis connection error:', err);
        })

        this.redis.on('connect', ()=>{
            console.log('Connected to Redis successfully.');
        })

    }

    async onModuleInit() {
        await this.redis.ping();
        console.log("Connected to Redis successfully.");
    }

    getClient() {
        return this.redis;
    }
}
