import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { apiFetch }from '../services/api'

function Inventario() {
  const [productos, setProductos] = useState([])
  const [movimientos, setMovimientos] = useState([])

  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')

  const [mostrarModal, setMostrarModal] = useState(false)

  const [productoId, setProductoId] = useState('')
  const [tipoMovimiento, setTipoMovimiento] = useState('entrada')
  const [cantidad, setCantidad] = useState('')
  const [motivo, setMotivo] = useState('')

  const [paginaActual, setPaginaActual] = useState(1)

  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [busqueda, setBusqueda] = useState('')

  const registrosPorPagina = 10

  useEffect(() => {
    if (tipoMovimiento === 'entrada') {
      setMotivo('Compra proveedor')
    }

    if (tipoMovimiento === 'salida') {
      setMotivo('Producto dañado')
    }

    if (tipoMovimiento === 'ajuste') {
      setMotivo('Corrección inventario')
    }
  }, [tipoMovimiento])

  useEffect(() => {
    obtenerProductos()
    obtenerMovimientos()
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

  const obtenerMovimientos = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch(
        'http://localhost:3000/inventario/movimientos',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const data = await response.json()
      setMovimientos(data)
    } catch (error) {
      console.log(error)
    }
  }

  const indiceFinal = paginaActual * registrosPorPagina
  const indiceInicial = indiceFinal - registrosPorPagina

  const movimientosFiltrados = movimientos.filter((movimiento) => {
    const cumpleTipo =
      filtroTipo === 'todos' || movimiento.tipoMovimiento === filtroTipo

    const cumpleBusqueda = movimiento.producto?.nombre
      ?.toLowerCase()
      .includes(busqueda.toLowerCase())

    return cumpleTipo && cumpleBusqueda
  })

  const movimientosPagina = movimientosFiltrados.slice(
    indiceInicial,
    indiceFinal
  )

  const totalPaginas = Math.ceil(
    movimientosFiltrados.length / registrosPorPagina
  )

  const crearProducto = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')

      if (!nombre.trim() || !precio || !stock) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Complete todos los campos'
        })
        return
      }

      const response = await apiFetch(
        'http://localhost:3000/productos',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre,
            precio: Number(precio),
            stock: Number(stock)
          })
        }
      )

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Producto registrado',
          text: 'Inventario actualizado correctamente'
        })

        setNombre('')
        setPrecio('')
        setStock('')

        obtenerProductos()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const registrarMovimiento = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!productoId || !cantidad || Number(cantidad) <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Complete todos los campos'
        })
        return
      }

      const response = await apiFetch(
        'http://localhost:3000/inventario/movimiento',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productoId,
            tipoMovimiento,
            cantidad,
            motivo
          })
        }
      )

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Movimiento registrado',
          text: 'Inventario actualizado correctamente'
        })

        setMostrarModal(false)
        setProductoId('')
        setCantidad('')
        setMotivo('')

        obtenerProductos()
        obtenerMovimientos()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="p-1">
      {/* HEADER COMPACTO */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold">Inventario 📦</h1>
          <p className="text-gray-500 text-sm mt-0.5">Control inventario</p>
        </div>
      </div>

      {/* FORMULARIO CREAR PRODUCTO REDUCIDO */}
      <form
        onSubmit={crearProducto}
        className="bg-white py-4 px-4 rounded-xl shadow-sm mb-4 flex gap-3 items-center border-2 border-slate-800/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.07)] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)]"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border py-1.5 px-3 text-sm rounded-lg flex-1"
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          className="border py-1.5 px-3 text-sm rounded-lg w-32"
        />
        <input
          type="number"
          placeholder="Stock Inicial"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="border py-1.5 px-3 text-sm rounded-lg w-32"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5 px-4 rounded-lg font-medium transition-colors"
        >
          Crear Producto
        </button>
      </form>

      {/* BOTÓN NUEVO MOVIMIENTO COMPACTO */}
      <div className="mb-4">
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-xl font-medium transition-colors"
        >
          Nuevo Movimiento
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTRO */}
      <div className="flex justify-between mb-3 gap-4">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPaginaActual(1)
          }}
          className="bg-gray-450 border rounded-xl px-3 py-1.5 text-sm w-64"
        />

        <select
          value={filtroTipo}
          onChange={(e) => {
            setFiltroTipo(e.target.value)
            setPaginaActual(1)
          }}
          className="border rounded-xl px-3 py-1.5 text-sm"
        >
          <option value="todos">Todos</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
          <option value="ajuste">Ajustes</option>
        </select>
      </div>

      {/* TABLA DE MOVIMIENTOS DE INVENTARIO REDUCIDA */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border-2 border-slate-800/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.07)] transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)]">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-1">
            Movimientos Inventario 📊
          </h2>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-slate-100 border-b">
            <tr>
              <th className="p-3 text-left font-semibold text-gray-700">Tipo</th>
              <th className="p-3 text-left font-semibold text-gray-700">Producto</th>
              <th className="p-3 text-left font-semibold text-gray-700">Cantidad</th>
              <th className="p-3 text-left font-semibold text-gray-700">Stock Ant.</th>
              <th className="p-3 text-left font-semibold text-gray-700">Stock Nue.</th>
              <th className="p-3 text-left font-semibold text-gray-700">Motivo</th>
              <th className="p-3 text-left font-semibold text-gray-700">Usuario</th>
              <th className="p-3 text-left font-semibold text-gray-700">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movimientosPagina.map((movimiento) => (
              <tr key={movimiento.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2">
                  {movimiento.tipoMovimiento === 'entrada' && (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium rounded-full">
                      Entrada
                    </span>
                  )}
                  {movimiento.tipoMovimiento === 'salida' && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 text-xs font-medium rounded-full">
                      Salida
                    </span>
                  )}
                  {movimiento.tipoMovimiento === 'ajuste' && (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs font-medium rounded-full">
                      Ajuste
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-800">{movimiento.producto?.nombre || 'N/A'}</td>
                <td className="px-3 py-2 text-gray-600">{movimiento.cantidad}</td>
                <td className="px-3 py-2 text-gray-500">{movimiento.stockAnterior}</td>
                <td className="px-3 py-2 font-semibold text-gray-800">{movimiento.stockNuevo}</td>
                <td className="px-3 py-2 text-gray-600">{movimiento.motivo || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{movimiento.usuario?.nombre || 'Desconocido'}</td>
                <td className="px-3 py-2 text-gray-500 text-xs">
                  {new Date(movimiento.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {movimientosPagina.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-6 text-gray-400">
                  No se encontraron movimientos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN COMPACTA */}
      <div className="flex justify-center items-center gap-3 p-3">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
          className="bg-green-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded disabled:opacity-40 transition-opacity"
        >
          ← Anterior
        </button>

        <span className="text-xs font-medium text-gray-600">
          Página {paginaActual} de {totalPaginas || 1}
        </span>

        <button
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          onClick={() => setPaginaActual(paginaActual + 1)}
          className="bg-green-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded disabled:opacity-40 transition-opacity"
        >
          Siguiente →
        </button>
      </div>

      {/* MODAL NUEVO MOVIMIENTO */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
          <div className="bg-white rounded-3xl p-8 w-[600px]">
            <h2 className="text-3xl font-bold mb-6">Movimiento Inventario 📦</h2>

            <div className="flex flex-col gap-4">
              <select
                value={tipoMovimiento}
                onChange={(e) => setTipoMovimiento(e.target.value)}
                className="border p-3 rounded-xl"
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
                <option value="ajuste">Ajuste</option>
              </select>

              <select
                value={productoId}
                onChange={(e) => setProductoId(e.target.value)}
                className="border p-3 rounded-xl"
              >
                <option value="">Seleccione producto</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Cantidad"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="border p-3 rounded-xl"
              />

              <select
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="border p-3 rounded-xl"
              >
                {tipoMovimiento === 'entrada' && (
                  <>
                    <option>Compra proveedor</option>
                    <option>Devolución cliente</option>
                    <option>Inventario inicial</option>
                  </>
                )}

                {tipoMovimiento === 'salida' && (
                  <>
                    <option>Producto dañado</option>
                    <option>Muestra comercial</option>
                    <option>Pérdida</option>
                  </>
                )}

                {tipoMovimiento === 'ajuste' && (
                  <>
                    <option>Corrección inventario</option>
                    <option>Conteo físico</option>
                  </>
                )}
              </select>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-5 py-3 bg-gray-200 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  onClick={registrarMovimiento}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventario