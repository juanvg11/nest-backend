import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!, {
      dbName: process.env.MONGO_DB_NAME,
    }),
    GamesModule,
    CommonModule,
    AuthModule, 
    FilesModule
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {


}


