import { Router } from 'express';
import authCtrl from '../controladores/authCtrl.js';

const router = Router();

router.post('/login', authCtrl.login);
router.post('/registrar', authCtrl.registrar);

export default router;

