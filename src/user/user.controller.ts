import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserResDto } from './dto/user.res.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.type';
import { GetUser } from '../auth/decorators/get-user.decorstor';
import { UserUpdateRequestDto } from './dto/user-update.request.dto';
import { UserUpdatePasswordRequestDto } from './dto/user.update.password.request.dto';
import { UserAddRoleRequestDto } from './dto/userRole.update.request.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  private logger = new Logger('AuthController');
  constructor(private readonly userService: UserService) {}

  @Get('/current')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve the current user',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved current user',
    type: UserResDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @GetUser() currentUser: CurrentUser,
  ): Promise<UserResDto> {
    const user = await this.userService.getById(currentUser.id);
    return UserResDto.encode(user);
  }

  @Post('/addRole')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Add role for user',
  })
  @ApiOkResponse({
    description: 'Successfully added new role to the user',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async addUserRole(
    @GetUser() currentUser: CurrentUser,
    @Body() content: UserAddRoleRequestDto,
  ): Promise<Record<string, never>> {
    await this.userService.addUserRole(currentUser.id, content);
    return {};
  }

  @Put('/current')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current user profile',
  })
  @ApiOkResponse({
    description: 'User`s profile updated',
    type: UserResDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async updateCurrentUser(
    @GetUser() currentUser: CurrentUser,
    @Body() content: UserUpdateRequestDto,
  ): Promise<UserResDto> {
    const user = await this.userService.updateInfoById(currentUser.id, content);
    this.logger.log(`Updating user ${currentUser.id} info`);
    return UserResDto.encode(user);
  }

  @Get('/teachers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all teachers',
  })
  @ApiOkResponse({
    description: 'All requested teachers',
    type: [UserResDto],
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async getRequestedTeachers(
    @GetUser() currentUser: CurrentUser,
    @Body() onlyMy: boolean,
  ): Promise<UserResDto[]> {
    const teachers = await this.userService.getRequestedTeachers(
      currentUser.id,
      onlyMy,
    );
    return teachers.map((teacher) => {
      return UserResDto.encode(teacher);
    });
  }

  @Put('/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update current user password',
  })
  @ApiOkResponse({
    description: 'User`s password updated',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @ApiBadRequestResponse({
    description: 'Wrong current password',
  })
  @UseGuards(JwtAuthGuard)
  async updatedCurrentPassword(
    @GetUser() currentUser: CurrentUser,
    @Body() content: UserUpdatePasswordRequestDto,
  ): Promise<Record<string, never>> {
    this.logger.log(`Updating user ${currentUser?.id} password`);
    await this.userService.updatePasswordById(currentUser?.id, content);
    return {};
  }
}
