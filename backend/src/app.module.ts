import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DefaultDataService } from './default-data/default-data.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/meeting'),
    MessagesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [DefaultDataService],
  controllers: [],
})
export class AppModule {}
