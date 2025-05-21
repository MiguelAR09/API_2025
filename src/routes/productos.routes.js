import { Router } from 'express'
import {
    getProductos,
    getProductoxid,
    //postProducto,
    putProducto,
    patchProducto,
    deleteProducto,
    postProdu
} from '../controladores/productosCtrl.js'
import multer from 'multer';
import { verifyToken } from '../middlewares/verifiTkn.js'
//configurar multer para almacenar imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');//carpeta donde se guardan las imagenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload=multer({storage});
const router = Router()

router.get('/productos', verifyToken, getProductos)
router.get('/productos/:id', verifyToken, getProductoxid)
//router.post('/productos', postProducto)
router.put('/productos/:id', verifyToken, putProducto)
router.patch('/productos/:id', verifyToken, patchProducto)
router.delete('/productos/:id', verifyToken, deleteProducto)
router.post('/productos', upload.single('prod_imagen'), verifyToken, postProdu)
export default router
