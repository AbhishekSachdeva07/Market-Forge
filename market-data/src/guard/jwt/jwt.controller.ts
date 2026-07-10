import { Body, Controller, Post, UseGuards, Version } from '@nestjs/common';
import { AdminTokenGuard } from '../admin-token/admin-token.guard';
import { JwtTokenService } from './jwt-token.service';
import { UserOtpDto } from 'src/users/dto/user-otp.dto';
import { UserType } from 'src/users/enums/user.type';

@Controller('jwt')
export class JwtController {
    constructor(
        private readonly jwtTokenService: JwtTokenService,
    ){}


    @Post('create')
    @UseGuards(AdminTokenGuard)
    @Version('1')
    async create(@Body() user: UserOtpDto){
        return await this.jwtTokenService.generateAdminToken(user);
    }
}
