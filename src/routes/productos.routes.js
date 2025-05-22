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

router.get('/productos', getProductos)
router.get('/productos/:id', getProductoxid)
//router.post('/productos', postProducto)
router.put('/productos/:id', putProducto)
router.patch('/productos/:id', patchProducto)
router.delete('/productos/:id', deleteProducto)
router.post('/productos', upload.single('prod_imagen'), postProdu)
export default router
