import { conmysql } from '../BD.js'
import jwt from 'jsonwebtoken'

const SECRET = 'CLAVE_SUPER_SECRETA'

export const login = async (req, res) => {
  const { usr_usuario, usr_clave } = req.body

  try {
    const [result] = await conmysql.query(
      'SELECT * FROM usuarios WHERE usr_usuario = ?',
      [usr_usuario]
    )

    if (result.length === 0)
      return res.status(401).json({ message: 'Usuario no encontrado' })

    const user = result[0]

    // Comparación directa (sin convertir ni transformar nada)
    if (usr_clave !== user.usr_clave) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    // Si coincide, generamos token
    const token = jwt.sign({ id: user.usr_id }, SECRET, { expiresIn: '1h' })

    res.json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error en el servidor' })
  }
}
