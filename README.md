# NestJS App Service

A robust NestJS application with RabbitMQ messaging, PostgreSQL database integration, and microservices architecture.

## Features

- **NestJS Framework**: Built with TypeScript and modern Node.js patterns
- **RabbitMQ Integration**: Message queuing system for asynchronous communication
- **PostgreSQL Database**: Persistent data storage with MikroORM
- **Microservices Architecture**: Separate message consumers and producers
- **Fastify**: High-performance web framework as Express alternative
- **Environment Configuration**: Configurable settings via environment variables

## Architecture

```
├── src/
│   ├── entities/           # Database entities
│   │   ├── user.entity.ts
│   │   └── user-provider.entity.ts
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
APP_PORT=3000

# Database settings
DATABASE_URL=postgresql://username:password@localhost:5432/nest_app
DATABASE_DEBUG=false

# RabbitMQ settings
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_QUEUE=main_queue
RABBITMQ_QUEUE_DURABLE=false
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
  id: string (UUID)
  full_name: string
  email?: string (unique)
  role: UserRole (USER | ADMIN | SUPERADMIN)
  created_at: Date
  updated_at: Date
}
```

### UserProvider Entity
```typescript
{
  id: string (UUID)
  provider: string
  provider_id: string
  user: User (relation)
  created_at: Date
  updated_at: Date
}
```

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
| `APP_PORT` | Application port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `DATABASE_DEBUG` | Enable database query logging | `false` |
| `RABBITMQ_URL` | RabbitMQ connection URL | `amqp://localhost:5672` |
| `RABBITMQ_QUEUE` | RabbitMQ queue name | `main_queue` |
| `RABBITMQ_QUEUE_DURABLE` | Whether the queue should be durable | `false` |

## Project Structure

```
nest-app-service/
├── src/
│   ├── entities/           # Database entities
│   ├── rabbit/             # RabbitMQ integration
│   ├── workers/            # Message consumers
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
- **[TypeScript](https://typescriptlang.org/)** - Typed JavaScript
- **[Jest](https://jestjs.io/)** - Testing framework

## Quick Start Example

1. Start the application:
```bash
npm run start:dev
```

2. Test the health endpoint:
```bash
curl http://localhost:3000/
```

3. Send a message to RabbitMQ:
```bash
curl http://localhost:3000/rabbit/emit
```

4. Check the console logs to see the message being consumed by the worker.

## Troubleshooting

### Common Issues

1. **Port already in use**: If you get `EADDRINUSE` error, kill the process using:
```bash
lsof -ti:3000 | xargs kill -9
```

2. **Database connection issues**: Check your `DATABASE_URL` in `.env` file and ensure PostgreSQL is running.

3. **RabbitMQ connection issues**: Ensure RabbitMQ is running on `localhost:5672` or update the connection settings in `rabbit.service.ts`.

4. **Message handler not found**: This indicates the consumer service isn't properly registered. Ensure the `WorkersModule` is imported in `AppModule`.

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
