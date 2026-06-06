import { Module } from '@nestjs/common';
import { AdminJwtService } from './admin-jwt.service';
import { JwtTokenModule } from '../jwt/jwt-token.module';

@Module({
  providers: [AdminJwtService],
  imports: [JwtTokenModule],
})
export class AdminJwtModule {}
