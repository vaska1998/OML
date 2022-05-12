import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as MailerSend from 'mailersend';
import { Recipient, EmailParams } from 'mailersend';
import { User } from '../user/user.model';
import { AccountConfirmationData, ResetPasswordData } from './email.interface';
import { EmailConstants } from './email.constants';

@Injectable()
export class EmailService {
  private logger = new Logger('EmailService');
  private sender: MailerSend;
  private readonly clientBaselUrl: string;
  private fromNoReply: string;

  constructor(private readonly configService: ConfigService) {
    this.sender = new MailerSend({
      api_key: configService.get('MAILERSEND_TOKEN'),
    });
    this.clientBaselUrl = configService.get('CLIENT_BASEURL');
    this.fromNoReply = configService.get('FROM_EMAIL_NOREPLY');
  }

  async sendAccountConfirmationEmail(user: User) {
    const { email, firstName, lastName, confirmationId } = user;
    const recipients = [new Recipient(email, `${firstName} ${lastName}`)];
    const variables: AccountConfirmationData[] = [
      {
        email,
        substitutions: [
          {
            var: 'name',
            value: firstName,
          },
          {
            var: 'activationLink',
            value: `${this.clientBaselUrl}/auth/confirm/${confirmationId}`,
          },
        ],
      },
    ];
    const emailParams = new EmailParams()
      .setFrom(this.fromNoReply)
      .setFromName(EmailConstants.Envelopes.Default.Name)
      .setRecipients(recipients)
      .setVariables(variables)
      .setSubject(EmailConstants.Templates.AccountConfirmationTemplate.Subject)
      .setTemplateId(
        EmailConstants.Templates.AccountConfirmationTemplate.TemplateId,
      );
    // this.sender.send(emailParams).catch((err) => {
    //   this.logger.error(err);
    // });
    console.log(emailParams);
  }

  async sendResetPasswordEmail(user: User) {
    const { email, firstName, lastName, resetPasswordId } = user;
    if (!resetPasswordId) {
      throw new BadRequestException();
    }
    const recipients = [new Recipient(email, `${firstName} ${lastName}`)];
    const variables: ResetPasswordData[] = [
      {
        email,
        substitutions: [
          {
            var: 'name',
            value: firstName,
          },
          {
            var: 'resetPasswordLink',
            value: `${this.clientBaselUrl}/auth/reset-password${resetPasswordId}`,
          },
        ],
      },
    ];
    const emailParams = new EmailParams()
      .setFrom(this.fromNoReply)
      .setFromName(EmailConstants.Envelopes.Default.Name)
      .setRecipients(recipients)
      .setVariables(variables)
      .setSubject(EmailConstants.Templates.AccountConfirmationTemplate.Subject)
      .setTemplateId(EmailConstants.Templates.ResetPasswordData.TemplateId);

    this.sender.send(emailParams).catch((err) => {
      this.logger.error(err);
    });
    console.log(emailParams);
  }
}
