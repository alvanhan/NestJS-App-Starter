import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { UserProvider } from './entities/user-provider.entity';
import mikroOrmConfig from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { RabbitModule } from './rabbit/rabbit.module';
import { WorkersModule } from './workers/workers.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature([User, UserProvider]),
    ConfigModule.forRoot({
      isGlobal: true    
    }),
    RabbitModule,
    WorkersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
