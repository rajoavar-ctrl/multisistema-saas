import { useState } from 'react'

function Login() {
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setMensaje('') // Limpiamos mensaje previo

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setMensaje('¡Login exitoso! 🚀 Redireccionando...')
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setMensaje(data.error || 'Credenciales incorrectas')
      }
    } catch (error) {
      console.log(error)
      setMensaje('Error conectando con el servidor 📡')
    }
  }

  return (
    // FONDO GRIS NEUTRO SUTIL (El mismo de tu dashboard interno)
    <div className="flex justify-center items-center min-h-screen bg-gray-300 p-4">
      
      {/* TARJETA FLOTANTE MAKIA (Con la sombra y esquinas curvas del panel principal) */}
      <div className="bg-white w-full max-w-md p-8 rounded-2xl border-2 border-slate-400/80 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.30)] transition-all duration-300">
        
        {/* CABECERA CON EL LOOK DEL SIDEBAR */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-950 rounded-2xl text-3xl mb-3 shadow-md">
            🚀
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            MultiSistema <span className="text-blue-600">SaaS</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Ingresa tus credenciales para acceder al panel
          </p>
        </div>

        {/* ALERTA DE MENSAJES DINÁMICA */}
        {mensaje && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold mb-5 text-center border transition-all ${
            mensaje.includes('exitoso') 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {mensaje}
          </div>
        )}

        {/* FORMULARIO ESTILIZADO */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              placeholder="nombre@empresa.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-white text-slate-900 border-2 border-slate-200 px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white text-slate-900 border-2 border-slate-200 px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
              required
            />
          </div>

          {/* BOTÓN PREMIUM CON EL AZUL DEL SIDEBAR */}
          <button 
            type="submit"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            Iniciar sesión
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login