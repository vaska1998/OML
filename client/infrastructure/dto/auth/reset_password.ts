export type ResetPasswordRequestDto = {
    email: string;
};

export type ResetPasswordConfirmRequestDto = {
    resetPasswordId: string;
    password: string;
};
