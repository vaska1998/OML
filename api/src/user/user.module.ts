import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserMongooseModule } from './user.model';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';
@Module({
  imports: [UserMongooseModule, EmailModule, forwardRef(() => AuthModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
