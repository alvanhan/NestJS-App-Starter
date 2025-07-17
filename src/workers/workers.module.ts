import { Module } from '@nestjs/common';
import { LogConsumerService } from './log-consumer.service';
import { EmailNotificationConsumer } from './email-notification-consumer.service';
import { EmailNotificationModule } from '../modules/email-notification';

@Module({
    imports: [EmailNotificationModule],
    controllers: [LogConsumerService, EmailNotificationConsumer],
    providers: [LogConsumerService],
})
export class WorkersModule {}
