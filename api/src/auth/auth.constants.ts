export const AuthConstants = {
  Validation: {
    Password: {
      minLength: 8,
      maxLength: 32,
      regex: RegExp(
        '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+,.\\/;:"-]).{8,}$',
      ),
    },
  },
  Jwt: {
    validInSeconds: 30 * 24 * 60 * 60,
    secret: 'jwt-secret',
  },
};
