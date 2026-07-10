import { Module } from '@nestjs/common';
import { AdminTokenGuard } from './admin-token.guard';

@Module({
    providers: [AdminTokenGuard],
    exports: [AdminTokenGuard]
})
export class AdminTokenModule {}
