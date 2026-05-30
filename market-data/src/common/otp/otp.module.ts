import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    NotificationModule,
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
