import {AuthClient} from "./auth.client";
import {UserClient} from "./user.client";
import {ProxyClient} from "./proxy/proxy";
import {LessonClient} from "./lesson.client";

export type ClientManagerType = {
    auth: AuthClient;
    user: UserClient;
    lesson: LessonClient;
};

export const createClientManager = (proxy: ProxyClient): ClientManagerType => ({
    auth: new AuthClient(proxy),
    user: new UserClient(proxy),
    lesson: new LessonClient(proxy),
});

let _manager: ClientManagerType | null = null;

export const getClientManager = (): ClientManagerType => {
    if (_manager == null) {
        throw 'Client manager not invited!';
    }
    return _manager;
};

export const setClientManager = (proxy: ProxyClient): ClientManagerType => {
    _manager = {
        auth: new AuthClient(proxy),
        user: new UserClient(proxy),
        lesson: new LessonClient(proxy),
    };
    return _manager;
};
