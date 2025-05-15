import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';


import { CreateUserDto, LoginUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/guards.guard';
import { UpdateFavoriteRatingDto } from './dto/update-favorite-rating.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  //@UseGuards( AuthGuard )
  @Get()
  findAll( @Request() req: Request ) {

    //const user = req['user'];
    //return user;
    return this.authService.findAll();
  }
  
  @UseGuards( AuthGuard )
  @Get('/check-token')
  checkToken( @Request() req: Request ) {

    const user = req['user'] as User;

    return {
      user,
      token: this.authService.getJwtToken({ id: user._id! })
    }
  }

  @Get(':id')
  getUserById(@Param('id') id: string) {
  return this.authService.findUserById(id);
}


/* @Patch(':id/library/:gameId')
addGameToLibrary(@Param('id') userId: string, @Param('gameId') gameId: string) {
  return this.authService.addGameToLibrary(userId, gameId);
}
 */
/* @Get(':id/library')
getLibrary(@Param('id') userId: string) {
  return this.authService.getUserLibrary(userId);
} */


// Alternar favorito
@Patch(':id/favorites/:gameId')
toggleFavorite(@Param('id') userId: string, @Param('gameId') gameId: string) {
  return this.authService.toggleFavorites(userId, gameId);
}



 /* Probando rating GPT */
/* @Patch(':userId/favorites/:gameId/rating')
updateFavoriteRating(
  @Param('userId') userId: string,
  @Param('gameId') gameId: string,
  @Body('rating') rating: number,
) {
  return this.authService.rateFavoriteGame(userId, gameId, rating);
} */




// Alternar favorito
@Patch(':id/library/:gameId')
toggleLibrary(@Param('id') userId: string, @Param('gameId') gameId: string) {
  return this.authService.toggleLibrary(userId, gameId);
}



  

 /*  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()) {
    return this.authService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  } */
}


