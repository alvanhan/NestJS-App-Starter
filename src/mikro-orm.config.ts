import { Options } from '@mikro-orm/core';
import { User } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const config: Options = {
    driver: require('@mikro-orm/postgresql').PostgreSqlDriver,
    clientUrl: process.env.DATABASE_URL,
    entities: [User, UserProvider],
    debug: process.env.DATABASE_DEBUG === 'true',
    migrations: {
        path: './migrations',
        glob: '!(*.d).{js,ts}',
    },
};

export default config;
