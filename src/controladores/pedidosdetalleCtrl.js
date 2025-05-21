import { conmysql } from '../BD.js'

// Obtener todos los detalles de pedidos
export const getPedidosDetalle = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM pedidos_detalle')
        res.json({ cant: result.length, data: result })
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

// Obtener un detalle por ID
export const getPedidosDetallexid = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            'SELECT * FROM pedidos_detalle WHERE det_id = ?',
            [req.params.id]
        )
        if (result.length <= 0)
            return res.status(404).json({ message: "Detalle no encontrado" })

        res.json(result[0])
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

// Insertar nuevo detalle
export const postPedidosDetalle = async (req, res) => {
    try {
        const { prod_id, ped_id, det_cantidad, det_precio } = req.body
        const [result] = await conmysql.query(
            'INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)',
            [prod_id, ped_id, det_cantidad, det_precio]
        )
        res.send({ det_id: result.insertId })
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

// Actualizar todos los campos
export const putPedidosDetalle = async (req, res) => {
    try {
        const { id } = req.params
        const { prod_id, ped_id, det_cantidad, det_precio } = req.body
        const [result] = await conmysql.query(
            'UPDATE pedidos_detalle SET prod_id=?, ped_id=?, det_cantidad=?, det_precio=? WHERE det_id=?',
            [prod_id, ped_id, det_cantidad, det_precio, id]
        )
        if (result.affectedRows <= 0)
            return res.status(404).json({ message: "Detalle no encontrado" })

        const [row] = await conmysql.query(
            'SELECT * FROM pedidos_detalle WHERE det_id=?',
            [id]
        )
        res.json(row[0])
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

// Actualizar parcialmente (PATCH)
export const patchPedidosDetalle = async (req, res) => {
    try {
        const { id } = req.params
        const { prod_id, ped_id, det_cantidad, det_precio } = req.body
        const [result] = await conmysql.query(
            `UPDATE pedidos_detalle 
             SET prod_id = IFNULL(?, prod_id),
                 ped_id = IFNULL(?, ped_id),
                 det_cantidad = IFNULL(?, det_cantidad),
                 det_precio = IFNULL(?, det_precio)
             WHERE det_id = ?`,
            [prod_id, ped_id, det_cantidad, det_precio, id]
        )
        if (result.affectedRows <= 0)
            return res.status(404).json({ message: "Detalle no encontrado" })

        const [row] = await conmysql.query(
            'SELECT * FROM pedidos_detalle WHERE det_id=?',
            [id]
        )
        res.json(row[0])
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

// Eliminar detalle
export const deletePedidosDetalle = async (req, res) => {
    try {
        const [result] = await conmysql.query(
            'DELETE FROM pedidos_detalle WHERE det_id = ?',
            [req.params.id]
        )
        if (result.affectedRows <= 0)
            return res.status(404).json({ message: "Detalle no encontrado" })

        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}
