import express from 'express'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
//importar las rutas ojo
import clientesRoutes from './routes/clientes.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import pedidosdetalleRoutes from './routes/pedidosdetalle.routes.js'
import productosRoutes from './routes/productos.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import authRoutes from './routes/auth.routes.js';
import confirmarPedidoRoutes from './routes/pedidoCompleto.routes.js'

//definir los modulos de entrada
const __filemane=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filemane);

//definir los permisos 
const corsOption={
    origin:'*',//la direccion de dominio del servidor
    methods:['GET',' POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}

const app=express();
app.use(cors(corsOption));
app.use(express.json()); //interpretar objetos json
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static(path.join(__dirname,'../uploads')))
//indicar que rutas se utilizan ojo
app.use('/api', clientesRoutes)
app.use('/api', pedidosRoutes)
app.use('/api', pedidosdetalleRoutes)
app.use('/api', productosRoutes)
app.use('/api', usuariosRoutes)
app.use('/api/auth', authRoutes);
app.use('/api', confirmarPedidoRoutes)

app.use((red,resp,next)=>{
    resp.status(400).json({
        message: 'Endpoint not found'
    })
})
export default app;