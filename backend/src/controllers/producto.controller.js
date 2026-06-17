const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock } = req.body

    if (
  !nombre ||
  nombre.trim() === '' ||
  precio <= 0 ||
  stock < 0
) {
  return res.status(400).json({
    error: 'Datos inválidos'
  })
}

    const empresaId = req.usuario.empresaId

    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        stock,
        empresaId
      }
    })

    res.json(producto)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error creando producto'
    })
  }
}

const obtenerProductos = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId

    const productos = await prisma.producto.findMany({
      where: {
        empresaId,
        activo: true
      }
    })

    res.json(productos)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error obteniendo productos'
    })
  }
}

const descontinuarProducto = async (req, res) => {
  try {

    const { id } = req.params

    await prisma.producto.update({
      where: {
        id: Number(id)
      },
      data: {
      activo: false
}
    })

    res.json({
      mensaje: 'Producto eliminado'
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error eliminando producto'
    })
  }
}

const entradaInventario = async (req, res) => {
  try {

    const { id } = req.params

    const {
      cantidad,
      motivo
    } = req.body

    const usuarioId = req.usuario.id

    const producto = await prisma.producto.findUnique({
      where: {
        id: Number(id)
      }
    })

    if (!producto) {
      return res.status(404).json({
        error: 'Producto no encontrado'
      })
    }

    // ACTUALIZAR STOCK

    await prisma.producto.update({
      where: {
        id: producto.id
      },
      data: {
        stock: producto.stock + Number(cantidad)
      }
    })

    // REGISTRAR MOVIMIENTO

    await prisma.movimientoInventario.create({
      data: {
        tipoMovimiento: 'entrada',
        cantidad: Number(cantidad),
        motivo,

        productoId: producto.id,
        usuarioId
      }
    })

    res.json({
      mensaje: 'Entrada inventario registrada'
    })

  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error registrando entrada'
    })
  }
}

const obtenerMovimientos = async (req, res) => {
  try {

    const { id } = req.params

    const movimientos =
      await prisma.movimientoInventario.findMany({
        where: {
          productoId: Number(id)
        },
        include: {
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
  crearProducto,
  obtenerProductos,
  descontinuarProducto,
  entradaInventario,
  obtenerMovimientos
}