export interface EmailRecipient {
  firstName: string;
  lastName: string;
  email: string;
}
export interface AccountConfirmationData {
  email: string;
  substitutions: [
    { var: 'name'; value: string },
    { var: 'activationLink'; value: string },
  ];
}
export interface ResetPasswordData {
  email: string;
  substitutions: [
    { var: 'name'; value: string },
    { var: 'resetPasswordLink'; value: string },
  ];
}
