import { Router } from 'express'
import { login } from '../controladores/autentificacionCtrl.js'

const router = Router()

router.post('/login', login)

export default router