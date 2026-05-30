import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { NotificationType } from './notification.enum';

@Injectable()
export class NotificationService {
    private transporter = nodemailer.createTransport({
        host : process.env.EMAIL_HOST,
        port : Number(process.env.EMAIL_PORT),
        secure : true,
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASSWORD,
        },
    });

    async sendMail(payload: string, title: string, type: NotificationType, to: string) {
        try {
            const html = this.buildTemplate(type, title, payload);
            await this.transporter.sendMail({
                from : process.env.EMAIL_USER,
                to,
                subject : title,
                html,
            });
            console.log('Notification email sent successfully.');
        } catch (error) {
            console.error('Error sending notification email:', error);
        }
    }

    private buildTemplate(
        type: NotificationType,
        title: string,
        payload: any,
    ): string {

        switch (type) {
            case NotificationType.ISIN_SERIES_CONFLICT:
                return `
                <div style="font-family:Arial">
                    <h2 style="color:#dc2626">
                        🚨 ISIN Series Conflict Detected
                    </h2>

                    <table border="1"
                        cellpadding="8"
                        cellspacing="0"
                        style="border-collapse:collapse">

                        <tr style="background:#fee2e2">
                            <th>ISIN</th>
                            <th>Symbol</th>
                            <th>Old Series</th>
                            <th>New Series</th>
                        </tr>

                        ${payload
                            .map(
                                (x) => `
                                <tr>
                                    <td>${x.isin}</td>
                                    <td>${x.symbol}</td>
                                    <td>${x.oldSeries}</td>
                                    <td style="color:red;font-weight:bold">
                                        ${x.newSeries}
                                    </td>
                                </tr>
                            `,
                            )
                            .join('')}
                    </table>
                </div>
                `;
            case NotificationType.OTP:
            return `
            <div style="font-family:Arial,sans-serif;padding:20px">
                <h2 style="color:#2563eb">
                    Verify Your Email
                </h2>

                <p>Your one-time password (OTP) is:</p>

                <div
                    style="
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        padding:20px;
                        background:#f3f4f6;
                        text-align:center;
                        border-radius:8px;
                        margin:20px 0;
                    "
                >
                    ${payload}
                </div>

                <p>This OTP will expire in 10 minutes.</p>

                <p>If you did not request this code, you can safely ignore this email.</p>
            </div>
            `;
            default:
                return `<h3>${title}</h3>`;
        }
    }
}
