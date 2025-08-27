import { instrumentEnum } from '../../user/enums/instrument.enum';

export interface CreateLessonDto {
  instrument: instrumentEnum;
  startDate: Date;
}
