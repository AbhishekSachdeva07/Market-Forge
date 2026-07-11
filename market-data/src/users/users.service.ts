import { BadRequestException, Injectable } from '@nestjs/common';
import { UserOtpDto } from './dto/user-otp.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { OtpService } from 'src/common/otp/otp.service';
import { RedisService } from 'src/database/redis/redis.service';
import { UserDto } from './dto/user.dto';
import { JwtTokenService } from 'src/guard/jwt/jwt-token.service';
import { UserType } from './enums/user.type';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository : Repository<User>,
        private readonly otpService : OtpService,
        private readonly redisService: RedisService,
        private readonly jwtTokenService: JwtTokenService
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
            //generate a token based on usertype
            if(type === 'login'){
                const userRedisKey = `USER:${userOtpDto?.email}`;
                const cachedUser= await this.redisService.getClient().get(userRedisKey);
                let user: User | null = null;
                if (cachedUser) {
                    user = JSON.parse(cachedUser);
                } else {
                    user = await this.userRepository.findOne({
                        where: {
                        email,
                        },
                    });
                }
                if(user){
                    if(!cachedUser){
                        await this.redisService.getClient().set(userRedisKey, JSON.stringify(user), 'EX', 2592000); //30days
                    }
                    const jwt = await this.jwtTokenService.generateToken({
                        email,
                        role: user?.userType
                    })
                    return { message: 'OTP verification successful', success: true, type, email, name: user?.name, jwtToken:  jwt};
                }
            }
            else{
                return { message: 'OTP verification successful', success: true, type, email, jwtToken:  null};
            }
        }
        return { message: 'OTP verification failed', success: false, type, email };
    }

    async create(createUserDto: UserDto) {
        if(!createUserDto){
            throw new BadRequestException("Insufficent Details provided.");
        }
        const userExist = await this.userRepository.findOne({
            where: {
                email: createUserDto?.email
            }
        });
        if(userExist){
            throw new BadRequestException("User Already Exists");
        }
        const userRedisKey = `USER:${createUserDto?.email}`;
        const user = await this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);
        const jwt = await this.jwtTokenService.generateToken({
            email: createUserDto?.email ,
            role: UserType.STUDENT
        })
        await this.redisService.getClient().set(userRedisKey, JSON.stringify(savedUser), 'EX', 2592000); //30days
        return {
            savedUser,
            jwt
        };
    }
}
