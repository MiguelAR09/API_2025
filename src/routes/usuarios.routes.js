import { Router } from 'express'
import {
    getUsuarios,
    getUsuariosxid,
    postUsuarios,
    putUsuarios,
    patchUsuarios,
    deleteUsuario
} from '../controladores/usuariosCtrl.js'
import { verifyToken } from '../middlewares/verifiTkn.js'

const router = Router()

router.get('/usuarios', verifyToken,  getUsuarios)
router.get('/usuarios/:id', verifyToken, getUsuariosxid)
router.post('/usuarios', verifyToken, postUsuarios)
router.put('/usuarios/:id', verifyToken, putUsuarios)
router.patch('/usuarios/:id', verifyToken, patchUsuarios)
router.delete('/usuarios/:id', verifyToken, deleteUsuario)

export default router
