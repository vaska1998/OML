import { instrumentEnum } from '../enums/instrument.enum';

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  hashedPassword: string;
  instrument: instrumentEnum;
}
