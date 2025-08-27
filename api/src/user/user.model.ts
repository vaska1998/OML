import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { instrumentEnum } from './enums/instrument.enum';
import { UserRoles } from './enums/userRoles';
import { UserStatus } from './enums/user-status.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;

  @Prop()
  email: string;

  @Prop({ type: String, default: null })
  avatar: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: String, default: null })
  phone: string;

  @Prop({ type: [String], enum: instrumentEnum })
  instrument: instrumentEnum[];

  @Prop({ default: [UserRoles.User] })
  roles: UserRoles[];

  @Prop({
    default: uuidv4(),
  })
  confirmationId: string;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.New })
  status: UserStatus;

  @Prop()
  hashedPassword: string;

  @Prop({
    default: null,
  })
  resetPasswordId?: string;

  @Prop({
    default: [],
  })
  students: User[];

  @Prop({
    default: [],
  })
  teachers: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserMongooseModule = MongooseModule.forFeature([
  { name: User.name, schema: UserSchema },
]);
