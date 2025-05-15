import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Types } from "mongoose"
import { Game } from "src/games/entities/game.entity"


@Schema()
export class User{

_id?: string 

@Prop({unique: true, required: true})
email: string

@Prop({required: true})
name: string

@Prop({minlength: 6, required: true})   
password?: string

@Prop({default: true})
isActive: boolean

@Prop({type: [String], default: ['user']})
roles: string[]

@Prop({ type: [{ type: Types.ObjectId, ref: 'Game' }], default: [] })
  library: Types.ObjectId[];

@Prop({ type: [{ type: Types.ObjectId, ref: 'Game' }], default: [] })
  favorites: Types.ObjectId[];




  
   /* Probando rating GPT */
   
  
   
  }
  
  
  export const UserSchema = SchemaFactory.createForClass(User);
  
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }]
  
  
  /*  @Prop({
   type: [{
     gameId: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
     rating: { type: Number, min: 0, max: 10 },
     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
   }],
   default: []
 })
 favoriteRatings: {
   gameId: Types.ObjectId;
   rating: number;
   userId: Types.ObjectId;
 }[]; */
  