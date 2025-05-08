import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Types } from "mongoose"


@Schema()
export class User {

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

}

export const UserSchema = SchemaFactory.createForClass(User);