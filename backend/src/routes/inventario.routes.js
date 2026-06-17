const express = require('express')

const router = express.Router()

const {
  registrarMovimiento,
  obtenerMovimientos
} = require('../controllers/inventario.controller')

const {
  validarToken
} = require('../middlewares/auth.middleware')

const {
  soloAdmin
} = require('../middlewares/roles.middleware')

router.post(
  '/movimiento',
  validarToken,
  soloAdmin,
  registrarMovimiento
)

router.get(
  '/movimientos',
  validarToken,
  obtenerMovimientos
)

module.exports = router