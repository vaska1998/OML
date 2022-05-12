import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AuthConstants } from '../auth.constants';
import { instrumentEnum } from '../../user/enums/instrument.enum';

export class SignupReqDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email of user',
    default: 'new.student@email.com',
  })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'First name of user',
    default: 'Thomas',
  })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Last name of user',
    default: 'Anderson',
  })
  lastName: string;

  @IsString()
  @MinLength(AuthConstants.Validation.Password.minLength)
  @MaxLength(AuthConstants.Validation.Password.maxLength)
  @Matches(AuthConstants.Validation.Password.regex, {
    message: 'Password is too weak!',
  })
  @ApiProperty({
    description: 'Plaintext password of user',
    default: 'Password1!',
  })
  password: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'Instrument',
    default: 'Guitar',
  })
  instrument: instrumentEnum;
}
