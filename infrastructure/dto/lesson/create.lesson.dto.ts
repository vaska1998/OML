import {Instrument} from "../../constants/instruments";

export interface CreateLessonDto {
    studentId: string;
    instrument: Instrument;
    startDate: Date;
}
