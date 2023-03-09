import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
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
import { UserRoles } from './enums/userRoles';

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

  @Get('/roles')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Retrieve the current user`s roles',
  })
  @ApiOkResponse({
    description: 'Successfully retrieved current user`s roles',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  async getCurrentUserRoles(
    @GetUser() currentUser: CurrentUser,
  ): Promise<UserRoles[]> {
    const user = await this.userService.getById(currentUser.id);
    return user.roles;
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
