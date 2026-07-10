import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminTokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    if(!apiKey){
      throw new NotFoundException("Api key is required")
    }
    if(apiKey !== process.env.ADMIN_API_KEY){
      throw new UnauthorizedException("Invalid api key")
    }
    return true;
  }
}
