import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Observable } from 'rxjs';
import { ApiKey } from 'src/api-keys/entity/api-key.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request =
      context.switchToHttp().getRequest();

    const apiKey =
      request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException(
        'API key missing',
      );
    }

    const validApiKey = await this.apiKeyRepository.findOne({
      where: { apiKey, isActive: true }
    });

    if (!validApiKey) {
      throw new UnauthorizedException(
        'Invalid API key',
      );
    }

    return true;
  }
}
