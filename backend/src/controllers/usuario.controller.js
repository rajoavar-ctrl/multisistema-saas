const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

const crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, password, rol, empresaId } = req.body
    const passwordHash = await bcrypt.hash(password, 10)

    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        password: passwordHash,
        rol,
        empresaId
      }
    })

    res.json(usuario)
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error creando usuario'
    })
  }
}

module.exports = {
  crearUsuario
}