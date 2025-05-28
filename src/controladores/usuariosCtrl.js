import { conmysql } from '../BD.js'
import bcrypt from 'bcryptjs';

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM usuarios')
        res.json({ cant: result.length, data: result })
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

// Obtener usuario por ID
export const getUsuariosxid = async (req, res) => {
    try {
        const [result] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id = ?', [req.params.id])
        if (result.length <= 0) return res.status(400).json({
            usr_id: 0,
            message: "Usuario no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}

// Insertar usuario
export const postUsuarios = async (req, res) => {
    try {
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        // Cifrar la contraseña si se proporcionó
        let hashedPassword = null;
        if (usr_clave) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(usr_clave, salt);
        }

        const [result] = await conmysql.query(
            'INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?, ?, ?, ?, ?, ?)',
            [usr_usuario, hashedPassword, usr_nombre, usr_telefono, usr_correo, usr_activo]
        );

        res.send({ id: result.insertId });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// Actualizar usuario
export const putUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        let hashedPassword = usr_clave;
        if (usr_clave) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(usr_clave, salt);
        }

        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario=?, usr_clave=?, usr_nombre=?, usr_telefono=?, usr_correo=?, usr_activo=? WHERE usr_id=?',
            [usr_usuario, hashedPassword, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Usuario no encontrado" });

        const [row] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id=?', [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// Actualización parcial
export const patchUsuarios = async (req, res) => {
    try {
        const { id } = req.params;
        let { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        // Si se quiere actualizar la contraseña, cifrarla
        if (usr_clave) {
            const salt = await bcrypt.genSalt(10);
            usr_clave = await bcrypt.hash(usr_clave, salt);
        }

        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario=IFNULL(?, usr_usuario), usr_clave=IFNULL(?, usr_clave), usr_nombre=IFNULL(?, usr_nombre), usr_telefono=IFNULL(?, usr_telefono), usr_correo=IFNULL(?, usr_correo), usr_activo=IFNULL(?, usr_activo) WHERE usr_id=?',
            [usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id]
        );

        if (result.affectedRows <= 0) return res.status(404).json({ message: "Usuario no encontrado" });

        const [row] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id=?', [id]);
        res.json(row[0]);
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
}

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
    try {
        const [result] = await conmysql.query('DELETE FROM usuarios WHERE usr_id = ?', [req.params.id])
        if (result.affectedRows <= 0) return res.status(400).json({ message: "Usuario no encontrado" })
        res.sendStatus(204)
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" })
    }
}
