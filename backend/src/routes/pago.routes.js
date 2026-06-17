const express = require('express')

const router = express.Router()

const {
  registrarPago
} = require('../controllers/pago.controller')

const {
  validarToken
} = require('../middlewares/auth.middleware')

const {
  soloCobrador
} = require('../middlewares/roles.middleware')

router.post(
  '/',
  validarToken,
  soloCobrador,
  registrarPago
)

module.exports = router