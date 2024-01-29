import {LessonStatusEnum} from "../../constants/lesson.status";
import {Instrument} from "../../constants/instruments";

export interface LessonResDto {
    id: string;
    status: LessonStatusEnum;
    teacherFirstName: string;
    teacherLastName: string;
    studentFirstName?: string;
    studentLastName?: string;
    instrument: Instrument;
    startDate: Date;
}
