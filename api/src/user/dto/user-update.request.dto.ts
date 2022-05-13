import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { UserConstants } from '../user.constants';

export class UserUpdateRequestDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User first name',
  })
  @IsString()
  @MinLength(UserConstants.Validation.FirstName.minLength)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
  })
  @MinLength(UserConstants.Validation.LastName.minLength)
  lastName: string;
}
