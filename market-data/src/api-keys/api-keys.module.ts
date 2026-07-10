import { Module } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';
import { JwtTokenService } from 'src/guard/jwt/jwt-token.service';
import { JwtTokenModule } from 'src/guard/jwt/jwt-token.module';
import { JwtGuard } from 'src/guard/jwt/jwt.guard';

@Module({
  imports: [JwtTokenModule],
  providers: [ApiKeysService],
  controllers: [ApiKeysController]
})
export class ApiKeysModule {}
