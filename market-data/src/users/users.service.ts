import { Injectable } from '@nestjs/common';
import { UserOtpDto } from './dto/user-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { OtpService } from 'src/common/otp/otp.service';
import { RedisService } from 'src/database/redis/redis.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        private readonly otpService : OtpService,
        private readonly redisService: RedisService
    ){}
    async handleLoginSignupOtp(userOtpDto: UserOtpDto) {
        // email already validated now check if present in db
        const { email } = userOtpDto;
        const user = await this.userRepository.findOne({ where: { email } });
        const otp = await this.otpService.generateOtp(email);
        await this.redisService.getClient().set(`otp:${email}`, otp, 'EX', 300);
        if(user){
            return { message: 'OTP sent to email for login', type: 'login', email };
        }
        else{
            return { message: 'OTP sent to email for signup', type: 'signup', email };
        }
    }

    async verifyOtp(userOtpDto: UserOtpDto) {
        const { email, type } = userOtpDto;
        const cachedOtp = await this.redisService.getClient().get(`otp:${email}`);
        if(cachedOtp === null){
            return { message: 'OTP expired or not found', success: false };
        }
        if(cachedOtp === userOtpDto.otp){
            await this.redisService.getClient().del(`otp:${email}`);
            return { message: 'OTP verification successful', success: true, type, email };
        }
        return { message: 'OTP verification failed', success: false, type, email };
    }

    async create(createUserDto: UserDto) {
        const user = this.userRepository.create(createUserDto);
        return this.userRepository.save(user);
    }
}
