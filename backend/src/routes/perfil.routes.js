const express = require('express')

const router = express.Router()

const {
  soloAdmin
} = require('../middlewares/roles.middleware')

const {
  validarToken
} = require('../middlewares/auth.middleware')

router.get('/', validarToken, soloAdmin, (req, res) => {
  res.json({
    mensaje: 'Ruta protegida',
    usuario: req.usuario
  })
})

module.exports = router