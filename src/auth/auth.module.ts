import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthConstants } from './auth.constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: AuthConstants.Jwt.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
