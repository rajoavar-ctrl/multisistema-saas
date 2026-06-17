const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth.routes')
const testRoutes = require('./routes/test.routes')
const usuarioRoutes = require('./routes/usuario.routes')
const perfilRoutes = require('./routes/perfil.routes')
const clienteRoutes = require('./routes/cliente.routes')
const productoRoutes = require('./routes/producto.routes')
const ventaRoutes = require('./routes/venta.routes')
const pagoRoutes = require('./routes/pago.routes')
const cuotaRoutes = require('./routes/cuota.routes')
const dashboardRoutes = require('./routes/dashboard.routes')
const inventarioRoutes = require('./routes/inventario.routes')

const app = express()

app.use(cors())

app.use(express.json())

app.use('/', testRoutes)

app.use('/usuarios', usuarioRoutes)

app.use('/auth', authRoutes)

app.use('/perfil', perfilRoutes)

app.use('/clientes', clienteRoutes)

app.use('/productos', productoRoutes)

app.use('/ventas', ventaRoutes)

app.use('/pagos', pagoRoutes)

app.use('/cuotas', cuotaRoutes)

app.use('/dashboard', dashboardRoutes)

app.use('/inventario', inventarioRoutes)

module.exports = app