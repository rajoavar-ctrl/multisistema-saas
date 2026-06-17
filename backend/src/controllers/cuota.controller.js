const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const obtenerCuotas = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId

    const cuotas = await prisma.cuota.findMany({
      where: {
        venta: {
          empresaId
        }
      },
      include: {
        venta: {
          include: {
            cliente: true
          }
        }
      }
    })

    res.json(cuotas)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error obteniendo cuotas'
    })
  }
}

module.exports = {
  obtenerCuotas
}