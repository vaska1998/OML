import { UserRoles } from '../user/enums/userRoles';

export interface JwtPayload {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  roles: UserRoles[];
}
