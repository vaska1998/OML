import { User } from '../user.model';
import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../enums/userRoles';
import { instrumentEnum } from '../enums/instrument.enum';

export class UserResDto {
  public static encode(user: User): UserResDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      id: user._id,
      phone: user.phone,
      instrument: user.instrument,
      roles: user.roles,
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

  @ApiProperty({
    description: 'User roles',
  })
  public roles: UserRoles[];

  @ApiProperty({
    description: 'Instruments',
  })
  public instrument: instrumentEnum[];
}
