import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Enumeraciones para Platform y Genre
/* export enum Genre {
  Action = "action",
  Adventure = "adventure",
  Racing = "racing",
  Indie = "indie"
} */

 export enum Genre {
    Action = "action",
    Indie = "indie",
    Adventure = "adventure",
    Shooter = "shooter",
    RPG = "rpg",
    Strategy = "strategy",
    Fighting = "fighting",
    Simulation = "simulation",
    Racing = "racing",
    Sports = "sports",
    Horror = "horror",
    Platformer = "platformer",
    Sandbox = "sandbox",
    Puzzle = "puzzle",
    MMORPG = "mmorpg",
    BattleRoyale = "battle royale",
    Stealth = "stealth",
    Survival = "survival",
    MusicRhythm = "music/rhythm",
    MOBA = "moba"
  }
  

/* export enum Platform {
  Ps4 = "PS4",
  Ps5 = "PS5",
} */

  export enum Platform {
    PS5 = "PS5",
    PS4 = "PS4",
    XboxSeriesX = "Xbox Series X",
    XboxSeriesS = "Xbox Series S",
    XboxOne = "Xbox One",
    Switch = "Nintendo Switch",
    PC = "PC",
    Mobile = "Mobile",
    Nintendo3DS = "Nintendo 3DS",
    WiiU = "Nintendo Wii U",
    Xbox360 = "Xbox 360",
    PSvita = "PlayStation Vita",
    PCVR = "PC VR",
    PlayStationVR = "PlayStation VR",
    SteamDeck = "Steam Deck",
    Stadia = "Google Stadia",
    Luna = "Amazon Luna",
    Mac = "Mac",
    Linux = "Linux"
  }
  

// Modelo de Game con Mongoose
@Schema({ timestamps: true }) // Agrega createdAt y updatedAt automáticamente
export class Game extends Document{

  /* @Prop({ required:true, unique:true})
  _id: string; */

  @Prop({ required:true, unique:true})
  uuid: string;
  
  @Prop({  required: true, unique: true })
  title: string;

  @Prop({ enum: Platform, required: true })
  platforms: Platform;

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

  @Prop({ default: false })
  isVisible: boolean;

}

// Genera el esquema de Mongoose
export const GameSchema = SchemaFactory.createForClass(Game);

/* GameSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
}); */

