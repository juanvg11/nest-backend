import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Enumeraciones para Platform y Genre
export enum Genre {
  Action = "Action",
  Adventure = "Adventure",
  Racing = "Racing",
  Indie = "Indie"
}

export enum Platform {
  Ps4 = "PS4",
  Ps5 = "PS5",
}

// Modelo de Game con Mongoose
@Schema({ timestamps: true }) // Agrega createdAt y updatedAt automáticamente
export class Game extends Document{
  
  @Prop({  required: true, unique: true })
  title: string;

  @Prop({ type: [String], enum: Platform, required: true })
  platforms: Platform[];

  @Prop({ required: true })
  developer: string;

  @Prop({ required: true })
  publisher: string;

  @Prop({ required: true })
  release_year: number;

  @Prop({ type: String, enum: Genre, required: true })
  genre: Genre;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], required: true })
  image: string[];

  @Prop({ default: false })
  favorite: boolean;

  @Prop({ required: true, min: 0, max: 10 })
  rating: number;
}

// Genera el esquema de Mongoose
export const GameSchema = SchemaFactory.createForClass(Game);
