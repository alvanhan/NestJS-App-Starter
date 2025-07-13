import { Module } from '@nestjs/common';
import { LogConsumerService } from './log-consumer.service';

@Module({
    controllers: [LogConsumerService],
    providers: [LogConsumerService],
})
export class WorkersModule {}
