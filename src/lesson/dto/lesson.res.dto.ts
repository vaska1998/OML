import { LessonStatusEnum } from '../enums/lesson-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { instrumentEnum } from '../../user/enums/instrument.enum';

export class LessonResDto {
  @ApiProperty({
    description: 'ID of lesson',
  })
  public id: string;

  @ApiProperty({
    description: 'Lesson status',
  })
  public status: LessonStatusEnum;

  @ApiProperty({
    description: 'Teacher`s First name',
  })
  public teacherFirstName: string;

  @ApiProperty({
    description: 'Teacher`s Last name',
  })
  public teacherLastName: string;

  @ApiProperty({
    description: 'Student`s First name',
  })
  public studentFirstName?: string;

  @ApiProperty({
    description: 'Student`s Last name',
  })
  public studentLastName?: string;

  @ApiProperty({
    description: 'Instrument',
  })
  public instrument: instrumentEnum;

  @ApiProperty({
    description: 'Start Date',
  })
  public startDate: Date;
}
