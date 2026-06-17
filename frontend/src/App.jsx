import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Usuarios from './pages/Usuarios'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Productos from './pages/Productos'
import Clientes from './pages/Clientes'
import Ventas from './pages/Ventas'
import Cuotas from './pages/Cuotas'
import Pagos from './pages/Pagos'
import Inventario from './pages/Inventario'

import Sidebar from './components/Sidebar'

function App() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Login />
  }

  const usuario = jwtDecode(token)

  return (
    <BrowserRouter>
      {/* Contenedor principal de toda la app */}
      <div className="flex bg-gray-200 min-h-screen">
        
        {/* Tu barra lateral izquierda fija */}
        <Sidebar usuario={usuario} />

        {/* CONTENEDOR DERECHO TOTAL: Se vuelve una columna flexible */}
        <div className="flex-1 flex flex-col min-h-screen">
          
          {/* HEADER GLOBAL: Ahora del color del Sidebar, más bajito y elegante */}
<header className="bg-slate-950 border-b border-slate-800 px-8 py-1 flex justify-between items-center shadow-md">
  <div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sistema Administrativo</span>
    <h2 className="text-sm font-bold text-white">MultiSistema v1.0</h2>
  </div>
  
  <div className="flex items-center gap-4">
    {/* Información del usuario logueado en blanco */}
    <div className="text-right hidden sm:block">
      <p className="text-xs font-semibold text-slate-200">{usuario?.nombre || 'Administrador'}</p>
      <p className="text-[10px] text-green-400 font-medium">● En línea</p>
    </div>
    
    {/* Botón de cerrar sesión */}
    <button
      className="bg-red-950/40 border border-red-800 hover:bg-red-900/60 text-red-300 text-xs font-medium py-1.5 px-4 rounded-xl transition"
      onClick={() => {
        localStorage.removeItem('token')
        window.location.reload()
      }}
    >
      Cerrar sesión
    </button>
  </div>
</header>

          {/* MAIN CONTAINER: Donde se renderizan todas tus páginas con espacio (p-8) */}
          <main className="flex-1 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/cuotas" element={<Cuotas />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/inventario" element={<Inventario />} />
            </Routes>
          </main>

          {/* FOOTER GLOBAL: Haciendo juego con el Header y el Sidebar */}
<footer className="bg-slate-950 border-t border-slate-800 px-8 py-1 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 font-medium">
  <p>© 2026 MultiSistema. Todos los derechos reservados.</p>
  <div className="flex gap-4 mt-2 sm:mt-0">
    <a href="#soporte" className="hover:text-blue-400 transition">Soporte Técnico</a>
    <span>•</span>
    <a href="#terminos" className="hover:text-blue-400 transition">Términos de servicio</a>
  </div>
</footer>

        </div>

      </div>
    </BrowserRouter>
  )
}

export default App