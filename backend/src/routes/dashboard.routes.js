const express = require('express')

const router = express.Router()

const {
  resumenDashboard
} = require('../controllers/dashboard.controller')

const {
  validarToken
} = require('../middlewares/auth.middleware')

router.get(
  '/resumen',
  validarToken,
  resumenDashboard
)

module.exports = router