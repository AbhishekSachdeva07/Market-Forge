import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtTokenService } from './jwt-token.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtTokenService: JwtTokenService,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException(
        'Authorization header missing',
      );
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'Token missing',
      );
    }
    try {
      const payload =
        await this.jwtTokenService.validateToken(
          token,
        );

      request.user = payload;

      return true;
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }

  }
}
