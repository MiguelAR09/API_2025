import jwt from 'jsonwebtoken'

const SECRET = 'CLAVE_SUPER_SECRETA'

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]

  if (!token) return res.status(403).json({ message: 'Token requerido' })

  try {
    const decoded = jwt.verify(token, SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}