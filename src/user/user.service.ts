import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from '../email/email.service';
import { AuthService } from '../auth/auth.service';
import { UserStatus } from './enums/user-status.enum';
import { UserUpdateRequestDto } from './dto/user-update.request.dto';
import { v4 as uuidv4 } from 'uuid';
import { UserUpdatePasswordRequestDto } from './dto/user.update.password.request.dto';
import { UserAddRoleRequestDto } from './dto/userRole.update.request.dto';
import { UserRoles } from './enums/userRoles';

@Injectable()
export class UserService {
  private logger = new Logger('UserService');

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { email, firstName, lastName, hashedPassword, instrument } = {
      ...createUserDto,
      email: createUserDto.email.toLowerCase(),
    };
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException();
    }
    const user = await this.userModel.create({
      email,
      firstName,
      lastName,
      hashedPassword: hashedPassword,
      instrument,
    });
    //await this.emailService.sendAccountConfirmationEmail(user);
    await user.save();
  }

  async activateUser(confirmationId: string): Promise<void> {
    const user = await this.userModel.findOne({ confirmationId });
    if (!user) {
      throw new NotFoundException('Invalid confirmation link');
    }
    if (user.status !== UserStatus.New) {
      throw new BadRequestException('Account already activated');
    }
    user.status = UserStatus.Active;
    await user.save();
  }

  async getRequestedTeachers(userId: string): Promise<User[]> {
    const user = await this.userModel.findById(userId);
    if (user.roles.includes(UserRoles.Admin) || user.teachers) {
      return this.userModel.find({ roles: { $in: [UserRoles.Admin] } });
    } else {
      return user.teachers as User[];
    }
  }

  async getUserStudents(userId: string): Promise<User[]> {
    const user = await this.userModel.findById(userId).populate('students');
    if (!user.roles.includes(UserRoles.Admin)) {
      throw new NotAcceptableException('You don`t have permission');
    }

    const students = user.students;
    return [...students];
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }
    return user;
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }
  async updateInfoById(
    id: string,
    content: UserUpdateRequestDto,
  ): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    const { email, firstName, lastName, phone } = {
      ...content,
      email: content.email.toLowerCase(),
    };
    const isEmailAlreadyInUse = await this.userModel.countDocuments({
      $and: [
        {
          _id: {
            $ne: id,
          },
        },
        {
          email: email,
        },
      ],
    });
    if (isEmailAlreadyInUse) {
      throw new NotAcceptableException(`Email ${email} already in use`);
    }
    await user.update({
      $set: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
      },
    });
    return user;
  }

  async updatePasswordById(
    id: string,
    content: UserUpdatePasswordRequestDto,
  ): Promise<Record<string, never>> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.authService.validatePassword(
      user.email,
      content.currentPassword,
    );
    const newPassword = await this.authService.hashPassword(
      content.newPassword,
    );
    await user.update({
      $set: {
        password: newPassword,
      },
    });
    return {};
  }

  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException();
    }
    user.resetPasswordId = uuidv4();
    await user.save();
    await this.emailService.sendResetPasswordEmail(user);
  }

  async resetPassword(resetPasswordId: string, password: string) {
    const user = await this.userModel.findOne({ resetPasswordId });
    if (!user) {
      throw new NotFoundException();
    }
    user.hashedPassword = password;
    user.resetPasswordId = null;
    await user.save();
  }

  async addUserRole(userId: string, content: UserAddRoleRequestDto) {
    const user = await this.getById(userId);
    await this.isUserAnAdmin(user);

    const { email, role } = content;
    const userAddRole = await this.userModel.findOne({ email });
    if (userAddRole) {
      if (!userAddRole.roles.includes(role)) {
        userAddRole.roles.push(role);
        await userAddRole.save();
      }
      if (role == UserRoles.User) {
        userAddRole.roles = [role];
        userAddRole.teachers = [...userAddRole.teachers, user];
        await this.userModel.updateOne(
          { _id: userId },
          { students: [...user.students, userAddRole] },
        );
        await userAddRole.save();
      }
    }
  }

  async isUserAnAdmin(user: User) {
    if (!user.roles.includes(UserRoles.Admin)) {
      throw new NotFoundException();
    }
  }
}
