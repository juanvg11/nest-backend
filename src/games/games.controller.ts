import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';


@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.gamesService.findOne(uuid);
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

  @Get('favorite/:favorite')
getFavoriteGames(@Param('favorite') favorite: string) {
 return this.gamesService.getFavorites(favorite);
}

  @Patch(':uuid/favorite')
  async markAsFavorite(@Param('uuid') uuid: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.markAsFavorite(uuid, updateGameDto);
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
