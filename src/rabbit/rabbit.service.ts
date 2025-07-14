// src/rabbit/rabbit.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
} from '@nestjs/microservices';

@Injectable()
export class RabbitService {
    private client: ClientProxy;

    constructor(private configService: ConfigService) {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
                queue: this.configService.get<string>('RABBITMQ_QUEUE'),
                queueOptions: { 
                    durable: this.configService.get<string>('RABBITMQ_QUEUE_DURABLE', 'false') === 'true'
                },
            },
        });
    }

    async sendMessage(pattern: string, data: any) {
        return this.client.emit(pattern, data);
    }
}
