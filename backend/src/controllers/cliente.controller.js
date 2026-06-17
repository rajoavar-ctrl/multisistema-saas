const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const crearCliente = async (req, res) => {
  try {
    const { nombre, documento, telefono, direccion, email } = req.body
    const empresaId = req.usuario.empresaId

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        documento,
        telefono,
        direccion,
        email,
        empresaId
      }
    })

    res.json(cliente)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Error creando cliente'
    })
  }
}

const obtenerClientes = async (req, res) => {
  try {
    const empresaId = req.usuario.empresaId

    // 🔥 Modificado: Ahora solo trae clientes activos
    const clientes = await prisma.cliente.findMany({
      where: {
        empresaId,
        activo: true
      },
      orderBy: {
        id: 'desc'
      }
    })

    res.json(clientes)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Error obteniendo clientes'
    })
  }
}

// 🆕 Nuevo Método para Desactivación Lógica
const desactivarCliente = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.cliente.update({
      where: {
        id: Number(id)
      },
      data: {
        activo: false
      }
    })

    res.json({
      mensaje: 'Cliente desactivado'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: 'Error desactivando cliente'
    })
  }
}

const actualizarCliente = async (req, res) => {
  try {

    const { id } = req.params

    const {
      nombre,
      documento,
      telefono,
      direccion,
      email
    } = req.body

    const cliente =
      await prisma.cliente.update({

        where: {
          id: Number(id)
        },

        data: {
          nombre,
          documento,
          telefono,
          direccion,
          email
        }

      })

    res.json(cliente)

  } catch (error) {

    console.log(error)

    res.status(500).json({
      error: 'Error actualizando cliente'
    })

  }
}

module.exports = {
  crearCliente,
  obtenerClientes,
  desactivarCliente,
  actualizarCliente
}