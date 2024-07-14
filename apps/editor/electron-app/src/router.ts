import { fs, window } from './features';
import { Router } from './utils';

export const router = new Router();
router.use(fs.router);
router.use(window.router);
