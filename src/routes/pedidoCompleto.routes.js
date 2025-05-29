import { Router } from 'express'
import { confirmarPedido } from '../controladores/pedidoCompletoCtrl.js'

const router = Router()
router.post('/confirmar-pedido', confirmarPedido)
export default router
