import { ConfigService } from '@nestjs/config';

export interface AppConfig {
    env: string;
    host: string;
    port: number;
}

export interface DatabaseConfig {
    url: string;
    debug: boolean;
}

export interface JwtConfig {
    secret: string;
    expiration: string;
    expirationNumber: number;
}

export interface RabbitMQConfig {
    url: string;
    queue: string;
    queueDurable: boolean;
}

export class ConfigurationService {
    constructor(private configService: ConfigService) {}

    get app(): AppConfig {
        return {
            env: this.configService.get<string>('APP_ENV', 'development'),
            host: this.configService.get<string>('APP_HOST', '0.0.0.0'),
            port: this.configService.get<number>('APP_PORT', 3000),
        };
    }

    get database(): DatabaseConfig {
        return {
            url: this.configService.get<string>('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/nest_app'),
            debug: this.configService.get<string>('DATABASE_DEBUG', 'false') === 'true',
        };
    }

    get jwt(): JwtConfig {
        const expirationSeconds = this.configService.get<string>('JWT_EXPIRATION', '3600');
        return {
            secret: this.configService.get<string>('JWT_SECRET', 'your_jwt_secret'),
            expiration: expirationSeconds + 's',
            expirationNumber: parseInt(expirationSeconds),
        };
    }

    get rabbitmq(): RabbitMQConfig {
        return {
            url: this.configService.get<string>('RABBITMQ_URL', 'amqp://localhost:5672'),
            queue: this.configService.get<string>('RABBITMQ_QUEUE', 'main_queue'),
            queueDurable: this.configService.get<string>('RABBITMQ_QUEUE_DURABLE', 'false') === 'true',
        };
    }

    validateConfig(): void {
        // Validate JWT configuration
        if (!this.configService.get<string>('JWT_SECRET')) {
            throw new Error('JWT_SECRET is required');
        }
        
        const expiration = this.configService.get<string>('JWT_EXPIRATION');
        if (expiration && isNaN(parseInt(expiration))) {
            throw new Error('JWT_EXPIRATION must be a valid number');
        }

        // Validate database configuration
        if (!this.configService.get<string>('DATABASE_URL')) {
            throw new Error('DATABASE_URL is required');
        }

        // Validate app configuration
        const port = this.configService.get<string>('APP_PORT');
        if (port && isNaN(parseInt(port))) {
            throw new Error('APP_PORT must be a valid number');
        }
    }
}
