import {Instrument} from "../../constants/instruments";
import {UserRoles} from "../../constants/roles";

export type AuthRegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    instrument: Instrument;
}
