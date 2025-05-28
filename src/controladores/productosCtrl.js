import { conmysql } from '../BD.js'
import fs from 'fs';


// Obtener todos los productos
export const getProductos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM productos')
        res.json({ cant: result.length, data: result })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}




// Obtener producto por ID
export const getProductoxid = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            'SELECT * FROM productos WHERE prod_id = ?',
            [req.params.id]
        )
        if (result.length <= 0)
            return res.status(404).json({ message: "Producto no encontrado" })

        res.json(result[0])
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

// Insertar nuevo producto
export const postProducto = async (req, res) => {
    try {
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo,
            prod_imagen
        } = req.body

        const [result] = await conmysql.query(
            `INSERT INTO productos 
            (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
        )

        res.send({ prod_id: result.insertId })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

export const postProdu = async (req, res) => {
    try {
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body
        const prod_imagen = req.file ? `uploads/${req.file.filename}` : null;

        const [result] = await conmysql.query(
            `INSERT INTO productos 
            (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen]
        );

        res.status(201).json({ prod_id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: error })

    }

}

// Actualizar todo el producto (PUT)
export const putProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

        // Obtener el producto actual
        const [productoActual] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id=?', [id]);
        if (productoActual.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

        let nuevaImagen = productoActual[0].prod_imagen;

        // Si se subió una nueva imagen
        if (req.file) {
            nuevaImagen = `uploads/${req.file.filename}`;
            // Borrar la anterior si existe
            if (productoActual[0].prod_imagen && fs.existsSync(productoActual[0].prod_imagen)) {
                fs.unlinkSync(productoActual[0].prod_imagen);
            }
        }

        // Actualizar en la base de datos
        const [result] = await conmysql.query(
            `UPDATE productos SET 
                prod_codigo=?, 
                prod_nombre=?, 
                prod_stock=?, 
                prod_precio=?, 
                prod_activo=?, 
                prod_imagen=? 
            WHERE prod_id=?`,
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, nuevaImagen, id]
        );

        if (result.affectedRows <= 0)
            return res.status(404).json({ message: "Producto no encontrado" });

        const [row] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// Actualizar parcialmente (PATCH)
export const patchProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;

        // Obtener producto actual
        const [productoActual] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id=?', [id]);
        if (productoActual.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

        let nuevaImagen = null;

        // Si hay nueva imagen, procesarla
        if (req.file) {
            nuevaImagen = `uploads/${req.file.filename}`;

            // Borrar la anterior si existe
            if (productoActual[0].prod_imagen && fs.existsSync(productoActual[0].prod_imagen)) {
                fs.unlinkSync(productoActual[0].prod_imagen);
            }
        }

        // Construcción dinámica del query y valores
        const campos = [];
        const valores = [];

        if (prod_codigo !== undefined) {
            campos.push('prod_codigo=?');
            valores.push(prod_codigo);
        }
        if (prod_nombre !== undefined) {
            campos.push('prod_nombre=?');
            valores.push(prod_nombre);
        }
        if (prod_stock !== undefined) {
            campos.push('prod_stock=?');
            valores.push(prod_stock);
        }
        if (prod_precio !== undefined) {
            campos.push('prod_precio=?');
            valores.push(prod_precio);
        }
        if (prod_activo !== undefined) {
            campos.push('prod_activo=?');
            valores.push(prod_activo);
        }
        if (nuevaImagen !== null) {
            campos.push('prod_imagen=?');
            valores.push(nuevaImagen);
        }

        if (campos.length === 0) {
            return res.status(400).json({ message: "No se enviaron campos para actualizar" });
        }

        const sql = `UPDATE productos SET ${campos.join(', ')} WHERE prod_id=?`;
        valores.push(id);

        const [result] = await conmysql.query(sql, valores);

        if (result.affectedRows <= 0)
            return res.status(404).json({ message: "Producto no encontrado" });

        const [row] = await conmysql.query('SELECT * FROM productos WHERE prod_id=?', [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

//cambiar estado
export const patchEstadoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { prod_activo } = req.body;

        if (prod_activo === undefined)
            return res.status(400).json({ message: "Estado 'prod_activo' no proporcionado" });

        const [result] = await conmysql.query(
            'UPDATE productos SET prod_activo = ? WHERE prod_id = ?',
            [prod_activo, id]
        );

        if (result.affectedRows <= 0)
            return res.status(404).json({ message: "Producto no encontrado" });

        const [row] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

export const patchImagenProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const [producto] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
    if (producto.length === 0)
      return res.status(404).json({ message: "Producto no encontrado" });

    let nuevaImagen = producto[0].prod_imagen;

    if (req.file) {
      nuevaImagen = `uploads/${req.file.filename}`;

      // Borrar imagen anterior si existe
      if (producto[0].prod_imagen && fs.existsSync(producto[0].prod_imagen)) {
        fs.unlinkSync(producto[0].prod_imagen);
      }
    } else {
      return res.status(400).json({ message: "No se recibió nueva imagen" });
    }

    const [result] = await conmysql.query(
      'UPDATE productos SET prod_imagen = ? WHERE prod_id = ?',
      [nuevaImagen, id]
    );

    if (result.affectedRows <= 0)
      return res.status(404).json({ message: "No se pudo actualizar la imagen" });

    const [row] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
    res.json(row[0]);
  } catch (error) {
    return res.status(500).json({ message: "Error en el servidor" });
  }
};


// Eliminar producto
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Obtener información del producto
        const [producto] = await conmysql.query('SELECT prod_imagen FROM productos WHERE prod_id = ?', [id]);

        if (producto.length === 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        const imagenPath = producto[0].prod_imagen;

        // 2. Eliminar la imagen del disco si existe
        if (imagenPath && fs.existsSync(imagenPath)) {
            fs.unlinkSync(imagenPath);
        }

        // 3. Eliminar de la base de datos
        const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id = ?', [id]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.sendStatus(204); // Eliminado correctamente sin contenido
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}
