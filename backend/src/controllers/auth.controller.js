const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()

const login = async (req, res) => {
  try {
    const { correo, password } = req.body

    const usuario = await prisma.usuario.findUnique({
      where: {
        correo
      }
    })

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuario no encontrado'
      })
    }

    const passwordCorrecto = await bcrypt.compare(
      password,
      usuario.password
    )

    if (!passwordCorrecto) {
      return res.status(401).json({
        error: 'Contraseña incorrecta'
      })
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        rol: usuario.rol,
        empresaId: usuario.empresaId
      },
      'secreto_super_seguro',
      {
        expiresIn: '8h'
      }
    )

    res.json({
      mensaje: 'Login exitoso',
      token
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      error: 'Error en login'
    })
  }
}

module.exports = {
  login
}