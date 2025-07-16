# NestJS App Service

A robust NestJS application with JWT authentication, RabbitMQ messaging, PostgreSQL database integration, and microservices architecture.

## Features

- **NestJS Framework**: Built with TypeScript and modern Node.js patterns
- **JWT Authentication**: Secure user authentication with JWT tokens
- **UUID v7 Support**: Time-ordered UUIDs for better database performance
- **RabbitMQ Integration**: Message queuing system for asynchronous communication
- **PostgreSQL Database**: Persistent data storage with MikroORM
- **Microservices Architecture**: Separate message consumers and producers
- **Fastify**: High-performance web framework as Express alternative
- **Environment Configuration**: Configurable settings via environment variables
- **Clean Architecture**: Domain-driven design with use cases and repositories

## Architecture

```
├── src/
│   ├── entities/           # Database entities
│   │   ├── user.entity.ts
│   │   └── user-provider.entity.ts
│   ├── modules/            # Feature modules
│   │   └── auth/           # Authentication module
│   │       ├── application/    # Controllers, DTOs, services
│   │       ├── domain/        # Domain models and enums
│   │       ├── infrastructure/ # Guards, strategies
│   │       └── usecase/       # Business logic
│   ├── config/             # Configuration services
│   │   ├── configuration.service.ts
│   │   └── jwt.config.ts
│   ├── utils/              # Utility functions
│   │   ├── uuid.util.ts    # UUID v7 utilities
│   │   └── response.ts     # Response utilities
│   ├── rabbit/             # RabbitMQ client service
│   │   ├── rabbit.controller.ts
│   │   ├── rabbit.service.ts
│   │   └── rabbit.module.ts
│   ├── workers/            # Message consumers
│   │   ├── log-consumer.service.ts
│   │   └── workers.module.ts
│   └── migrations/         # Database migrations
```

## Prerequisites

Before running this application, make sure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **RabbitMQ** (v3.8 or higher)
- **npm** or **yarn**

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nest-app-service
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Configure your `.env` file with:
```env
# Application settings
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=9000

# Database settings
DATABASE_URL=postgresql://postgres:password@localhost:5432/nest_app
DATABASE_DEBUG=true

# RabbitMQ settings
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=main_queue
RABBITMQ_QUEUE_DURABLE=false

# JWT settings
# JWT_SECRET: Secret key for signing JWT tokens (change this in production!)
# JWT_EXPIRATION: Token expiration time in seconds (3600 = 1 hour)
JWT_SECRET=jwtku_service
JWT_EXPIRATION=3600
```

4. Set up PostgreSQL database:
```bash
createdb nest_app
```

5. Run database migrations:
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

## RabbitMQ Setup

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
Access the management interface at: http://localhost:15672
- Username: `guest`
- Password: `guest`

## API Endpoints

### Health Check
```http
GET /
```

### Authentication
```http
POST /auth/register
POST /auth/login
```

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "01981151-a0d1-7d94-b522-70f8188f858e",
    "full_name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### RabbitMQ Message Publishing
```http
GET /rabbit/emit
```

Publishes a test message to the RabbitMQ queue. The message will be consumed by the `LogConsumerService` and logged to the console.

**Response:**
```json
{
  "status": "Message sent to RabbitMQ"
}
```

## Database Schema

### User Entity
```typescript
{
  id: string (UUID v7)
  full_name: string
  email?: string (unique)
  username?: string (unique)
  hashed_password?: string
  email_verified: boolean
  phone_number?: string
  role: UserRole (USER | ADMIN | SUPERADMIN)
  is_active: boolean
  last_login_at?: Date
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  providers: UserProvider[]
}
```

### UserProvider Entity
```typescript
{
  id: string (UUID v7)
  user: User (relation)
  provider: AuthProvider (GOOGLE | GITHUB | FACEBOOK | APPLE | LOCAL)
  provider_user_id: string
  access_token?: string
  refresh_token?: string
  linked_at: Date
}
```

## Authentication System

### JWT Configuration
The application uses JWT (JSON Web Tokens) for authentication with the following features:

- **Environment-based configuration**: JWT secret and expiration configurable via `.env`
- **Secure defaults**: Strong password hashing with bcrypt (salt rounds: 10)
- **Token validation**: Automatic token validation on protected routes
- **Role-based access**: User roles (USER, ADMIN, SUPERADMIN) support

### UUID v7 Benefits
- **Time-ordered**: UUIDs generated later will sort after earlier ones
- **Database optimized**: Better performance for B-tree indexes as primary keys
- **Collision resistance**: Extremely low probability of duplicates
- **Embedded timestamp**: Contains creation time for auditing

### Authentication Flow
1. User registers with email/password
2. Password is hashed using bcrypt (10 rounds)
3. User data stored with UUID v7 primary key
4. Login returns JWT token with user claims
5. Token used for subsequent authenticated requests

## Message Queue Architecture

### Publisher (RabbitService)
- Publishes messages to RabbitMQ
- Uses `client.emit()` for fire-and-forget messaging
- Configured with `main_queue`

### Consumer (LogConsumerService)
- Listens for `log_message` events
- Processes messages asynchronously
- Logs received messages to console

## Development Scripts

```bash
# Development
npm run start:dev          # Start in watch mode
npm run start:debug        # Start with debugging

# Building
npm run build             # Build the application
npm run start:prod        # Start production build

# Testing
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run end-to-end tests

# Database
npm run mikro-orm:create  # Create new migration
npm run mikro-orm:up      # Run migrations

# Code Quality
npm run lint              # Run ESLint
npm run format            # Format code with Prettier
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Application environment | `development` |
| `APP_HOST` | Application host | `0.0.0.0` |
| `APP_PORT` | Application port | `9000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `DATABASE_DEBUG` | Enable database query logging | `true` |
| `RABBITMQ_URL` | RabbitMQ connection URL | `amqp://localhost:5672` |
| `RABBITMQ_QUEUE` | RabbitMQ queue name | `main_queue` |
| `RABBITMQ_QUEUE_DURABLE` | Whether the queue should be durable | `false` |
| `JWT_SECRET` | JWT token signing secret | `jwtku_service` |
| `JWT_EXPIRATION` | JWT token expiration (seconds) | `3600` |

### JWT Security Notes
- **JWT_SECRET**: Change this in production! Use a strong, random secret
- **JWT_EXPIRATION**: 3600 seconds = 1 hour. Adjust based on security requirements
- **Password Security**: Uses bcrypt with 10 salt rounds for password hashing

## Project Structure

```
nest-app-service/
├── src/
│   ├── entities/           # Database entities
│   │   ├── user.entity.ts
│   │   └── user-provider.entity.ts
│   ├── modules/            # Feature modules
│   │   └── auth/           # Authentication module
│   │       ├── application/    # Controllers, DTOs, services
│   │       │   ├── auth.controller.ts
│   │       │   ├── auth.service.ts
│   │       │   └── dto/
│   │       ├── domain/        # Domain models and enums
│   │       │   └── enums/
│   │       ├── infrastructure/ # Guards, strategies
│   │       │   ├── guards/
│   │       │   └── strategies/
│   │       ├── usecase/       # Business logic
│   │       │   ├── login.usecase.ts
│   │       │   └── register.usecase.ts
│   │       └── auth.module.ts
│   ├── config/             # Configuration services
│   │   ├── configuration.service.ts
│   │   ├── jwt.config.ts
│   │   └── JWT_CONFIG.md
│   ├── utils/              # Utility functions
│   │   ├── uuid.util.ts    # UUID v7 utilities
│   │   ├── response.ts     # Response utilities
│   │   └── README.md
│   ├── rabbit/             # RabbitMQ integration
│   │   ├── rabbit.controller.ts
│   │   ├── rabbit.service.ts
│   │   └── rabbit.module.ts
│   ├── workers/            # Message consumers
│   │   ├── log-consumer.service.ts
│   │   └── workers.module.ts
│   ├── migrations/         # Database migrations
│   ├── app.module.ts       # Main application module
│   ├── app.controller.ts   # Application controller
│   ├── app.service.ts      # Application service
│   ├── main.ts            # Application entry point
│   └── mikro-orm.config.ts # Database configuration
├── test/                   # Test files
├── eslint.config.mjs       # ESLint configuration
├── nest-cli.json          # NestJS CLI configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Technologies Used

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[Fastify](https://fastify.io/)** - Fast and low overhead web framework
- **[MikroORM](https://mikro-orm.io/)** - TypeScript ORM for Node.js
- **[PostgreSQL](https://postgresql.org/)** - Advanced open source database
- **[RabbitMQ](https://rabbitmq.com/)** - Message broker
- **[JWT](https://jwt.io/)** - JSON Web Tokens for authentication
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
- **[UUID v7](https://github.com/LiosK/uuidv7)** - Time-ordered UUIDs
- **[TypeScript](https://typescriptlang.org/)** - Typed JavaScript
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Passport](https://passportjs.org/)** - Authentication middleware

## Quick Start Example

1. Start the application:
```bash
npm run start:dev
```

2. Test the health endpoint:
```bash
curl http://localhost:9000/
```

3. Register a new user:
```bash
curl -X POST http://localhost:9000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

4. Login with the user:
```bash
curl -X POST http://localhost:9000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

5. Send a message to RabbitMQ:
```bash
curl http://localhost:9000/rabbit/emit
```

6. Check the console logs to see the message being consumed by the worker.

## Troubleshooting

### Common Issues

1. **Port already in use**: If you get `EADDRINUSE` error, kill the process using:
```bash
lsof -ti:9000 | xargs kill -9
```

2. **Database connection issues**: Check your `DATABASE_URL` in `.env` file and ensure PostgreSQL is running.

3. **RabbitMQ connection issues**: Ensure RabbitMQ is running on `localhost:5672` or update the connection settings.

4. **JWT token invalid**: Check if `JWT_SECRET` is properly configured in `.env` file.

5. **Authentication errors**: Ensure the JWT strategy is properly configured and the token is included in the Authorization header as `Bearer <token>`.

6. **Message handler not found**: This indicates the consumer service isn't properly registered. Ensure the `WorkersModule` is imported in `AppModule`.

### Configuration Validation

The application validates configuration on startup. Common validation errors:

- **JWT_SECRET is required**: Set a proper JWT secret in `.env`
- **JWT_EXPIRATION must be a valid number**: Ensure expiration is a numeric value
- **DATABASE_URL is required**: Provide a valid PostgreSQL connection string
- **APP_PORT must be a valid number**: Ensure port is numeric

### UUID v7 Utilities

The application includes UUID v7 utilities in `src/utils/uuid.util.ts`:

```typescript
import { generateUuid, isUuidV7, extractTimestampFromUuid } from 'src/utils';

// Generate UUID v7
const id = generateUuid();

// Check if UUID is v7
const isV7 = isUuidV7(id);

// Extract timestamp
const timestamp = extractTimestampFromUuid(id);
```

## Recent Updates

**New Dependencies:**
- `@nestjs/jwt` - JWT token handling
- `@nestjs/passport` - Authentication middleware
- `bcrypt` - Password hashing
- `passport` - Authentication framework
- `passport-jwt` - JWT strategy for Passport
- `uuidv7` - UUID v7 generation
- `@types/bcrypt` - TypeScript types for bcrypt

**Configuration Changes:**
- Updated `.env` with JWT settings
- Changed default port from 3000 to 9000
- Added JWT_SECRET and JWT_EXPIRATION variables
- Enhanced database debug logging

**Architecture Improvements:**
- Added `src/modules/auth/` - Authentication module
- Added `src/config/` - Configuration services
- Added `src/utils/` - Utility functions including UUID v7
- Implemented clean architecture patterns
- Added comprehensive documentation

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
