import * as Joi from '@hapi/joi';
import { join } from 'path';

export const configValidationSchema = Joi.object({
  ENV: Joi.string().default('local'),
  MONGO_URI: Joi.string().required(),
  APP_PORT: Joi.number().default(3000),
  CLIENT_BASEURL: Joi.string().required(),
});
