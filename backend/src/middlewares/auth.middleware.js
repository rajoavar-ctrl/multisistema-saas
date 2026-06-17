const jwt = require('jsonwebtoken')

const validarToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token requerido'
      })
    }

    const token = authHeader.split(' ')[1]

    const decoded = jwt.verify(
      token,
      'secreto_super_seguro'
    )

    

    req.usuario = decoded

    next()
  } catch (error) {
    
    return res.status(401).json({
      error: 'Token inválido'
    })
  }
}

module.exports = {
  validarToken
}