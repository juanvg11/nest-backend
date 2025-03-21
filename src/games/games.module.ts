import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './entities/game.entity';

@Module({
  controllers: [GamesController],
  providers: [GamesService],
  imports:[
    MongooseModule.forFeature([
      {
        name: Game.name,
        schema: GameSchema
      }
    ])
    ] 
  
})
export class GamesModule {}
