import { useEffect, useState } from 'react'
import { apiFetch }from '../services/api'

function Productos() {
  const [productos, setProductos] = useState([])

  useEffect(() => {
    obtenerProductos()
  }, [])

  const obtenerProductos = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch(
        'http://localhost:3000/productos',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      setProductos(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Productos 📦
      </h1>

      {/* TABLA DE PRODUCTOS (SOLO CATÁLOGO) */}
      <div className="bg-white rounded-2xl shadow overflow-hidden mb-8">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Precio</th>
              <th className="text-left p-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-t">
                <td className="p-4">{producto.nombre}</td>
                <td className="p-4">${producto.precio}</td>
                <td className="p-4">{producto.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Productos