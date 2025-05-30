import { conmysql } from '../BD.js'

export const getPedidos = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM pedidos')
        res.json({ cant: result.length, data: result })
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

export const getPedidosxid = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id = ?', [req.params.id])
        if (result.length <= 0) return res.status(400).json({ ped_id: 0, message: "Pedido no encontrado" })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

export const postPedidos = async (req, res) => {
    try {
        const { cli_id, ped_estado, ped_fecha, usr_id } = req.body
        const [result] = await conmysql.query(
            'INSERT INTO pedidos(cli_id, ped_estado, ped_fecha, usr_id) VALUES (?, ?, ?, ?)',
            [cli_id, ped_estado, ped_fecha, usr_id]
        )
        res.send({ id: result.insertId })
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

export const putPedidos = async (req, res) => {
    try {
        const { id } = req.params
        const { cli_id, ped_estado, ped_fecha, usr_id } = req.body
        const [result] = await conmysql.query(
            'UPDATE pedidos SET cli_id=?, ped_estado=?, ped_fecha=?, usr_id=? WHERE ped_id=?',
            [cli_id, ped_estado, ped_fecha, usr_id, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({ message: "Pedido no encontrado" })
        const [row] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id=?', [id])
        res.json(row[0])
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

export const patchPedidos = async (req, res) => {
    try {
        const { id } = req.params
        const { cli_id, ped_estado, ped_fecha, usr_id } = req.body
        const [result] = await conmysql.query(
            'UPDATE pedidos SET cli_id=IFNULL(?, cli_id), ped_estado=IFNULL(?, ped_estado), ped_fecha=IFNULL(?, ped_fecha), usr_id=IFNULL(?, usr_id) WHERE ped_id=?',
            [cli_id, ped_estado, ped_fecha, usr_id, id]
        )
        if (result.affectedRows <= 0) return res.status(404).json({ message: "Pedido no encontrado" })
        const [row] = await conmysql.query('SELECT * FROM pedidos WHERE ped_id=?', [id])
        res.json(row[0])
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}




export const deletePedido = async (req, res) => {
    try {
        const [result] = await conmysql.query('DELETE FROM pedidos WHERE ped_id=?', [req.params.id])
        if (result.affectedRows <= 0) return res.status(400).json({ message: "Pedido no encontrado" })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}
import { conmysql } from '../BD.js';

export const confirmarPedido = async (req, res) => {
  const { cliente_id, carrito } = req.body;
  const usuario_id = req.usuario.usr_id; // <- asegúrate que req.usuario exista y tenga usr_id

  if (!cliente_id || !Array.isArray(carrito) || carrito.length === 0) {
    return res.status(400).json({ mensaje: 'Datos incompletos' });
  }

  const conn = await conmysql.getConnection(); // <- usas `conmysql`, no `pool`
  try {
    await conn.beginTransaction();

    const [pedidoResult] = await conn.query(
      'INSERT INTO pedidos (cli_id, usr_id, ped_fecha, ped_estado) VALUES (?, ?, NOW(), ?)',
      [cliente_id, usuario_id, 1] // ped_estado = 1 por defecto
    );

    const pedidoId = pedidoResult.insertId;

    for (let item of carrito) {
      await conn.query(
        'INSERT INTO pedidos_detalle (ped_id, prod_id, det_cantidad, det_precio) VALUES (?, ?, ?, ?)',
        [pedidoId, item.prod_id, item.cantidad, item.prod_precio]
      );

      await conn.query(
        'UPDATE productos SET prod_stock = prod_stock - ? WHERE prod_id = ?',
        [item.cantidad, item.prod_id]
      );
    }

    await conn.commit();
    res.json({ mensaje: 'Pedido confirmado', pedido_id: pedidoId });
  } catch (err) {
    await conn.rollback();
    console.error('Error al confirmar pedido:', err);
    res.status(500).json({ mensaje: 'Error al confirmar pedido' });
  } finally {
    conn.release();
  }
};
