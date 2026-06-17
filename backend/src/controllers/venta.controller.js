const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const crearVenta = async (req, res) => {
  try {

    const {
      clienteId,
      cuotaInicial,
      numeroCuotas,
      frecuenciaPago,
      productos
    } = req.body

    const empresaId =
      req.usuario.empresaId

    const vendedorId =
      req.usuario.id

    let total = 0

    // VALIDAR PRODUCTOS Y CALCULAR TOTAL

    for (const item of productos) {

      const producto =
        await prisma.producto.findUnique({
          where: {
            id: item.productoId
          }
        })

      if (!producto) {
        return res.status(404).json({
          error: `Producto ${item.productoId} no existe`
        })
      }

      if (
        producto.stock <
        item.cantidad
      ) {
        return res.status(400).json({
          error:
            `Stock insuficiente para ${producto.nombre}`
        })
      }

      total +=
        producto.precio *
        item.cantidad

    }

    const saldoPendiente =
      total - cuotaInicial

    const valorCuota =
      saldoPendiente /
      numeroCuotas

    // CREAR VENTA

    const venta =
      await prisma.venta.create({
        data: {
          total,
          cuotaInicial,
          saldoPendiente,
          numeroCuotas,
          frecuenciaPago,
          empresaId,
          clienteId,
          vendedorId
        }
      })

    // CREAR DETALLES
    // DESCONTAR STOCK
    // MOVIMIENTOS INVENTARIO

    for (const item of productos) {

      const producto =
        await prisma.producto.findUnique({
          where: {
            id: item.productoId
          }
        })

      const subtotal =
        producto.precio *
        item.cantidad

      await prisma.detalleVenta.create({
        data: {
          cantidad: item.cantidad,
          precio: producto.precio,
          subtotal,
          ventaId: venta.id,
          productoId: producto.id
        }
      })

      await prisma.producto.update({
        where: {
          id: producto.id
        },
        data: {
          stock:
            producto.stock -
            item.cantidad
        }
      })

      await prisma.movimientoInventario.create({
        data: {

          tipoMovimiento:
            'salida',

          cantidad:
            item.cantidad,

          stockAnterior:
            producto.stock,

          stockNuevo:
            producto.stock -
            item.cantidad,

          motivo:
            `Venta #${venta.id}`,

          productoId:
            producto.id,

          usuarioId:
            vendedorId

        }
      })

    }

    // CREAR CUOTAS

    for (
      let i = 1;
      i <= numeroCuotas;
      i++
    ) {

      const fechaPago =
        new Date()

      if (
        frecuenciaPago ===
        'diario'
      ) {
        fechaPago.setDate(
          fechaPago.getDate() + i
        )
      }

      if (
        frecuenciaPago ===
        'semanal'
      ) {
        fechaPago.setDate(
          fechaPago.getDate() +
          (i * 7)
        )
      }

      if (
        frecuenciaPago ===
        'quincenal'
      ) {
        fechaPago.setDate(
          fechaPago.getDate() +
          (i * 15)
        )
      }

      if (
        frecuenciaPago ===
        'mensual'
      ) {
        fechaPago.setMonth(
          fechaPago.getMonth() + i
        )
      }

      await prisma.cuota.create({
        data: {
          numero: i,
          valor: valorCuota,
          saldo: valorCuota,
          fechaPago,
          ventaId: venta.id
        }
      })

    }

    res.json({
      mensaje:
        'Venta creada correctamente',
      venta
    })

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error:
        'Error creando venta'
    })

  }
}

module.exports = {
  crearVenta
}