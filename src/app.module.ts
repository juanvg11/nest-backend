import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    GamesModule,
    CommonModule,
    AuthModule, 
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {


}


