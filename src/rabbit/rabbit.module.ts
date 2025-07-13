import { Module } from '@nestjs/common';
import { RabbitService } from './rabbit.service';
import { RabbitController } from './rabbit.controller';

@Module({
    providers: [RabbitService],
    controllers: [RabbitController],
    exports: [RabbitService],
})
export class RabbitModule { }
