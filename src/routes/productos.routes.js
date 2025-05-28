import { Router } from 'express';
import {
  getProductos,
  getProductoxid,
  putProducto,
  patchProducto,
  deleteProducto,
  postProdu,
  patchEstadoProducto,
  patchImagenProducto // nuevo controlador
} from '../controladores/productosCtrl.js';

import multer from 'multer';

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });
const router = Router();

router.get('/productos', getProductos);
router.get('/productos/:id', getProductoxid);
router.put('/productos/:id', upload.single('prod_imagen'), putProducto);
router.patch('/productos/:id', upload.single('prod_imagen'), patchProducto);
router.patch('/productos/estado/:id', patchEstadoProducto);
router.patch('/productos/imagen/:id', upload.single('prod_imagen'), patchImagenProducto); // NUEVO
router.delete('/productos/:id', deleteProducto);
router.post('/productos', upload.single('prod_imagen'), postProdu);

export default router;
