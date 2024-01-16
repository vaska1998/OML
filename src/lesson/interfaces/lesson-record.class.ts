import { Prop } from '@nestjs/mongoose';
import { RecordStatus } from '../enums/record-status.enum';
import { RecordFailedReason } from '../enums/record-failed-reson.enum';
import { v4 as uuid } from 'uuid';

export class LessonRecordParticipantSid {
  @Prop()
  participantSid: string;

  @Prop()
  timestamp: number;
}

export class LessonRecordSequence {
  @Prop()
  isRecordingActive: boolean;

  @Prop()
  timestamp: number;
}

export class LessonRecord {
  @Prop()
  id: string;

  @Prop()
  roomSid: string;

  @Prop({ default: () => true })
  recordingActive: boolean;

  @Prop({
    required: true,
    type: () => [LessonRecordParticipantSid],
    _id: false,
  })
  userIdToParticipant: Map<string, LessonRecordParticipantSid[]>;

  @Prop({
    required: true,
    default: [],
  })
  recordingSequences: LessonRecordSequence[];

  @Prop({ required: true, enum: RecordStatus, type: String })
  status: RecordStatus;

  @Prop({ required: true, default: true })
  allowRecording: boolean;

  @Prop({ required: true })
  updatedAt: Date;

  @Prop()
  compositionSid?: string;

  @Prop({ type: Date })
  recordStartTime?: Date;

  @Prop()
  percentageProcessed?: number;

  @Prop()
  size?: number;

  @Prop()
  remainingTimeInSeconds?: number;

  @Prop()
  durationInSeconds?: number;

  @Prop()
  compositionUrl?: string;

  @Prop()
  mediaUrl?: string;

  @Prop()
  failedReason?: string;

  @Prop()
  failedReasonType?: RecordFailedReason;

  @Prop()
  processStartAt?: Date;

  @Prop()
  processFinishAt?: Date;

  public static fromRoomSid(roomSid: string): LessonRecord {
    const id = uuid();
    return {
      id,
      roomSid,
      recordingActive: false,
      userIdToParticipant: new Map(),
      recordingSequences: [
        {
          isRecordingActive: false,
          timestamp: Date.now(),
        },
      ],
      status: RecordStatus.Null,
      allowRecording: true,
      updatedAt: new Date(),
    };
  }
}
