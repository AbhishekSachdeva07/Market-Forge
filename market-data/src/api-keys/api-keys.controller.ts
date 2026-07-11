import { Controller, Get, Post, UseGuards, Version } from '@nestjs/common';
import { User } from 'src/decorator/user/user-decorator/user.decorator';
import { JwtGuard } from 'src/guard/jwt/jwt.guard';
import { ApiKeysService } from './api-keys.service';

@Controller('api-keys')
export class ApiKeysController {
    constructor(
        private readonly apiKeyService: ApiKeysService
    ){}


    @Post()
    @Version('1')
    @UseGuards(JwtGuard)
    async createApiKeys(@User() user:any){
        return await this.apiKeyService.create(user);
    }

    @Get()
    @Version('1')
    @UseGuards(JwtGuard)
    async getApiKey(@User() user:any){
        return this.apiKeyService.getApiKey(user);
    }
}
