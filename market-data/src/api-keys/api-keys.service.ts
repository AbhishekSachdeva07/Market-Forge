import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiKey } from './entity/api-key.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entity/user.entity';
import dayjs, { Dayjs } from 'dayjs';
import crypto from 'crypto';
import { UserType } from 'src/users/enums/user.type';
import { RedisService } from 'src/database/redis/redis.service';

@Injectable()
export class ApiKeysService {
    constructor(
        @InjectRepository(ApiKey)
        private readonly apiKeyRepo: Repository<ApiKey>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly redisService: RedisService
    ){}

    async create(user: any){
        const userData = await this.userRepository.findOne({
            where: {
                email: user?.email
            }
        });
        if(!userData){
            throw new BadRequestException("User Not Found")
        }

        if(userData?.userType === UserType.STUDENT){
            const userApiKey = await this.apiKeyRepo.find({
                where: {
                    userId: userData?.id
                }
            })
            if(userApiKey.length>0){
                throw new BadRequestException("Max Limit Reached")
            }
        }

        const apiKey = new ApiKey();
        apiKey.userId = userData?.id;
        apiKey.apiKey = crypto.randomBytes(32).toString('hex');;
        apiKey.expiresAt = dayjs().add(1,'year').toDate();
        apiKey.isActive = true;

        try{
            await this.apiKeyRepo.save(apiKey);
        }
        catch(e){
            try{
                apiKey.apiKey = crypto.randomBytes(32).toString('hex');
                await this.apiKeyRepo.save(apiKey);
            }
            catch(e){
                throw new InternalServerErrorException("Something went wrong")
            }
        }

        return {
            apiKey: apiKey,
            success: true
        };
    }

    async getApiKey(user: any){
        const redisKey = `APIKEY:${user?.email}:${user?.role}`;
        const isAvailableInRedis = await this.redisService.getClient().get(redisKey);
        if(isAvailableInRedis){
            return {
                apiKey: JSON.parse(isAvailableInRedis),
                success: true
            }
        }
        const userRedisKey = `USER:${user?.email}`;
        const cachedUser = await this.redisService.getClient().get(userRedisKey);
        let userData: User|null;
        if(cachedUser){
            userData = JSON.parse(cachedUser);
        }
        else{
            userData = await this.userRepository.findOne({
                where: {
                    email: user?.email
                }
            });
        }
        if(!userData){
            throw new BadRequestException("User Not Found")
        }
        const apiKey = await this.apiKeyRepo.findOne({
            where: {
                userId: userData?.id
            }
        });
        if(!apiKey){
            throw new BadRequestException("No Api Key found for this user");
        }
        await this.redisService.getClient().set(redisKey, JSON.stringify(apiKey), 'EX', 86400); //1day
        return {
            apiKey,
            success: true
        }
    }
}
