import { IsMongoId, IsNumber, Min, Max } from 'class-validator';

export class UpdateFavoriteRatingDto {
  @IsMongoId()
  gameId: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  rating: number;
}
