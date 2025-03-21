import { IsString, IsNumber, IsBoolean, IsArray, IsEnum, IsOptional, Min, Max, ArrayMinSize } from 'class-validator';
import { Genre, Platform } from '../entities/game.entity';

export class CreateGameDto {
  @IsString()
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(Platform, { each: true })
  platforms: Platform[];

  @IsString()
  developer: string;

  @IsString()
  publisher: string;

  @IsNumber()
  @Min(1950)
  @Max(new Date().getFullYear())
  release_year: number;

  @IsEnum(Genre)
  genre: Genre;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  image: string[];

  @IsBoolean()
  favorite: boolean;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
}

