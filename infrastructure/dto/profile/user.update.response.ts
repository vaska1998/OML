import {UserUpdateRequest} from "./user.update.request";

export type UserUpdateResponse = UserUpdateRequest & {
    email: string;
}
