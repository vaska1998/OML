import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.model';
import * as bcrypt from 'bcrypt';
import { SignupReqDto } from './dto/signup.req.dto';
import { SignInReqDto } from './dto/signin.req.dto';
import { UserStatus } from '../user/enums/user-status.enum';
import { JwtPayload } from './jwt-payload.interface';
import { SignInResDto } from './dto/signin.res.dto';
import { RequestPasswordResetResDto } from './dto/reset-password-reset.req.dto';
import { ResetPasswordReqDto } from './dto/reset-password.req.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signupRequestDto: SignupReqDto): Promise<void> {
    const { password } = signupRequestDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await this.userService.createUser({
      hashedPassword,
      ...signupRequestDto,
    });
  }

  async singIn(signInReqDto: SignInReqDto): Promise<SignInResDto> {
    const { email, password } = signInReqDto;
    const user = await this.validatePassword(email, password);
    if (user.status != UserStatus.Active) {
      throw new NotAcceptableException('Email address not confirmed yet');
    }
    return {
      token: this.generateAccessToken(user),
    };
  }

  generateAccessToken(user: User): string {
    const { email, _id, firstName, lastName, roles } = user;
    const payload: JwtPayload = {
      id: _id,
      email,
      firstName,
      lastName,
      roles,
    };
    return this.jwtService.sign(payload);
  }

  async validatePassword(email: string, password: string): Promise<User> {
    const foundUser = await this.userService.getByEmail(email);
    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches) {
      throw new BadRequestException();
    }
    return foundUser;
  }

  async confirmAccount(confirmationId: string): Promise<void> {
    await this.userService.activateUser(confirmationId);
  }

  async requestPasswordReset(
    requestPasswordResetResDto: RequestPasswordResetResDto,
  ): Promise<void> {
    const { email } = requestPasswordResetResDto;
    await this.userService.requestPasswordReset(email);
  }

  async passwordReqReset(
    resetPasswordReqDto: ResetPasswordReqDto,
  ): Promise<void> {
    const { resetPasswordId, password } = resetPasswordReqDto;
    const hashedPassword = await this.hashPassword(password);
    await this.userService.resetPassword(resetPasswordId, hashedPassword);
  }

  async hashPassword(passwordString: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(passwordString, salt);
  }
}
