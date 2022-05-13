import {Instrument} from "../../constants/instruments";

export type AuthRegisterRequest = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    instrument: Instrument;
}
