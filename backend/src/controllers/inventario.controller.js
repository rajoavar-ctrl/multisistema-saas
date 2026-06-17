const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const registrarMovimiento = async (req, res) => {
  try {

    const {
      productoId,
      tipoMovimiento,
      cantidad,
      motivo
    } = req.body

    const usuarioId = req.usuario.id

    const producto =
      await prisma.producto.findUnique({
        where: {
          id: Number(productoId)
        }
      })

    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      })
    }

    const stockAnterior = producto.stock

    let nuevoStock = producto.stock

    

    if (
      tipoMovimiento === 'entrada'
    ) {
      nuevoStock += Number(cantidad)
    }

    if (
      tipoMovimiento === 'salida'
    ) {
      nuevoStock -= Number(cantidad)
    }

    if (
      tipoMovimiento === 'ajuste'
    ) {
      nuevoStock = Number(cantidad)
    }

    await prisma.producto.update({
      where: {
        id: producto.id
      },
      data: {
        stock: nuevoStock
      }
    })

   await prisma.movimientoInventario.create({
  data: {
    tipoMovimiento,
    cantidad: Number(cantidad),

    stockAnterior,
    stockNuevo: nuevoStock,

    motivo,

    productoId: producto.id,
    usuarioId
  }
})

    res.json({
      mensaje: 'Movimiento registrado'
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Error registrando movimiento'
    })

  }
}

const obtenerMovimientos = async (req, res) => {
  try {

    const movimientos =
      await prisma.movimientoInventario.findMany({

        include: {
          producto: true,
          usuario: true
        },

        orderBy: {
          createdAt: 'desc'
        }
      })

    res.json(movimientos)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Error obteniendo movimientos'
    })

  }
}

module.exports = {
  registrarMovimiento,
  obtenerMovimientos
}