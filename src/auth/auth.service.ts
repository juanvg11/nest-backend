import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { LoginUserDto, CreateUserDto, RegisterUserDto, UpdateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { title } from 'process';



@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}


  async create(createUserDto: CreateUserDto): Promise<User> {

    try {

      const { password, ...userData } = createUserDto;

    const newUser = new this.userModel({
      password: bcryptjs.hashSync(password, 10),
      ...userData
    });
    await newUser.save();
    const { password: _, ...user } = newUser.toJSON();
    return user;



    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('Email already exists');
      } else {
        throw new InternalServerErrorException('Error creating user');
      }
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<LoginResponse> {
    const { email, password } = loginUserDto;

    const user = await this.userModel
    .findOne({ email })
    .populate({
    path: 'favorites',
    model: 'Game', // explícitamente
  }); // ⭐ Aquí populamos los juegos favoritos

    //const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials - email');
    }

    if (!bcryptjs.compareSync(password, user.password!)) {
      throw new UnauthorizedException('Invalid  - password');
    }

    const { password: _, ...userData } = user.toJSON();

    return {
      user: userData,
      token: this.getJwtToken({ id: user.id }),

    }
  }

  

  async register( registerUserDto: RegisterUserDto): Promise<LoginResponse> {
    const user = await this.create(registerUserDto);
    console.log({user})

    return {
      user, 
      token: this.getJwtToken({ id: user._id! }),
    }
  }
    
  
 

  async findAll(): Promise<User[]> {
    const populatedUser = await this.userModel
    .find()
    .populate({
    path: 'favorites',
    model: 'Game', // explícitamente
  });

  return populatedUser;
   
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id)
    .populate({
    path: 'favorites',
    model: 'Game', // explícitamente
  });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _, ...userData } = user.toJSON();
    return userData;
  }


  

  async getUserLibrary(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).populate('library');
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    return user;
  }

  async toggleFavorites(userId: string, gameId: string) {
  const user = await this.userModel.findById(userId);

  if (!user) throw new NotFoundException('Usuario no encontrado');

  const gameObjectId = new Types.ObjectId(gameId);

  const index = user.favorites.findIndex((id) => id.equals(gameObjectId));

  if (index > -1) {
    user.favorites.splice(index, 1); // Eliminar si ya está
  } else {
    user.favorites.push(gameObjectId); // Agregar si no está
  }

  await user.save();

  const populatedUser = await this.userModel
    .findById(user._id)
    .populate({
    path: 'favorites',
    model: 'Game', // explícitamente
  });
    console.log(populatedUser?.favorites)

  return populatedUser;
}



/* async updateFavoriteRating(userId: string, gameId: string, rating: number) {
  const updatedUser =  await this.userModel.findOneAndUpdate(
    { _id: userId, 'favorites._id': gameId },
    { $set: { 'favorites.$.rating': rating } },
    { new: true }
  );
   if (!updatedUser) {
    throw new NotFoundException('Usuario o juego no encontrado');
  }

  return updatedUser;
} */

  /* Probando rating GPT */

/* async rateFavoriteGame(userId: string, gameId: string, rating: number) {
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }

  const userObjectId = new Types.ObjectId(userId);
  console.log(userObjectId)
  const gameObjectId = new Types.ObjectId(gameId);
  const isFavorite = user.favorites.some(fav => fav.toString() === gameId);

  if (!isFavorite) {
    throw new NotFoundException('El juego no está en favoritos');
  }

  const existingRating = user.favoriteRatings.find(fav => fav.gameId.toString() === gameId);

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    user.favoriteRatings.push({ gameId: gameObjectId,  rating, userId: userObjectId});
  }

  await user.save();

  return { message: 'Valoración actualizada correctamente',
    favoriteRatings: user.favoriteRatings  // Muestra las valoraciones actualizadas
   };
} */



async toggleLibrary(userId: string, gameId: string) {
  const user = await this.userModel.findById(userId);

  if (!user) throw new NotFoundException('Usuario no encontrado');

  const gameObjectId = new Types.ObjectId(gameId);

  const index = user.library.findIndex((id) => id.equals(gameObjectId));

  if (index > -1) {
    user.library.splice(index, 1); // Eliminar si ya está
  } else {
    user.library.push(gameObjectId); // Agregar si no está
  }

  await user.save();

  const populatedUser = await this.userModel
    .findById(user._id)
    .populate({
    path: 'library',
    model: 'Game', // explícitamente
  });
    console.log(populatedUser?.library)

  return populatedUser;
}


  

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

 /*  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} auth`;
  } */

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken( payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;

  }


 
}
