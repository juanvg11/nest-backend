import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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

 

  @Get('genre/:genre')  // Nueva ruta para filtrar por género
  findByGenre(@Param('genre') genre: string) {
  return this.gamesService.findByGenre(genre);
}

@Get('favorite/:favorite')
getFavoriteGames(@Param('favorite') favorite: string) {
 return this.gamesService.getFavorites(favorite);
}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Patch(':uuid/favorite')
  async markAsFavorite(@Param('uuid') uuid: string) {
    return this.gamesService.markAsFavorite(uuid);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
