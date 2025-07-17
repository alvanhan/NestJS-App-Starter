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

export interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    password: string;
    from: string;
}

export interface AppEmailConfig {
    appName: string;
    appBaseUrl: string;
    supportEmail: string;
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

    get smtp(): SmtpConfig {
        return {
            host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
            port: this.configService.get<number>('SMTP_PORT', 465),
            secure: this.configService.get<string>('SMTP_SECURE', 'true') === 'true',
            user: this.configService.get<string>('SMTP_USER', ''),
            password: this.configService.get<string>('SMTP_PASSWORD', ''),
            from: this.configService.get<string>('SMTP_FROM', ''),
        };
    }

    get appEmail(): AppEmailConfig {
        return {
            appName: this.configService.get<string>('APP_NAME', 'NestJS App'),
            appBaseUrl: this.configService.get<string>('APP_BASE_URL', 'http://localhost:3000'),
            supportEmail: this.configService.get<string>('SUPPORT_EMAIL', 'support@example.com'),
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

        // Validate SMTP configuration
        if (!this.configService.get<string>('SMTP_USER')) {
            console.warn('SMTP_USER is not configured. Email notifications will not work.');
        }
        
        if (!this.configService.get<string>('SMTP_PASSWORD')) {
            console.warn('SMTP_PASSWORD is not configured. Email notifications will not work.');
        }
        
        if (!this.configService.get<string>('SMTP_FROM')) {
            console.warn('SMTP_FROM is not configured. Email notifications will not work.');
        }
    }
}
