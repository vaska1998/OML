import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@ApiTags('Request')
export class SignInReqDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email of user',
    default: 'new.student@email.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Plaintext password of user',
    default: 'Password1!',
  })
  password: string;
}
