import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './lesson.model';
import { Model } from 'mongoose';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UserService } from '../user/user.service';
import { generateRandomBase62 } from '../utils';
import { LessonStatusEnum } from './enums/lesson-status.enum';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
    private readonly userService: UserService,
  ) {}

  async createLesson(
    teacherId: string,
    createLessonDto: CreateLessonDto,
  ): Promise<Lesson> {
    const { instrument, startDate } = createLessonDto;
    const user = await this.userService.getById(teacherId);
    await this.userService.isUserAnAdmin(user);
    const lesson = await this.lessonModel.create({
      teacherId: user._id,
      instrument: instrument,
      startDate: startDate,
      status: LessonStatusEnum.Scheduled,
      shareToken: generateRandomBase62(6),
    });
    await lesson.save();
    return lesson.populate('teacherId');
  }

  async getLessonsForCurrentUser(userId: string): Promise<Lesson[]> {
    return await this.lessonModel
      .find({
        $and: [
          {
            $or: [{ teacherId: userId }, { studentId: userId }],
          },
          { status: LessonStatusEnum.Scheduled },
        ],
      })
      .sort({ startDate: 1 })
      .populate('teacherId')
      .populate('studentId')
      .exec();
  }

  async deleteLessonById(userId: string, lessonId: string): Promise<void> {
    const lesson = await this.lessonModel
      .findById(lessonId)
      .populate('studentId')
      .populate('teacherId')
      .exec();
    if (!lesson) {
      throw new NotFoundException('Lesson was not found');
    }

    if (lesson.studentId?._id || lesson.teacherId._id !== userId) {
      throw new NotAcceptableException('You don`t have permission');
    }

    await this.lessonModel.deleteOne({ _id: lessonId });
  }
}
