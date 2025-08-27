import * as crypto from 'crypto';

export const generateRandomBase62 = (length: number): string => {
  const buffer = crypto.randomBytes(Math.ceil((length * 4) / 3));
  return buffer
    .toString('base64')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, length);
};
