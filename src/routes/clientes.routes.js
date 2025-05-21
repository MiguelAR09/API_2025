import {Router} from 'express'
import {getClientes, getClientesxid, postClientes, putClientes, patchClientes, deleteCliente} from '../controladores/clientesCtrl.js'
import { verifyToken } from '../middlewares/verifiTkn.js'
const router=Router();
//armar las rutas "URL"
router.get('/clientes',verifyToken, getClientes)
router.get('/clientes/:id',verifyToken, getClientesxid)
router.post('/clientes',verifyToken, postClientes)
router.put('/clientes/:id',verifyToken, putClientes)
router.patch('/clientes/:id',verifyToken, patchClientes)
router.delete('/clientes/:id',verifyToken, deleteCliente)

export default router