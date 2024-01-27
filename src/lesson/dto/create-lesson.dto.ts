import { instrumentEnum } from '../../user/enums/instrument.enum';

export interface CreateLessonDto {
  teacherId: string;
  instrument: instrumentEnum;
  startDate: Date;
}
