# NestJS App Service

A robust NestJS application with JWT authentication, email notifications, RabbitMQ messaging, PostgreSQL database, and clean architecture patterns.

## Key Features


## Migration & Seeder

**Migration & Seeder**

ENGLISH:
- To run migrations:
  ```bash
  npm run mikro-orm:up
  ```
- To run seeders:
  ```bash
  npm run seed
  ```
## Prerequisites

Make sure you have installed:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **RabbitMQ** (v3.8 or higher)
- **npm** or **yarn**

## Installation

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

4. Edit `.env` file with your configuration:
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

6. Run database migrations:
```bash
npm run mikro-orm:up
```

## Running the Application

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
Access management interface at: http://localhost:15672
- Username: `guest`
- Password: `guest`

## Quick Start

1. Start the application:
```bash
npm run start:dev
```

2. Test health endpoint:
```bash
curl http://localhost:3000/
```

3. Register new user:
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
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get user profile
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/logout` - Logout
- `POST /api/auth/logout-all` - Logout from all devices

### Other
- `GET /` - Health check
- `GET /api/rabbit/emit` - Test RabbitMQ message

## Development Scripts

```bash
npm run start:dev          # Start development mode
npm run start:debug        # Start debug mode
npm run build             # Build application
npm run start:prod        # Start production mode
npm run test              # Run tests
npm run mikro-orm:create  # Create migration
npm run mikro-orm:up      # Run migrations
npm run lint              # Run ESLint
npm run format            # Format code
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
```bash
lsof -ti:3000 | xargs kill -9
```

2. **Database connection error**: Check `DATABASE_URL` in `.env` file

3. **RabbitMQ connection error**: Make sure RabbitMQ is running on `localhost:5672`

4. **JWT token invalid**: Check `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`

5. **Email not sending**: Check SMTP configuration in `.env`

### SMTP Configuration for Email

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
- **Mailtrap**: `sandbox.smtp.mailtrap.io:2525` (for testing)

## License

UNLICENSED

## Support

For support, please open an issue in the repository or contact the development team.
