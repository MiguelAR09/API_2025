import { conmysql } from '../BD.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authCtrl = {};

authCtrl.login = async (req, res) => {
    const { usr_usuario, usr_clave } = req.body;

    if (!usr_usuario || !usr_clave) {
        return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
        const [rows] = await conmysql.query('SELECT * FROM usuarios WHERE usr_usuario = ? AND usr_activo = 1', [usr_usuario]);

        if (rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado o inactivo' });

        const usuario = rows[0];
        const isMatch = await bcrypt.compare(usr_clave, usuario.usr_clave);

        if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign(
            { usr_id: usuario.usr_id, usr_usuario: usuario.usr_usuario, usr_nombre: usuario.usr_nombre },
            'secreto123', // Usa una variable de entorno en producción
            { expiresIn: '1h' }
        );

        return res.json({ token, usuario });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

authCtrl.registrar = async (req, res) => {
    const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo } = req.body;

    if (!usr_usuario || !usr_clave || !usr_nombre || !usr_correo) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    try {
        const hash = await bcrypt.hash(usr_clave, 10);
        const sql = `INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?, ?, ?, ?, ?, ?)`;

        await conmysql.query(sql, [usr_usuario, hash, usr_nombre, usr_telefono || '', usr_correo, 1]);

        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'El usuario ya existe' });
        }
        return res.status(500).json({ error: error.message });
    }
};

export default authCtrl;
