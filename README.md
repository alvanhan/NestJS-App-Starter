# NestJS App Service

Aplikasi NestJS yang robust dengan fitur JWT authentication, email notifications, RabbitMQ messaging, PostgreSQL database, dan clean architecture patterns.

## Fitur Utama

- **NestJS Framework** dengan TypeScript
- **JWT Authentication** dengan access dan refresh tokens
- **Email Notifications** dengan template HTML dan SMTP
- **RabbitMQ** untuk message queuing
- **PostgreSQL** dengan MikroORM
- **Clean Architecture** dengan domain-driven design
- **UUID v7** untuk performa database yang lebih baik
- **Fastify** sebagai web framework

## Prerequisites

Pastikan Anda telah menginstall:

- **Node.js** (v18 atau lebih tinggi)
- **PostgreSQL** (v12 atau lebih tinggi)
- **RabbitMQ** (v3.8 atau lebih tinggi)
- **npm** atau **yarn**

## Instalasi

1. Clone repository:
```bash
git clone https://github.com/alvanhan/NestJS---Starter.git
cd nest-app-service
```

2. Install dependencies:
```bash
npm install
```

3. Setup environment variables:
```bash
cp .env.example .env
```

4. Edit file `.env` dengan konfigurasi Anda:
```env
# Application settings
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=3000
APP_NAME=NestJS App
APP_BASE_URL=http://localhost:3000

# Database settings
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DATABASE_DEBUG=false

# RabbitMQ settings
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=main_queue
RABBITMQ_QUEUE_DURABLE=false

# JWT settings
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRATION=3600

# JWT Refresh Token settings
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_change_this_in_production
JWT_REFRESH_EXPIRATION=604800

# SMTP Configuration
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_mailtrap_username
SMTP_PASSWORD=your_mailtrap_password
SMTP_FROM=noreply@yourapp.com

# Email Configuration
SUPPORT_EMAIL=support@example.com
NODE_ENV=development
```

5. Setup PostgreSQL database:
```bash
createdb nest_app
```

6. Jalankan database migrations:
```bash
npm run mikro-orm:up
```

## Menjalankan Aplikasi

### Development
```bash
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## Setup RabbitMQ

### Install RabbitMQ

**macOS:**
```bash
brew install rabbitmq
brew services start rabbitmq
```

**Ubuntu/Debian:**
```bash
sudo apt-get install rabbitmq-server
sudo systemctl start rabbitmq-server
```

**Docker:**
```bash
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### RabbitMQ Management UI
Akses management interface di: http://localhost:15672
- Username: `guest`
- Password: `guest`

## Quick Start

1. Jalankan aplikasi:
```bash
npm run start:dev
```

2. Test health endpoint:
```bash
curl http://localhost:3000/
```

3. Register user baru:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

4. Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get user profile
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/logout` - Logout
- `POST /api/auth/logout-all` - Logout dari semua device

### Other
- `GET /` - Health check
- `GET /api/rabbit/emit` - Test RabbitMQ message

## Development Scripts

```bash
npm run start:dev          # Start development mode
npm run start:debug        # Start debug mode
npm run build             # Build aplikasi
npm run start:prod        # Start production mode
npm run test              # Run tests
npm run mikro-orm:create  # Create migration
npm run mikro-orm:up      # Run migrations
npm run lint              # Run ESLint
npm run format            # Format code
```

## Troubleshooting

### Common Issues

1. **Port sudah digunakan**:
```bash
lsof -ti:3000 | xargs kill -9
```

2. **Database connection error**: Cek `DATABASE_URL` di file `.env`

3. **RabbitMQ connection error**: Pastikan RabbitMQ running di `localhost:5672`

4. **JWT token invalid**: Cek `JWT_SECRET` dan `JWT_REFRESH_SECRET` di `.env`

5. **Email tidak terkirim**: Cek konfigurasi SMTP di `.env`

### SMTP Configuration untuk Email

```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**SMTP Providers:**
- **Gmail**: `smtp.gmail.com:587`
- **Outlook**: `smtp-mail.outlook.com:587`
- **Mailtrap**: `sandbox.smtp.mailtrap.io:2525` (untuk testing)

## License

UNLICENSED

## Support

Untuk support, silakan buka issue di repository atau hubungi development team. settings if email notifications don't work

### Email Configuration

For email notifications to work properly, configure these environment variables:

```bash
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@domain.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

**Popular SMTP Providers:**
- **Gmail**: `smtp.gmail.com:587` (requires app password)
- **Outlook**: `smtp-mail.outlook.com:587`
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailtrap** (for testing): `sandbox.smtp.mailtrap.io:2525`

### Database Migration Issues

If you encounter migration issues:

1. **Check migration status**:
```bash
npm run mikro-orm migration:status
```

2. **Create new migration**:
```bash
npm run mikro-orm:create
```

3. **Run pending migrations**:
```bash
npm run mikro-orm:up
```

4. **Reset database** (development only):
```bash
npm run mikro-orm migration:down
```

## Recent Updates

**New Features:**
- **Email Notification System**: Complete email module with templates and SMTP integration
- **Refresh Token Support**: Secure token refresh mechanism with device tracking
- **Email Verification**: Automated email verification workflow
- **Welcome Emails**: Automated welcome email after email verification
- **Template System**: HTML email templates with variable substitution
- **Dual Token System**: Access tokens (short-lived) and refresh tokens (long-lived)
- **Device Tracking**: User agent and IP address tracking for security
- **Token Revocation**: Individual and bulk token revocation support
- **Global Exception Handling**: Centralized error handling with custom filters
- **Validation Pipeline**: Request validation with custom validation pipes

**New Dependencies:**
- `@nestjs/jwt` - JWT token handling
- `@nestjs/passport` - Authentication middleware
- `@nestjs/microservices` - RabbitMQ integration
- `@types/nodemailer` - Email sending types
- `nodemailer` - Email sending library
- `amqp-connection-manager` - RabbitMQ connection management
- `amqplib` - RabbitMQ client library
- `bcrypt` - Password hashing
- `passport` - Authentication framework
- `passport-jwt` - JWT strategy for Passport
- `uuidv7` - UUID v7 generation
- `class-validator` - Validation decorators
- `class-transformer` - Object transformation

**Configuration Changes:**
- Updated `.env.example` with comprehensive configuration
- Added JWT refresh token settings
- Added SMTP configuration for email notifications
- Added email-related environment variables
- Changed default port from 9000 to 3000
- Enhanced database debug logging

**Architecture Improvements:**
- Added `src/modules/email-notification/` - Complete email notification module
- Added `src/entities/refresh-token.entity.ts` - Refresh token storage
- Added `src/filters/` - Global exception filters
- Added `src/pipes/` - Custom validation pipes
- Added `src/workers/email-notification-consumer.service.ts` - Email worker
- Enhanced `src/config/` - Comprehensive configuration service
- Enhanced `src/utils/` - UUID v7 utilities and response helpers
- Implemented clean architecture patterns with domain/application/infrastructure layers
- Added comprehensive documentation and examples

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the UNLICENSED License.

## Support

For support, please open an issue in the repository or contact the development team.
