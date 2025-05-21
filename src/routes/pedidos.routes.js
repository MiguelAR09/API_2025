import { Router } from 'express'
import { getPedidos, getPedidosxid, postPedidos, putPedidos, patchPedidos, deletePedido } from '../controladores/pedidosCtrl.js'
import { verifyToken } from '../middlewares/verifiTkn.js'
const router = Router()

router.get('/pedidos', verifyToken, getPedidos)
router.get('/pedidos/:id', verifyToken, getPedidosxid)
router.post('/pedidos', verifyToken, postPedidos)
router.put('/pedidos/:id', verifyToken, putPedidos)
router.patch('/pedidos/:id', verifyToken, patchPedidos)
router.delete('/pedidos/:id', verifyToken, deletePedido)

export default router
