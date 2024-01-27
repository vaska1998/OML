import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './lesson.model';
import { Model } from 'mongoose';
import { LessonResDto } from './dto/lesson.res.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UserService } from '../user/user.service';
import base62 from 'base62-random';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
    private readonly userService: UserService,
  ) {}

  async createLesson(createLessonDto: CreateLessonDto): Promise<void> {
    const { teacherId, instrument, startDate } = createLessonDto;
    const user = await this.userService.getById(teacherId);
    await this.userService.isUserAnAdmin(user);
    const lesson = await this.lessonModel.create({
      teacherId: user,
      instrument,
      startDate,
      shareToken: base62(6),
    });
    await lesson.save();
  }

  async getLessonsForCurrentUser(userId: string): Promise<LessonResDto[]> {
    const lessons = await this.lessonModel.find({
      $or: [{ teacherId: userId, studentId: userId }],
    });
    const lessonsRes: LessonResDto[] = [];
    (lessons as Lesson[]).forEach((lesson) => {
      const result: LessonResDto = {
        id: lesson._id,
        status: lesson.status,
        teacherFirstName: lesson.teacherId.firstName,
        teacherLastName: lesson.teacherId.lastName,
        studentFirstName: lesson.studentId.firstName,
        studentLastName: lesson.studentId.lastName,
      };
      lessonsRes.push(result);
    });

    return lessonsRes;
  }
}
