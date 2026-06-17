import { useState } from 'react'
import { NavLink } from 'react-router-dom'

function Sidebar({ usuario }) {
  // Estado para controlar si el sidebar está recogido o no
  const [colapsado, setColapsado] = useState(false)

  // Función auxiliar para no repetir las clases gigantes de los links
  const obtenerEstiloLink = ({ isActive }) => {
    const base = 'flex items-center p-3 rounded-xl transition font-medium text-left overflow-hidden whitespace-nowrap '
    const estado = isActive 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
    return base + estado
  }

  return (
    // Ajustamos el ancho dinámicamente: w-64 si está abierto, w-20 si está colapsado
    <div className={`sticky top-0 h-screen bg-slate-950 text-white p-5 flex flex-col transition-all duration-300 ${colapsado ? 'w-20' : 'w-64'}`}>
      
      {/* LOGO / NOMBRE DEL SISTEMA */}
      <div className="mb-8 flex items-center gap-2 overflow-hidden">
        <span className="text-3xl min-w-[32px] text-center">🚀</span>
        {!colapsado && (
          <h1 className="text-2xl font-bold tracking-tight animate-fade-in">
            MultiSistema
          </h1>
        )}
      </div>

      {/* INFORMACIÓN DEL ROL */}
      <div className="mb-8 bg-slate-900/50 p-3 rounded-xl border border-slate-800/60 overflow-hidden min-h-[66px] flex flex-col justify-center">
        {colapsado ? (
          <p className="text-center text-xs font-bold uppercase text-blue-500 tracking-wider">
            {usuario.rol?.substring(0, 3)}
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Rol Actual</p>
            <h2 className="text-base font-semibold capitalize text-slate-200 mt-0.5">
              {usuario.rol}
            </h2>
          </>
        )}
      </div>

      {/* LISTA DE ENLACES DE NAVEGACIÓN */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar">
        
        <NavLink to="/" className={obtenerEstiloLink}>
          <span className="text-lg min-w-[30px]">📊</span>
          {!colapsado && <span className="ml-1">Dashboard</span>}
        </NavLink>

        {/* VISTAS ADMIN / SUPERADMIN */}
        {(usuario.rol === 'admin' || usuario.rol === 'superadmin') && (
          <>
            <NavLink to="/usuarios" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">👥</span>
              {!colapsado && <span className="ml-1">Usuarios</span>}
            </NavLink>

            <NavLink to="/productos" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">📦</span>
              {!colapsado && <span className="ml-1">Productos</span>}
            </NavLink>

            <NavLink to="/inventario" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">🏭</span>
              {!colapsado && <span className="ml-1">Inventario</span>}
            </NavLink>

            <NavLink to="/ventas" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">💰</span>
              {!colapsado && <span className="ml-1">Ventas</span>}
            </NavLink>

             <NavLink to="/clientes" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">🤝</span>
              {!colapsado && <span className="ml-1">Clientes</span>}
            </NavLink>

          </>

            
        )}

        {/* VISTAS VENDEDOR */}
        {usuario.rol === 'vendedor' && (
          <>
            <NavLink to="/clientes" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">🤝</span>
              {!colapsado && <span className="ml-1">Clientes</span>}
            </NavLink>

            <NavLink to="/ventas" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">💰</span>
              {!colapsado && <span className="ml-1">Ventas</span>}
            </NavLink>

            <NavLink to="/productos" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">📦</span>
              {!colapsado && <span className="ml-1">Productos</span>}
            </NavLink>
          </>
        )}

        {/* VISTAS COBRADOR */}
        {usuario.rol === 'cobrador' && (
          <>
            <NavLink to="/cuotas" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">📅</span>
              {!colapsado && <span className="ml-1">Cuotas</span>}
            </NavLink>

            <NavLink to="/pagos" className={obtenerEstiloLink}>
              <span className="text-lg min-w-[30px]">💳</span>
              {!colapsado && <span className="ml-1">Pagos</span>}
            </NavLink>
          </>
        )}

      </div>

      {/* BOTONCITO EN LA ESQUINA INFERIOR */}
     <button
  onClick={() => setColapsado(!colapsado)}
  className="absolute bottom-6 -right-5 bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md transition-all duration-300 hover:scale-110 z-50"
  title={colapsado ? "Expandir menú" : "Colapsar menú"}
>
  <svg 
    className={`w-5 h-5 transition-transform duration-300 ${colapsado ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={3} 
          stroke="currentColor" 
          className={`w-3.5 h-3.5 transition-transform duration-300 ${colapsado ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

    </div>
  )
}

export default Sidebar