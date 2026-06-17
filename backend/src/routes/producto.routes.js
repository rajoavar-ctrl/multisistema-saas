const express = require('express')

const router = express.Router()

const {
  crearProducto,
  obtenerProductos,
  descontinuarProducto,
  entradaInventario,
  obtenerMovimientos
} = require('../controllers/producto.controller')

const {
  validarToken
} = require('../middlewares/auth.middleware')

const {
  soloAdmin,
  soloVendedor
} = require('../middlewares/roles.middleware')

router.post(
  '/',
  validarToken,
  soloAdmin,
  crearProducto
)

router.get(
  '/',
  validarToken,
  soloVendedor,
  obtenerProductos
)

router.delete(
  '/:id',
  validarToken,
  soloAdmin,
  descontinuarProducto
)

router.post(
  '/entrada/:id',
  validarToken,
  soloAdmin,
  entradaInventario
)

router.get(
  '/movimientos/:id',
  validarToken,
  obtenerMovimientos
)
module.exports = router