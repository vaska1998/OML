import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.model';
import { instrumentEnum } from '../user/enums/instrument.enum';
import { LessonStatusEnum } from './enums/lesson-status.enum';
import { LessonRecord } from './interfaces/lesson-record.class';

@Schema()
export class Lesson {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Prop({
    type: String,
    enum: LessonStatusEnum,
    default: LessonStatusEnum.Open,
    required: true,
  })
  status: LessonStatusEnum;

  @Prop({ type: [String], ref: () => User })
  teacherId: User;

  @Prop({ type: [String], ref: () => User, default: null })
  studentId?: User;

  @Prop({ type: String, enum: instrumentEnum })
  instrument: instrumentEnum;

  @Prop()
  startDate: Date;

  @Prop()
  lessonStart: Date;

  @Prop({ _id: false })
  teachingSessionRecord: LessonRecord;

  @Prop()
  shareToken: string;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);

export const LessonMongooseModule = MongooseModule.forFeature([
  { name: Lesson.name, schema: LessonSchema },
]);
