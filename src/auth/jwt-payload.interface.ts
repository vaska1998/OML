import { UserRoles } from '../user/enums/userRoles';
import { instrumentEnum } from '../user/enums/instrument.enum';

export interface JwtPayload {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  roles: UserRoles[];
  instrument: instrumentEnum[];
}
