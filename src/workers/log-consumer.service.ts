import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class LogConsumerService {
    @EventPattern('log_message')
    handleLog(@Payload() data: any) {
        console.log('[Worker] Received message from RabbitMQ:', data);
    }
}
