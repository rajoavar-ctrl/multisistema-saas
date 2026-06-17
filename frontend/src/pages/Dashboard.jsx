import { useEffect, useState } from 'react'
import { apiFetch }from '../services/api'

function Dashboard() {
  const [resumen, setResumen] = useState({})

  useEffect(() => {
    obtenerResumen()
  }, [])

  const obtenerResumen = async () => {
    try {
      const token = localStorage.getItem('token')

      const response = await apiFetch(
        'http://localhost:3000/dashboard/resumen',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setResumen(data)
      } else {
        console.error('Error al obtener el resumen de la API')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-1">
      <h1 className="text-4xl font-bold mb-8">Dashboard 🚀</h1>

      {/* CONTADORES PRINCIPALES */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 font-medium">Productos</h2>
          <p className="text-4xl font-bold mt-2">{resumen.productos || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 font-medium">Usuarios</h2>
          <p className="text-4xl font-bold mt-2">{resumen.usuarios || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 font-medium">Movimientos</h2>
          <p className="text-4xl font-bold mt-2">{resumen.movimientos || 0}</p>
        </div>
      </div>

      {/* SUB-CONTADORES DE ESTADOS */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 font-medium">Entradas</h2>
          <p className="text-4xl font-bold mt-2 text-green-600">{resumen.entradas || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 font-medium">Salidas</h2>
          <p className="text-4xl font-bold mt-2 text-red-600">{resumen.salidas || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-gray-500 font-medium">Ajustes</h2>
          <p className="text-4xl font-bold mt-2 text-yellow-600">{resumen.ajustes || 0}</p>
        </div>
      </div>

      {/* TABLA DE ÚLTIMOS MOVIMIENTOS */}
      <div className="bg-white rounded-2xl shadow mt-8 overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Últimos Movimientos 📊</h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Producto</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {resumen.ultimosMovimientos?.map((movimiento) => (
              <tr key={movimiento.id} className="hover:bg-slate-50 transition-colors">
                {/* Solución al error: uso de encadenamiento opcional ?. por si producto viene null */}
                <td className="px-4 py-3 text-gray-800 font-medium">
                  {movimiento.producto?.nombre || 'Producto no identificado'}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize">
                  {movimiento.tipoMovimiento}
                </td>
                <td className="px-4 py-3 text-gray-600 font-semibold">
                  {movimiento.cantidad}
                </td>
              </tr>
            ))}

            {/* Mensaje de respaldo por si la lista viene vacía */}
            {(!resumen.ultimosMovimientos || resumen.ultimosMovimientos.length === 0) && (
              <tr>
                <td colSpan="3" className="text-center py-6 text-gray-400">
                  No hay movimientos recientes para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard