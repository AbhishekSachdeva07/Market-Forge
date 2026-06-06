import { Module } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';

@Module({
    imports: [
        JwtModule.register({
            secret : process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as any },
        })
    ],
    exports: [JwtTokenService, JwtGuard],
    providers: [JwtTokenService, JwtGuard],
})
export class JwtTokenModule {}
