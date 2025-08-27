import {_RootClient} from "./_root.client";
import {ProxyClient} from "./proxy/proxy";
import {ClientResponse} from "./response";
import {LessonListResponse} from "../dto/lesson/lesson.list.response";

export class LessonClient extends _RootClient {
    constructor(proxy: ProxyClient) {
        super(proxy);
    }

    getMy(): Promise<ClientResponse<LessonListResponse[]>> {
        return this.proxy.get('/lesson/my');
    }
}
