import {LessonStatusEnum} from "../../constants/lesson-status";

export type LessonListResponse = {
    lessonStart: Date;
    coachFirstName: string;
    coachLastName: string;
    studentFirstName: string;
    studentLastName: string;
    lessonStatus: LessonStatusEnum;
}
