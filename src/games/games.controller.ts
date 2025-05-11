import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, Genre } from './entities/game.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  /* @Get()
  findAll(@Query('genre') genre: Genre, @Query('favorite') favorite: boolean, @Query('search') search: string,  @Query('visible') visible: boolean) {
    return this.gamesService.findAll({genre, favorite, search, visible});
  } */
 
    @Get()
    async findAll(
      @Query('genre') genre?: Genre,
      @Query('favorite') favorite?: boolean,
      @Query('search') search?: string,
      @Query('visible') visible?: boolean,
      @Query('limit') limit?: number,
      @Query('offset') offset?: number
    ): Promise<{ count: number; pages: number; games: Game[] }> {
  
      return this.gamesService.findAll({
        genre,
        favorite,
        search,
        visible,
        limit: Number(limit) || 10,   // Convertir a número y poner valor por defecto
        offset: Number(offset) || 0,  // Convertir a número y poner valor por defecto
      });
    }


  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.gamesService.findOne(uuid);
  }
/* GPT */
  @Get('by-ids')
findGamesByIds(@Query('ids') ids: string) {
  const idArray = ids.split(',').map(id => id.trim());
  return this.gamesService.findByIds(idArray); // que use find({ _id: { $in: idArray } })
}



  @Get('search/:search')
async searchGames(@Param('search') search: string) {
  console.log(`Búsqueda: ${search}`);
  return this.gamesService.searchGames(search);
}

  @Get('genre/:genre')  // Nueva ruta para filtrar por género
  findByGenre(@Param('genre') genre: string) {
  return this.gamesService.findByGenre(genre);
}



  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  /* Nueva ruta a que en el front no me lega el id */
  @Patch('uuid/:uuid')
  updateByUuid(@Param('uuid') uuid: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.updateByUuid(uuid, updateGameDto);
  }

  @Get('favorite/:favorite')
getFavoriteGames(@Param('favorite') favorite: string) {
 return this.gamesService.getFavorites(favorite);
}

  @Patch(':uuid/favorite')
  async markAsFavorite(@Param('uuid') uuid: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.markAsFavorite(uuid, updateGameDto);
  }

  @Get('visible/:visible')
getGameVisible(@Param('visible') visible: string) {
 return this.gamesService.getVisible(visible);
}

@Patch(':uuid/visible')
  async markAsVisible(@Param('uuid') uuid: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.markAsVisible(uuid, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }

  @Patch(':uuid/rating')
  async ratingGame(@Param('uuid') uuid: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.ratingGame(uuid, updateGameDto);
  }
}
