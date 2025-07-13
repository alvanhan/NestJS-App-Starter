import { Controller, Get } from '@nestjs/common';
import { RabbitService } from './rabbit.service';

@Controller('rabbit')
export class RabbitController {
    constructor(private readonly rabbitService: RabbitService) { }

    @Get('emit')
    async emitMessage() {
        this.rabbitService.sendMessage('log_message', {
            text: 'Hello from Publisher!',
            sentAt: new Date(),
        });
        return { status: 'Message sent to RabbitMQ' };
    }
}
