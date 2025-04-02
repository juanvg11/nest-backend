import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './games/games.module';
import { CommonModule } from './common/common.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    GamesModule,
    CommonModule, 
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {


}


