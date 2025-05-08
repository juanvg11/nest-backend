import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model, Types } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { LoginUserDto, CreateUserDto, RegisterUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';



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
    const user = await this.userModel.findOne({ email });
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
    return this.userModel.find();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const { password: _, ...userData } = user.toJSON();
    return userData;
  }

  async addGameToLibrary(userId: string, gameId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
  
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    const objectId = new Types.ObjectId(gameId);
  
    const alreadyInLibrary = user.library.some(id => id.equals(objectId));
    if (alreadyInLibrary) {
      throw new BadRequestException('Game already in library');
    }
  
    user.library.push(objectId);
    await user.save();
  
    return user;
  }

  async removeGameFromLibrary(userId: string, gameId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    user.library = user.library.filter(id => id.toString() !== gameId);
    await user.save();
  
    return user;
  }
  

  async getUserLibrary(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).populate('library');
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    return user;
  }

  async toggleFavorite(userId: string, gameId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
  
    const gameObjectId = new Types.ObjectId(gameId);
  
    const index = user.favorites.findIndex(fav => fav.equals(gameObjectId));
  
    if (index >= 0) {
      // Si ya está, lo quitamos
      user.favorites.splice(index, 1);
    } else {
      // Si no está, lo agregamos
      user.favorites.push(gameObjectId);
    }
  
    await user.save();
  
    return user.populate('favorites'); // ← Si quieres devolver los juegos ya populados
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
