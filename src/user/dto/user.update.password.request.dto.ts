import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';
import { UserConstants } from '../user.constants';

export class UserUpdatePasswordRequestDto {
  @ApiProperty({
    description: 'Current user`s password',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'New user`s password',
  })
  @MinLength(UserConstants.Validation.Password.minLength)
  @MaxLength(UserConstants.Validation.Password.maxLength)
  newPassword: string;
}
