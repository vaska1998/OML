import {UserRoles} from "../../constants/roles";
import {Instrument} from "../../constants/instruments";

export type UserListResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: UserRoles[];
    instrument: Instrument[];
}
