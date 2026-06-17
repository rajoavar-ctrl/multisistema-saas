const express = require('express')

const router = express.Router()

const {
  crearVenta
} = require('../controllers/venta.controller')

const {
  validarToken
} = require('../middlewares/auth.middleware')

const {
  soloVendedor
} = require('../middlewares/roles.middleware')

router.post(
  '/',
  validarToken,
  soloVendedor,
  crearVenta
)

module.exports = router