import { Controller, Get, HttpCode, HttpStatus, Logger, UseGuards } from "@nestjs/common";
import { LessonService } from "./lesson.service";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { LessonResDto } from "./dto/lesson.res.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { GetUser } from "../auth/decorators/get-user.decorstor";
import { CurrentUser } from "../auth/current-user.type";

@Controller('lesson')
export class LessonController {
  private logger = new Logger('LessonController');
  constructor(private readonly lessonService: LessonService) {}

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
    return this.lessonService.getLessonsForCurrentUser(currentUser.id);
  }
}
