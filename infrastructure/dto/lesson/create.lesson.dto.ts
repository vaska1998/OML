import {Instrument} from "../../constants/instruments";

export interface CreateLessonDto {
    instrument: Instrument;
    startDate: Date;
}
