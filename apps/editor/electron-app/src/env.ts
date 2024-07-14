import path from 'node:path';

import { config } from 'dotenv';
import envVar from 'env-var';

config({
  path: path.join(__dirname, '../.env'),
});

export const env = {
  nodeEnv: envVar.get('NODE_ENV').default('development').asString(),
  staticKey: envVar.get('STATIC_KEY').required().asString(),
  appFile: envVar.get('APP_FILE').required().asString(),
  appUrl: envVar.get('APP_URL').required().asString(),
};
