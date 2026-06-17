const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const registrarPago = async (req, res) => {
  try {
    const { cuotaId, valor } = req.body

    const cuota = await prisma.cuota.findUnique({
      where: {
        id: cuotaId
      },
      include: {
        venta: true
      }
    })

    if (!cuota) {
      return res.status(404).json({
        error: 'Cuota no encontrada'
      })
    }

    if (valor > cuota.saldo) {
      return res.status(400).json({
        error: 'El pago supera el saldo de la cuota'
      })
    }

    // REGISTRAR PAGO

    const pago = await prisma.pago.create({
      data: {
        valor,
        cuotaId
      }
    })

    // ACTUALIZAR SALDO CUOTA

    const nuevoSaldoCuota = cuota.saldo - valor

    let nuevoEstado = 'pendiente'

    if (nuevoSaldoCuota <= 0) {
      nuevoEstado = 'pagada'
    }

    await prisma.cuota.update({
      where: {
        id: cuota.id
      },
      data: {
        saldo: nuevoSaldoCuota,
        estado: nuevoEstado
      }
    })

    // ACTUALIZAR SALDO VENTA

    const nuevoSaldoVenta =
      cuota.venta.saldoPendiente - valor

    await prisma.venta.update({
      where: {
        id: cuota.venta.id
      },
      data: {
        saldoPendiente: nuevoSaldoVenta
      }
    })

    res.json({
      mensaje: 'Pago registrado correctamente',
      pago
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error registrando pago'
    })
  }
}

module.exports = {
  registrarPago
}