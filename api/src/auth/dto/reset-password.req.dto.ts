import { ApiProperty, ApiTags } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { AuthConstants } from '../auth.constants';

@ApiTags('Request')
export class ResetPasswordReqDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'resetPasswordId as a string',
    default: '74104cf2-0935-41a9-9f6b-3dd347402ee8',
  })
  resetPasswordId: string;

  @IsString()
  @MinLength(AuthConstants.Validation.Password.minLength)
  @MaxLength(AuthConstants.Validation.Password.maxLength)
  @Matches(AuthConstants.Validation.Password.regex, {
    message: 'Password is to weak!',
  })
  @ApiProperty({
    description: 'Plaintext password of user',
    default: 'Password!#',
  })
  password: string;
}
