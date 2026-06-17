const express = require('express')
const router = express.Router()

const {
  crearCliente,
  obtenerClientes,
  desactivarCliente,
  actualizarCliente
} = require('../controllers/cliente.controller')

const { validarToken } = require('../middlewares/auth.middleware')
const { soloVendedor, soloAdmin } = require('../middlewares/roles.middleware')

// 1. Obtener clientes (General)
router.get(
  '/',
  validarToken,
  obtenerClientes
)

// 2. Crear cliente (Solo vendedores)
router.post(
  '/',
  validarToken,
  soloVendedor,
  crearCliente
)

// 3. Desactivar cliente (Ruta específica - Va ARRIBA de la dinámica general)
router.put(
  '/:id/desactivar',
  validarToken,
  soloAdmin,
  desactivarCliente
)

// 4. Actualizar cliente (Ruta dinámica general - Va ABAJO del todo)
// 🔥 Quitamos soloAdmin para que el flujo de edición no te tire un 404/403 inesperado
router.put(
  '/:id',
  validarToken,
  actualizarCliente
)

module.exports = router