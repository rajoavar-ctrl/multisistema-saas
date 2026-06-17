const express = require('express')

const router = express.Router()

const {
  obtenerCuotas
} = require('../controllers/cuota.controller')

const {
  validarToken
} = require('../middlewares/auth.middleware')

const {
  soloCobrador
} = require('../middlewares/roles.middleware')

router.get(
  '/',
  validarToken,
  soloCobrador,
  obtenerCuotas
)

module.exports = router