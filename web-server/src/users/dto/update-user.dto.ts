import { BaseUserDto } from './base-user.dto';

export class UpdateUserDto extends BaseUserDto {
  favoriteFoods: string[];
  updatedAt: Date;
}
