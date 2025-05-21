import { Router } from 'express'
import {
    getPedidosDetalle,
    getPedidosDetallexid,
    postPedidosDetalle,
    putPedidosDetalle,
    patchPedidosDetalle,
    deletePedidosDetalle
} from '../controladores/pedidosdetalleCtrl.js'
import { verifyToken } from '../middlewares/verifiTkn.js'

const router = Router()

router.get('/pedidos_detalle',verifyToken,  getPedidosDetalle)
router.get('/pedidos_detalle/:id',verifyToken,  getPedidosDetallexid)
router.post('/pedidos_detalle', postPedidosDetalle)
router.put('/pedidos_detalle/:id',verifyToken,  putPedidosDetalle)
router.patch('/pedidos_detalle/:id',verifyToken,  patchPedidosDetalle)
router.delete('/pedidos_detalle/:id',verifyToken,  deletePedidosDetalle)

export default router