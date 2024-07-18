import path from 'node:path';

import { config } from 'dotenv';
import envVar from 'env-var';

config({
  path: path.join(__dirname, '../../.env'),
});

export const env = {
  electronRendererUrl: envVar.get('ELECTRON_RENDERER_URL').asString(),
  staticKey: envVar.get('STATIC_KEY').required().asString(),
};
