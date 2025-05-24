import { conmysql } from '../BD.js'
export const obtenerClientes = (req, res) => {
    res.send('Lista de clientes');
}
export const getClientes = async (req, res) => {
    try {
        const [result] = await conmysql.query(' select * from clientes ')
        res.json({ cant: result.length, data: result })
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

//retorna cliente por id
export const getClientesxid = async (req, res) => {
    //res.send('clientes x id');
    try {
        //const miID=[req.params.id];
        const [result] = await conmysql.query(' select * from clientes where cli_id=? ', [req.params.id])
        //res.json({cant:result.length, data: result})
        if (result.length <= 0) return res.status(400).json({
            cli_id: 0,
            message: " Cliente no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

//insertar
export const postClientes = async (req, res) => {
    try {
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad } = req.body
        //console.log(req.body)
        const [result] = await conmysql.query('INSERT INTO clientes(cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad) VALUES (?,?,?,?,?,?,?)',
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad])
        res.send({
            id: result.insertId
        })

    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

//fun para actualizar
export const putClientes = async (req, res) => {
    try {
        const { id } = req.params
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad } = req.body
        //console.log(req.body)
        const [result] = await conmysql.query('UPDATE clientes SET cli_identificacion=?, cli_nombre=?, cli_telefono=?, cli_correo=?, cli_direccion=?, cli_pais=?, cli_ciudad=? WHERE cli_id=?',
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, id])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: " cliente no encontrado"
        })
        const [row] = await conmysql.query(' select * from clientes where cli_id=? ', [id])
        res.json(row[0])

    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

export const patchClientes = async (req, res) => {
    try {
        const { id } = req.params
        const { cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad } = req.body
        //console.log(req.body)
        const [result] = await conmysql.query('UPDATE clientes SET cli_identificacion=IFNULL(?, cli_identificacion), cli_nombre=IFNULL(?, cli_nombre), cli_telefono=IFNULL(?, cli_telefono), cli_correo=IFNULL(?, cli_correo), cli_direccion=IFNULL(?, cli_direccion), cli_pais=IFNULL(?, cli_pais), cli_ciudad=IFNULL(?, cli_ciudad) WHERE cli_id=?',
            [cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad, id])
        if (result.affectedRows <= 0) return res.status(404).json({
            message: " cliente no encontrado"
        })
        const [row] = await conmysql.query(' select * from clientes where cli_id=? ', [id])
        res.json(row[0])

    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

//fun para eliminar
export const deleteCliente = async (req, res) => {
    //res.send('clientes x id');
    try {
        //const miID=[req.params.id];
        const [result] = await conmysql.query(' delete from clientes where cli_id=? ', [req.params.id])
        //res.json({cant:result.length, data: result})
        if (result.length <= 0) return res.status(400).json({
            message: " Cliente no encontrado"
        })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: "error en el servidor" })
    }
}

export const patchEstadoCliente = async (req, res) => {
    const { id } = req.params

  try {
    // Verificar si existe
    const [cliente] = await pool.query('SELECT * FROM clientes WHERE id_cli = ?', [id])

    if (cliente.length === 0) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' })
    }

    // Cambiar estado a 'E'
    await pool.query('UPDATE clientes SET cli_estado = ? WHERE id_cli = ?', ['E', id])

    res.json({ mensaje: 'Cliente desactivado correctamente' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al desactivar el cliente' })
  }
};

/*INSERT INTO clientes(cli_identificacion, cli_nombre, cli_telefono, cli_correo, cli_direccion, cli_pais, cli_ciudad) 
VALUES (?,?,?,?,?,?,?)*/

/*UPDATE clientes SET 
cli_identificacion='0978126548', cli_nombre='Raul', cli_telefono='0928294510', cli_correo='no_se@nose.nose', 
cli_direccion='no se', cli_pais='Ecuador', cli_ciudad='Santa Elena' WHERE cli_id=33; */