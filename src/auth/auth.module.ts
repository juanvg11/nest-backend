import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Game, GameSchema } from 'src/games/entities/game.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forFeature([
          {
            name: User.name,
            schema: UserSchema
          },
          //{ name: Game.name, schema: GameSchema },

        ]),

        JwtModule.register({
          global: true,
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '6h' },
        }),
  ],
})
export class AuthModule {}
