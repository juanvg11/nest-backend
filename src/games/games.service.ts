import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from './entities/game.entity';
import mongoose, { Model } from 'mongoose';
import { error } from 'console';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  async create(createGameDto: CreateGameDto): Promise<Game> {
    try {
      const createdGame = new this.gameModel(createGameDto);
      return await createdGame.save();
    } catch (error) {
      if (error.code === 11000) { // Duplicado de índice único
        throw new BadRequestException(`${createGameDto.title} already exists!`);
      }
      throw new InternalServerErrorException('Something terrible happened');
    }
  }

  async findAll() {
    return this.gameModel.find().lean().exec();
  }

  async findOne(uuid: string): Promise<Game|null> {
    try {
      const game = await this.gameModel.findOne({uuid}).lean().exec();
     
      return game;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`El juego con id:${uuid} no se encuentra`);
      }
      console.error('Error in update method:', error);
      throw new BadRequestException(`Invalid ID format or game not found: ${uuid}`);
    }
  }

  async findByGenre(genre: string): Promise<Game[]> {
    return this.gameModel.find({ genre: genre.toLocaleLowerCase() }).lean().exec();
  }
  

  /* async remove(id: string): Promise<Game> {
    const deletedGame = await this.gameModel.findByIdAndDelete(id).lean().exec();
    if (!deletedGame) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return deletedGame;
  } */
  
  
 
  async update(uuid: string, updateGameDto: UpdateGameDto) {
    try {
      const updatedGame = await this.gameModel
        .findByIdAndUpdate(uuid, updateGameDto, { new: true })
        .lean()
        .exec();
      return updatedGame;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`El id:${uuid} es erroneo`);
      }

      if(error.code === 11000){
        throw new BadRequestException(`${updateGameDto.title} already exists!`);
      }

      console.error('Error in update method:', error);
      throw new BadRequestException(`Invalid ID format or game not found: ${uuid}`);
    }
    
  }

   async remove(id: string): Promise<Game|null> {

    try {
      const deletedGame = await this.gameModel.findByIdAndDelete(id).lean().exec();
      return deletedGame;
    } catch (error) {
        throw new BadRequestException(`Game with ID ${id} not found`);
    }
   
  } 

}
