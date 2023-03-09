import { User } from '../user.model';
import { ApiProperty } from '@nestjs/swagger';

export class UserResDto {
  public static encode(user: User): UserResDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user._id,
      phone: user.phone,
    };
  }

  @ApiProperty({
    description: 'ID of user',
  })
  public id: string;

  @ApiProperty({
    description: 'First Name',
  })
  public firstName: string;

  @ApiProperty({
    description: 'Last Name',
  })
  public lastName: string;

  @ApiProperty({
    description: 'Email address',
  })
  public email: string;

  @ApiProperty({
    description: 'Phone number',
  })
  public phone: string;
}
