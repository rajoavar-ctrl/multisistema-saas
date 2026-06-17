const soloAdmin = (req, res, next) => {
  const rol = req.usuario.rol

  if (rol === 'admin' || rol === 'superadmin') {
    return next()
  }

  return res.status(403).json({
    error: 'Acceso denegado'
  })
}

const soloVendedor = (req, res, next) => {
  const rol = req.usuario.rol

  if (
    rol === 'vendedor' ||
    rol === 'admin' ||
    rol === 'superadmin'
  ) {
    return next()
  }

  return res.status(403).json({
    error: 'Acceso denegado'
  })
}

const soloCobrador = (req, res, next) => {
  const rol = req.usuario.rol

  if (
    rol === 'cobrador' ||
    rol === 'admin' ||
    rol === 'superadmin'
  ) {
    return next()
  }

  return res.status(403).json({
    error: 'Acceso denegado'
  })
}

module.exports = {
  soloAdmin,
  soloVendedor,
  soloCobrador
}