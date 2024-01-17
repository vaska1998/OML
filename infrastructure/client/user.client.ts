import {_RootClient} from "./_root.client";
import {ProxyClient} from "./proxy/proxy";
import {ClientResponse} from "./response";
import {UserUpdateResponse} from "../dto/profile/user.update.response";
import {UserUpdateRequest} from "../dto/profile/user.update.request";
import {UpdatePasswordRequest} from "../dto/profile/update.password.request";
import {UserRoles} from "../constants/roles";
import { UpdateUserRoleRequest } from "../dto/profile/update.role.request";
import {TeacherListResponse} from "../dto/profile/teacher.list.response";

export class UserClient extends _RootClient {
    constructor(proxy: ProxyClient) {
        super(proxy);
    }

    getCurrent(): Promise<ClientResponse<UserUpdateResponse>> {
        return this.proxy.get('/user/current');
    }

    getTeachers(): Promise<ClientResponse<TeacherListResponse[]>> {
        return this.proxy.get('/user/teachers');
    }

    updateCurrent(content: UserUpdateRequest): Promise<ClientResponse<UserUpdateResponse>> {
        return this.proxy.put('/user/current', content);
    }

    updateRole(content: UpdateUserRoleRequest): Promise<ClientResponse<Record<string, never>>> {
        return this.proxy.post('/user/addRole', content)
    }

    updatePassword(content: UpdatePasswordRequest): Promise<ClientResponse<Record<string, never>>> {
        return this.proxy.put('/user/password', content);
    }

    deleteCurrent(): Promise<ClientResponse<UserUpdateResponse>> {
        return this.proxy.del('/user/delete');
    }
}
