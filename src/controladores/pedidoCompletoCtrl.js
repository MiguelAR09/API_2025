import { conmysql } from '../BD.js'

// Confirmar un pedido con todos sus detalles
export const confirmarPedido = async (req, res) => {
    const { cli_id, usr_id, productos } = req.body
    const ped_estado = '1'
    const ped_fecha = new Date()

    const conn = await conmysql.getConnection()
    try {
        await conn.beginTransaction()

        // 1. Insertar pedido
        const [pedidoResult] = await conn.query(
            'INSERT INTO pedidos (cli_id, ped_estado, ped_fecha, usr_id) VALUES (?, ?, ?, ?)',
            [cli_id, ped_estado, ped_fecha, usr_id]
        )
        const ped_id = pedidoResult.insertId

        // 2. Insertar detalles y actualizar stock
        for (const item of productos) {
            const { prod_id, det_cantidad, det_precio } = item

            // Insertar en pedidos_detalle
            await conn.query(
                'INSERT INTO pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)',
                [prod_id, ped_id, det_cantidad, det_precio]
            )

            // Actualizar stock
            await conn.query(
                'UPDATE productos SET prod_stock = prod_stock - ? WHERE prod_id = ?',
                [det_cantidad, prod_id]
            )
        }

        await conn.commit()
        res.status(201).json({ success: true, message: 'Pedido confirmado', ped_id })
    } catch (error) {
        await conn.rollback()
        res.status(500).json({ success: false, message: 'Error al confirmar pedido', error })
    } finally {
        conn.release()
    }
}
