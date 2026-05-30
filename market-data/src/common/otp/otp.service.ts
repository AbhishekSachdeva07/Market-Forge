import { Injectable } from '@nestjs/common';
import { NotificationType } from 'src/notification/notification.enum';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class OtpService {
    constructor(
        private readonly NotificationService: NotificationService,
    ){}
    async generateOtp(email : string) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.NotificationService.sendMail(otp, 'Your Verification Code', NotificationType.OTP, email);
        return otp;
    }
}
