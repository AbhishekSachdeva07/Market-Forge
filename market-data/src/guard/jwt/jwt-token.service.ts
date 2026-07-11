import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserType } from 'src/users/enums/user.type';

@Injectable()
export class JwtTokenService {
    constructor(
        private readonly jwtService: JwtService,
    ) {}

    async generateToken(payload: any): Promise<string> {
        const payLoad = {
            email : payload.email,
            role : payload.role
        }
        return await this.jwtService.signAsync(payLoad);
    }

    async validateToken(token: string): Promise<any> {
        return await this.jwtService.verifyAsync(token);
    }

    async asyncdecodeToken(token: string) {
        return await this.jwtService.decode(token);
    }

    async generateAdminToken(payload: any, type: string): Promise<String> {
        return await this.generateToken({
            email: payload?.email,
            role: type
        })
    }
}
