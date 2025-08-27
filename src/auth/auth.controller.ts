import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupReqDto } from './dto/signup.req.dto';
import { SignInReqDto } from './dto/signin.req.dto';
import { SignInResDto } from './dto/signin.res.dto';
import { RequestPasswordResetResDto } from './dto/reset-password-reset.req.dto';
import { ResetPasswordReqDto } from './dto/reset-password.req.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Signup a new user by providing the details of this profile',
  })
  @ApiCreatedResponse({
    description: 'Sing up successfully',
  })
  async signup(@Body() singupReqDto: SignupReqDto): Promise<void> {
    await this.authService.signup(singupReqDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'SignIn user with valid credentials',
  })
  @ApiCreatedResponse({
    description: 'SingIn successfully',
  })
  async signIn(@Body() signInReqDto: SignInReqDto): Promise<SignInResDto> {
    return await this.authService.singIn(signInReqDto);
  }

  @Get('/confirm/:confirmationId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Confirm the email address of user, must be called after /signup',
  })
  @ApiOkResponse({
    description: 'Successfully confirmed the email address of user',
    type: void 0,
  })
  @ApiNotFoundResponse({
    description: 'Invalid confirmation link',
    type: void 0,
  })
  @ApiBadRequestResponse({
    description: 'Expired confirmation link',
    type: void 0,
  })
  async confirm(
    @Param('confirmationId') confirmationId: string,
  ): Promise<void> {
    await this.authService.confirmAccount(confirmationId);
  }

  @Post('/request-password-reset')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request password reset by email',
  })
  @ApiCreatedResponse({
    description: 'Reset password request email successfully sent',
  })
  async requestPasswordReset(
    @Body() requestPasswordResetResDto: RequestPasswordResetResDto,
  ): Promise<void> {
    return this.authService.requestPasswordReset(requestPasswordResetResDto);
  }

  @Post('/reset-password')
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset password by providing email and reset hash',
  })
  @ApiOkResponse({
    description: 'Successfully reset password',
  })
  async resetPassword(
    @Body() resetPasswordReqDto: ResetPasswordReqDto,
  ): Promise<void> {
    return this.authService.passwordReqReset(resetPasswordReqDto);
  }
}
