import {UserRoles} from "../../constants/roles";

export type UpdateUserRoleRequest = {
    email: string;
    role: UserRoles;
}