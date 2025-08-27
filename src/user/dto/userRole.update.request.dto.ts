import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { UserRoles } from '../enums/userRoles';

export class UserAddRoleRequestDto {
  @ApiProperty({
    description: 'User email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User role',
  })
  role: UserRoles;
}
