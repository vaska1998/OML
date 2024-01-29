import {_RootClient} from "./_root.client";
import {ProxyClient} from "./proxy/proxy";
import {ClientResponse} from "./response";
import {LessonResDto} from "../dto/lesson/lesson.res.dto";
import {CreateLessonDto} from "../dto/lesson/create.lesson.dto";

export class LessonClient extends _RootClient {
    constructor(proxy: ProxyClient) {
        super(proxy);
    }

    getMyLessons(): Promise<ClientResponse<LessonResDto>> {
        return this.proxy.get('/lesson/my');
    }

    create(content: CreateLessonDto) {
        return this.proxy.post('/lesson/create', content);
    }
}
