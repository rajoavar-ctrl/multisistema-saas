import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { apiFetch } from '../services/api'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [busqueda, setBusqueda] = useState('')

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [documento, setDocumento] = useState('')
  const [email, setEmail] = useState('')

  // Estados para el Modal Pro
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false)
  const [clienteEditar, setClienteEditar] = useState(null)

  const [paginaActual, setPaginaActual] = useState(1)
  const registrosPorPagina = 10

  useEffect(() => {
    obtenerClientes()
  }, [])

  const obtenerClientes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch('http://localhost:3000/clientes', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.log(error)
    }
  }

  const crearCliente = async (e) => {
    e.preventDefault()
    try {
      if (!nombre.trim()) {
        Swal.fire({ icon: 'warning', title: 'Nombre requerido' })
        return
      }

      const token = localStorage.getItem('token')
      const response = await apiFetch('http://localhost:3000/clientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre, documento, telefono, direccion, email })
      })

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Cliente creado' })
        setNombre('')
        setTelefono('')
        setDireccion('')
        setDocumento('')
        setEmail('')
        obtenerClientes()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const desactivarCliente = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Desactivar cliente?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí'
    })

    if (!resultado.isConfirmed) return

    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch(`http://localhost:3000/clientes/${id}/desactivar`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        Swal.fire({ icon: 'success', title: 'Cliente desactivado' })
        obtenerClientes()
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 🔥 FUNCIÓN ACTUALIZAR CORREGIDA CON SU TOKEN
const actualizarCliente = async () => {
    try {
      if (!clienteEditar.nombre.trim()) {
        Swal.fire({ icon: 'warning', title: 'El nombre es obligatorio' })
        return
      }

      const token = localStorage.getItem('token')
      
      const response = await apiFetch(`http://localhost:3000/clientes/${clienteEditar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: clienteEditar.nombre,
          documento: clienteEditar.documento || '',
          telefono: clienteEditar.telefono || '',
          direccion: clienteEditar.direccion || '',
          email: clienteEditar.email || ''
        })
      })

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Cliente actualizado',
          showConfirmButton: false,
          timer: 1500
        })
        setMostrarModalEditar(false)
        obtenerClientes() // Recarga la tabla en caliente
      } else {
        const errorData = await response.json()
        Swal.fire({
          icon: 'error',
          title: 'Error al actualizar',
          text: errorData.error || 'Verifica los permisos del usuario'
        })
      }
    } catch (error) {
      console.log(error)
      Swal.fire({ icon: 'error', title: 'Error de red al actualizar' })
    }
  }

  const abrirModalEditar = (cliente) => {
    setClienteEditar({ ...cliente }) // Pasamos una copia limpia
    setMostrarModalEditar(true)
  }

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  const indiceUltimo = paginaActual * registrosPorPagina
  const indicePrimero = indiceUltimo - registrosPorPagina
  const clientesPaginados = clientesFiltrados.slice(indicePrimero, indiceUltimo)
  const totalPaginas = Math.ceil(clientesFiltrados.length / registrosPorPagina)

  return (
    <div className="p-1">
      {/* HEADER COMPACTO ORIGINAL */}
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Clientes 👥</h1>
        <p className="text-gray-500 text-sm mt-0.5">Administración de base de datos de clientes</p>
      </div>

      {/* FORMULARIO CREAR */}
      <form
        onSubmit={crearCliente}
        className="bg-white p-6 rounded-2xl mb-6 flex flex-col gap-4 border-2 border-slate-800/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.07)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} className="border py-1.5 px-3 text-sm rounded-lg w-full" />
          <input type="text" placeholder="Documento / NIT" value={documento} onChange={(e) => setDocumento(e.target.value)} className="border py-1.5 px-3 text-sm rounded-lg w-full" />
          <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} className="border py-1.5 px-3 text-sm rounded-lg w-full" />
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} className="border py-1.5 px-3 text-sm rounded-lg w-full" />
          <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} className="border py-1.5 px-3 text-sm rounded-lg w-full" />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer">
            Crear Cliente
          </button>
        </div>
      </form>

      {/* BARRA DE BÚSQUEDA */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar cliente por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
          className="border rounded-xl px-3 py-1.5 text-sm w-full md:w-80 shadow-sm"
        />
      </div>

      {/* TABLA RESTAURADA */}
      <div className="bg-white rounded-2xl overflow-hidden border-2 border-slate-600/50 shadow-[0_12px_35px_-15px_rgba(0,0,0,0.08)]">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">Nombre</th>
              <th className="p-3 text-left font-semibold text-gray-700">Documento</th>
              <th className="p-3 text-left font-semibold text-gray-700">Email</th>
              <th className="p-3 text-left font-semibold text-gray-700">Teléfono</th>
              <th className="p-3 text-left font-semibold text-gray-700">Dirección</th>
              <th className="p-3 text-center font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clientesPaginados.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2.5 font-medium text-gray-800">{cliente.nombre}</td>
                <td className="px-3 py-2.5 text-gray-600">{cliente.documento || '—'}</td>
                <td className="px-3 py-2.5 text-gray-600">{cliente.email || '—'}</td>
                <td className="px-3 py-2.5 text-gray-600">{cliente.telefono || '—'}</td>
                <td className="px-3 py-2.5 text-gray-600">{cliente.direccion || '—'}</td>
                <td className="px-3 py-2.5 text-center flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => abrirModalEditar(cliente)}
                    className="bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-600 text-xs font-semibold py-0.5 px-2 rounded-md transition-all cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => desactivarCliente(cliente.id)}
                    className="bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-semibold py-0.5 px-2 rounded-md transition-all cursor-pointer"
                  >
                    Desactivar
                  </button>
                </td>
              </tr>
            ))}
            {clientesPaginados.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400">
                  No se encontraron clientes en la base de datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      <div className="flex justify-center items-center gap-3 p-3">
        <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)} className="bg-green-800 hover:bg-slate-500 text-white text-xs px-3 py-1.5 rounded disabled:opacity-40 transition-opacity cursor-pointer">
          ← Anterior
        </button>
        <span className="text-xs font-medium text-gray-600">Página {paginaActual} de {totalPaginas || 1}</span>
        <button disabled={paginaActual === totalPaginas || totalPaginas === 0} onClick={() => setPaginaActual(paginaActual + 1)} className="bg-green-800 hover:bg-slate-500 text-white text-xs px-3 py-1.5 rounded disabled:opacity-40 transition-opacity cursor-pointer">
          Siguiente →
        </button>
      </div>

      {/* 🔥 MODAL TOTALMENTE PRO, ELEGANTE Y FUERA DE LA TABLA */}
      {mostrarModalEditar && clienteEditar && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all">
            
            {/* Header del Modal */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Editar Datos del Cliente</h2>
                <p className="text-xs text-gray-500">Modifica los campos necesarios</p>
              </div>
              <button 
                onClick={() => setMostrarModalEditar(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-medium cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo del Modal con Layout Limpio */}
            <div className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nombre Completo</label>
                <input
                  type="text"
                  className="border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none py-2 px-3 text-sm rounded-lg w-full transition-all"
                  value={clienteEditar.nombre}
                  onChange={(e) => setClienteEditar({ ...clienteEditar, nombre: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Documento / NIT</label>
                  <input
                    type="text"
                    className="border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none py-2 px-3 text-sm rounded-lg w-full transition-all"
                    value={clienteEditar.documento || ''}
                    onChange={(e) => setClienteEditar({ ...clienteEditar, documento: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    className="border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none py-2 px-3 text-sm rounded-lg w-full transition-all"
                    value={clienteEditar.telefono || ''}
                    onChange={(e) => setClienteEditar({ ...clienteEditar, telefono: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  className="border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none py-2 px-3 text-sm rounded-lg w-full transition-all"
                  value={clienteEditar.email || ''}
                  onChange={(e) => setClienteEditar({ ...clienteEditar, email: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Dirección Residencial</label>
                <input
                  type="text"
                  className="border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none py-2 px-3 text-sm rounded-lg w-full transition-all"
                  value={clienteEditar.direccion || ''}
                  onChange={(e) => setClienteEditar({ ...clienteEditar, direccion: e.target.value })}
                />
              </div>
            </div>

            {/* Footer de Acciones del Modal */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                onClick={() => setMostrarModalEditar(false)}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 px-4 rounded-lg transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={actualizarCliente}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              >
                Guardar Cambios
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Clientes