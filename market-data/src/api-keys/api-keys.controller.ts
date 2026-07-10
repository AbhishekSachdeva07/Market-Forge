import { Controller, Get, UseGuards, Version } from '@nestjs/common';
import { User } from 'src/decorator/user/user-decorator/user.decorator';
import { JwtGuard } from 'src/guard/jwt/jwt.guard';

@Controller('api-keys')
export class ApiKeysController {
    @Get()
    @Version('1')
    @UseGuards(JwtGuard)
    async getApiKeys(@User() user:any){
        return user;
    }
}
