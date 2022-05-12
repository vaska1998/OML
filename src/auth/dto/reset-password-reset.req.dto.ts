import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

@ApiTags('Request')
export class RequestPasswordResetResDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email of user',
    default: 'new.student@email.com',
  })
  email: string;
}
