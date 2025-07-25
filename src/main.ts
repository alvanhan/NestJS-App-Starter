import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3000);
  const host = configService.get<string>('APP_HOST', '0.0.0.0');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672')],
      queue: configService.get<string>('RABBITMQ_QUEUE', 'main_queue'),
      queueOptions: { 
        durable: configService.get<string>('RABBITMQ_QUEUE_DURABLE', 'false') === 'true'
      },
    },
  });
  
  // Set global prefix
  app.setGlobalPrefix('api');
  
  // Setup global validation pipe
  app.useGlobalPipes(new CustomValidationPipe());
  
  // Setup global exception filters
  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new ValidationExceptionFilter(),
  );
  
  await app.startAllMicroservices();
  await app.listen(port, host);
}
bootstrap();
