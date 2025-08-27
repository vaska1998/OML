import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LessonResDto } from './dto/lesson.res.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorstor';
import { CurrentUser } from '../auth/current-user.type';
import { CreateLessonDto } from './dto/create-lesson.dto';

@Controller('lesson')
export class LessonController {
  private logger = new Logger('LessonController');
  constructor(private readonly lessonService: LessonService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create a new lessons',
  })
  @ApiOkResponse({
    description: 'Successfully created a new lesson',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async createLesson(
    @GetUser() currentUser: CurrentUser,
    @Body() content: CreateLessonDto,
  ): Promise<LessonResDto> {
    this.logger.log('Creating new lesson');
    const lesson = await this.lessonService.createLesson(
      currentUser.id,
      content,
    );
    return LessonResDto.encode(lesson);
  }

  @Get('/my')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get lessons for the current user',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved lessons for the current user',
    type: LessonResDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async getCurrentUserLessons(
    @GetUser() currentUser: CurrentUser,
  ): Promise<LessonResDto[]> {
    const lessons = await this.lessonService.getLessonsForCurrentUser(
      currentUser.id,
    );
    return lessons.map((lesson) => LessonResDto.encode(lesson));
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete lesson by id',
  })
  @ApiOkResponse({
    description: 'Succesfully deleted lesson by id',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async deleteLessonById(
    @GetUser() currentUser: CurrentUser,
    @Param('id') id: string,
  ): Promise<Record<string, never>> {
    await this.lessonService.deleteLessonById(currentUser.id, id);
    return {};
  }
}
