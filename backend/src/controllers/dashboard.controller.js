const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const resumenDashboard = async (req, res) => {
  try {

    const productos =
      await prisma.producto.count({
        where: {
          activo: true
        }
      })

    const usuarios =
      await prisma.usuario.count()

    const movimientos =
      await prisma.movimientoInventario.count()

        const entradas =
  await prisma.movimientoInventario.count({
    where: {
      tipoMovimiento: 'entrada'
    }
  })

const salidas =
  await prisma.movimientoInventario.count({
    where: {
      tipoMovimiento: 'salida'
    }
  })

const ajustes =
  await prisma.movimientoInventario.count({
    where: {
      tipoMovimiento: 'ajuste'
    }
  })

    const ultimosMovimientos =
  await prisma.movimientoInventario.findMany({

    take: 5,

    orderBy: {
      createdAt: 'desc'
    },

    include: {
      producto: true
    }

  })

    res.json({
      productos,
      usuarios,
      movimientos,
       entradas,
      salidas,
      ajustes,
      ultimosMovimientos
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Error dashboard'
    })

  }
}

module.exports = {
  resumenDashboard
}