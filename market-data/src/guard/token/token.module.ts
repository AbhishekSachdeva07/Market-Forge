import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKey } from 'src/api-keys/entity/api-key.entity';
import { ApiKeysService } from 'src/api-keys/api-keys.service';
import { TokenGuard } from './token.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ApiKey])
  ],
  providers: [TokenGuard],
  exports: [TokenGuard]
})
export class TokenModule {}
