import {Router} from 'express'
import {getClientes, getClientesxid, postClientes, putClientes, patchClientes, deleteCliente, patchEstadoCliente} from '../controladores/clientesCtrl.js'
const router=Router();
//armar las rutas "URL"
router.get('/clientes',getClientes)
router.get('/clientes/:id',getClientesxid)
router.post('/clientes', postClientes)
router.put('/clientes/:id',putClientes)
router.patch('/clientes/:id',patchClientes)
router.delete('/clientes/:id',deleteCliente)
router.patch('/clientes/estado/:id', patchEstadoCliente);

export default router