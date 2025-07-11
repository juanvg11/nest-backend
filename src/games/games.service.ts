import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Game, Genre } from './entities/game.entity';
import  { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dtos/pagination.dto';


@Injectable()
export class GamesService {
  /* Permite acceder al modelo de la BD y ejecutar las operaciones */
  constructor(@InjectModel(Game.name) private gameModel: Model<Game>) {}

  /* Creacion de un nuevo juego */
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

  


  /* Recupera todos los juegos de la BD
     Mejora: implementar paginacion con .skip() y .limit() */
  /* async findAll({genre, favorite, search, visible}: {genre?: Genre, favorite?: boolean | string, search?:string, visible?: boolean | string}): Promise<Game[]> {
    
    const filters: any = [];
    if (genre) filters.push({ genre });
    if (favorite) filters.push({favorite: favorite === 'true'})
    if (search) filters.push({  title: { $regex: search, $options: 'i' } });
    if (visible) filters.push({ isVisible: visible === 'true'})

    return this.gameModel.find({
      $and: filters
      
    }).lean().exec();
  } */

    async findAll({
      genre,
      favorite,
      search,
      visible,
      limit = 10,
      offset = 0
    }: {
      genre?: Genre;
      favorite?: boolean | string;
      search?: string;
      visible?: boolean | string;
      limit?: number;
      offset?: number;
    }): Promise<{ count: number; pages: number; games: Game[] }> {
    
      const filters: any = [];
      if (genre) filters.push({ genre });
      if (favorite) filters.push({ favorite: favorite === 'true' });
      if (search) filters.push({ title: { $regex: search, $options: 'i' } });
      if (visible) filters.push({ isVisible: visible === 'true' });
    
      const query = filters.length > 0 ? { $and: filters } : {};
    
      // Obtener juegos paginados
      const games = await this.gameModel
        .find(query)
        .limit(limit)
        .skip(offset)
        .sort({ _id: 1 }) // Ordenar por ID ascendente
        .lean()
        .exec();
    
      // Contar el total de juegos que coinciden con los filtros
      const totalGames = await this.gameModel.countDocuments(query);
    
      return {
        count: totalGames,
        pages: Math.ceil(totalGames / limit),
        games
      };
    }
    


  /* Busca un juego por su uuid. Ej: ps-gowr */
  async findOne(uuid: string): Promise<Game|null> {
    try {
      const game = await this.gameModel.findOne({uuid}).lean().exec();
      if (!game) {
        throw new NotFoundException(`Game with UUID ${uuid} not found`);
    }
      return game;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException(`Invalid ID format: ${uuid}`);
      }
      throw new BadRequestException(`Error fetching game with UUID: ${uuid}`);
    }
  }

  /* GPT */
  async findByIds(ids: string[]): Promise<Game[]> {
    return this.gameModel.find({ _id: { $in: ids } }).exec();
  }
  

  

  /* Busca juegos por genero */
  async findByGenre(genre: string): Promise<Game[]> {
    return this.gameModel.find({ genre: genre.toLowerCase() }).lean().exec();
  }
  
  
  /* Actualiza un juego existente */
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

      throw new BadRequestException(`Error updating game`);
    }
  }

  async updateByUuid(uuid: string, updateGameDto: UpdateGameDto) {
    try {
      const updatedGame = await this.gameModel
        .findOneAndUpdate({uuid}, updateGameDto, { new: true })
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

      throw new BadRequestException(`Error updating game`);
    }
  }


  /* Elimina un juego por su id */
  async remove(id: string): Promise<Game|null> {

    try {
      const deletedGame = await this.gameModel.findByIdAndDelete(id).lean().exec();
      if (!deletedGame) {
        throw new NotFoundException(`Game with ID ${id} not found`);
    }
    console.log("Juego eliminado correctamente");
      return deletedGame;
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting game with ID ${id}`);
    }
   
  }

  /* Marca un juego como favorito, actualizando el campo favorite */
  async markAsFavorite(uuid: string, updateGameDto: UpdateGameDto): Promise<Game> {
    // Actualiza el campo 'favorite' a true para marcarlo como favorito
    const updatedGame = await this.gameModel.findOneAndUpdate(
      { uuid },
      { favorite: updateGameDto.favorite },
      { new: true }
    ).lean().exec();
  
    if (!updatedGame) {
      throw new NotFoundException(`Game with UUID ${uuid} not found`);
    }
  
    return updatedGame;
  }

     /* async markAsFavorite(id: string, updateGameDto: UpdateGameDto): Promise<Game> {
    // Actualiza el campo 'favorite' a true para marcarlo como favorito
    const updatedGame = await this.gameModel.findByIdAndUpdate(
      { id },
      { favorite: updateGameDto.favorite },
      { new: true }
    ).lean().exec();
  
    if (!updatedGame) {
      throw new NotFoundException(`Game with UUID ${id} not found`);
    }
  
    return updatedGame;
  } */

  /* Marca un juego como visible */
  async markAsVisible(uuid: string, updateGameDto: UpdateGameDto): Promise<Game> {
    // Actualiza el campo 'favorite' a true para marcarlo como favorito
    const updatedGame = await this.gameModel.findOneAndUpdate(
      { uuid },
      { isVisible: updateGameDto.isVisible },
      { new: true }
    ).lean().exec();
  
    if (!updatedGame) {
      throw new NotFoundException(`Game with UUID ${uuid} not found`);
    }
  
    return updatedGame;
  }
 
  /* Actualiza el campo de la calificación (rating) de un juego */
  async ratingGame(uuid: string, updateGameDto: UpdateGameDto): Promise<Game> {
    // Actualiza el campo 'favorite' a true para marcarlo como favorito
    const ratingGame = await this.gameModel.findOneAndUpdate(
      { uuid },
      { rating: updateGameDto.rating },
      { new: true }
    ).lean().exec();
  
    if (!ratingGame) {
      throw new NotFoundException(`Game with UUID ${uuid} not found`);
    }
  
    return ratingGame;
  }
  
  /* Recupera los juegos marcados como favoritos */
  async getFavorites(favorite: string): Promise<Game[]> {
    return this.gameModel.find({ favorite: favorite.toLowerCase()}).lean().exec();
    
  }

  /* Recupera los juegos que están marcados como visibles */
  async getVisible(visible: string): Promise<Game[]> {
    return this.gameModel.find({ isVisible: visible.toLowerCase()}).lean().exec();
    
  }

  /* Realiza una búsqueda de juegos basándose en el título con una expresión regular */
  async searchGames(query: string): Promise<Game[]> {
    try {
      return await this.gameModel.find(
        { title: { $regex: query, $options: 'i' } } 
      ).lean().exec();
    } catch (error) {
      throw new InternalServerErrorException('Error en la búsqueda');
    }
  }

}
