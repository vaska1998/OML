import {_RootClient} from "./_root.client";
import {ProxyClient} from "./proxy/proxy";
import {ClientResponse} from "./response";
import {UserUpdateResponse} from "../dto/profile/user.update.response";
import {UserUpdateRequest} from "../dto/profile/user.update.request";
import {UpdatePasswordRequest} from "../dto/profile/update.password.request";
import {UserRoles} from "../constants/roles";

export class UserClient extends _RootClient {
    constructor(proxy: ProxyClient) {
        super(proxy);
    }

    getCurrent(): Promise<ClientResponse<UserUpdateResponse>> {
        return this.proxy.get('/user/current');
    }

    getRoles(): Promise<ClientResponse<UserRoles[]>> {
        return this.proxy.get('/user/roles');
    }

    updateCurrent(content: UserUpdateRequest): Promise<ClientResponse<UserUpdateResponse>> {
        return this.proxy.put('/user/current', content);
    }

    updatePassword(content: UpdatePasswordRequest): Promise<ClientResponse<Record<string, never>>> {
        return this.proxy.put('/user/password', content);
    }

    deleteCurrent(): Promise<ClientResponse<UserUpdateResponse>> {
        return this.proxy.del('/user/delete');
    }
}
