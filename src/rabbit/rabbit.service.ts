// src/rabbit/rabbit.service.ts
import { Injectable } from '@nestjs/common';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
} from '@nestjs/microservices';

@Injectable()
export class RabbitService {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: ['amqp://localhost:5672'],
                queue: 'main_queue',
                queueOptions: { durable: false },
            },
        });
    }

    async sendMessage(pattern: string, data: any) {
        return this.client.emit(pattern, data);
    }
}
