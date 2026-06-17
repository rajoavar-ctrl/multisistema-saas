import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { apiFetch } from '../services/api'

function Ventas() {
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])

  const [clienteId, setClienteId] = useState('')
  const [productosVenta, setProductosVenta] = useState([
    { productoId: '', cantidad: 1 }
  ])

  const [cuotaInicial, setCuotaInicial] = useState(0)
  const [numeroCuotas, setNumeroCuotas] = useState(12)
  const [frecuenciaPago, setFrecuenciaPago] = useState('mensual')

  const fechaPrimeraCuota = new Date()

if (frecuenciaPago === 'mensual') {
  fechaPrimeraCuota.setMonth(
    fechaPrimeraCuota.getMonth() + 1
  )
}

if (frecuenciaPago === 'quincenal') {
  fechaPrimeraCuota.setDate(
    fechaPrimeraCuota.getDate() + 15
  )
}

if (frecuenciaPago === 'semanal') {
  fechaPrimeraCuota.setDate(
    fechaPrimeraCuota.getDate() + 7
  )
}

  useEffect(() => {
    obtenerClientes()
    obtenerProductos()
  }, [])

  const obtenerClientes = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch('http://localhost:3000/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      console.log(error)
    }
  }

  const obtenerProductos = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await apiFetch('http://localhost:3000/productos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      setProductos(data)
    } catch (error) {
      console.log(error)
    }
  }

  const subtotal = productosVenta.reduce((total, item) => {
    const producto = productos.find(p => p.id === Number(item.productoId))
    if (!producto) return total
    return total + producto.precio * item.cantidad
  }, 0)

  const saldoPendiente = subtotal - cuotaInicial

  const valorCuota = numeroCuotas > 0 ? saldoPendiente / numeroCuotas : 0

  // Mantenemos tu función exacta pero con el control para limpiar el 0 inicial fastidioso
  const manejarCuotaInicial = (valor) => {
    if (valor === '') {
      setCuotaInicial('')
      return
    }

    const monto = Number(valor)

    if (monto > subtotal) {
      Swal.fire({ icon: 'warning', title: 'Monto inválido', text: 'La cuota inicial no puede ser mayor al subtotal.' })
      return
    }

    setCuotaInicial(monto)
  }

  const agregarLineaProducto = () => {
    setProductosVenta([...productosVenta, { productoId: '', cantidad: 1 }])
  }

  const eliminarLineaProducto = (index) => {
    if (productosVenta.length === 1) {
      Swal.fire({ icon: 'warning', title: 'Mínimo un producto', text: 'La venta debe contener al menos una línea.' })
      return
    }
    const nuevos = productosVenta.filter((_, i) => i !== index)
    setProductosVenta(nuevos)
  }

  const manejarCambioProducto = (index, id) => {
    const existe = productosVenta.some((item, i) => item.productoId === id && i !== index)
    if (existe && id !== '') {
      Swal.fire({ icon: 'info', title: 'Producto repetido', text: 'Este producto ya está en la lista, aumenta su cantidad.' })
      return
    }

    const nuevos = [...productosVenta]
    nuevos[index].productoId = id
    setProductosVenta(nuevos)
  }

  const manejarCambioCantidad = (index, cant) => {
    const nuevos = [...productosVenta]
    nuevos[index].cantidad = Number(cant)
    setProductosVenta(nuevos)
  }

  const procesarVenta = async () => {

  try {

    if (!clienteId) {

      Swal.fire({
        icon: 'warning',
        title: 'Falta Cliente',
        text: 'Seleccione un cliente'
      })

      return
    }

    const productosValidos =
      productosVenta.filter(
        p => p.productoId !== ''
      )

    if (productosValidos.length === 0) {

      Swal.fire({
        icon: 'warning',
        title: 'Venta Vacía',
        text: 'Debe agregar productos'
      })

      return
    }

    const response =
      await apiFetch(
        'http://localhost:3000/ventas',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json'
          },

          body: JSON.stringify({

            clienteId:
              Number(clienteId),

            cuotaInicial:
              Number(cuotaInicial),

            numeroCuotas,

            frecuenciaPago,

            productos:
              productosValidos.map(
                item => ({
                  productoId:
                    Number(
                      item.productoId
                    ),
                  cantidad:
                    item.cantidad
                })
              )

          })

        }
      )

    const data =
      await response.json()

    if (!response.ok) {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text:
          data.error ||
          'Error creando venta'
      })

      return
    }

    Swal.fire({
      icon: 'success',
      title: 'Venta registrada',
      text:
        `Factura #${data.venta.id}`
    })

    obtenerProductos()

  } catch (error) {

    console.log(error)

    Swal.fire({
      icon: 'error',
      title: 'Servidor',
      text:
        'Error conectando backend'
    })

  }

}

  return (
    <div className="p-1">
      {/* HEADER COMPACTO */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Panel de Ventas 💰</h1>
        <p className="text-gray-500 text-sm mt-0.5">Generación y facturación de órdenes en tiempo real</p>
      </div>

      {/* DISEÑO EN DOS COLUMNAS PRO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: CLIENTE Y TABLA DE PRODUCTOS (Ocupa 2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* SELECCIÓN DE CLIENTE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <label className="block mb-2 text-sm font-bold text-slate-700">Asignar Cliente</label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none p-2.5 text-sm rounded-xl w-full transition-all"
            >
              <option value="">Seleccione un cliente de la lista...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
              ))}
            </select>
          </div>

          {/* TABLA DE ITEMS SELECCIONADOS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-5 py-3.5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-800">Productos en la Orden</h2>
              <button
                onClick={agregarLineaProducto}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                + Añadir Fila
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100/70 border-b border-slate-200">
                  <tr>
                    <th className="p-3 text-left font-semibold text-slate-700 w-1/2">Producto</th>
                    <th className="p-3 text-right font-semibold text-slate-700">Precio Unitario</th>
                    <th className="p-3 text-center font-semibold text-slate-700 w-24">Cant.</th>
                    <th className="p-3 text-right font-semibold text-slate-700">Subtotal</th>
                    <th className="p-3 text-center font-semibold text-slate-700 w-14"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productosVenta.map((item, index) => {
                    const producto = productos.find(p => p.id === Number(item.productoId))
                    const totalLinea = producto ? producto.precio * item.cantidad : 0

                    return (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        {/* Dropdown del Producto */}
                        <td className="p-2.5">
                          <select
                            value={item.productoId}
                            onChange={(e) => manejarCambioProducto(index, e.target.value)}
                            className="border border-slate-200 bg-white focus:border-blue-500 outline-none p-1.5 text-xs rounded-lg w-full"
                          >
                            <option value="">Seleccione producto...</option>
                            {productos.map(p => (
                              <option key={p.id} value={p.id}>{p.nombre}</option>
                            ))}
                          </select>
                        </td>
                        
                        {/* Precio Unidad */}
                        <td className="p-2.5 text-right font-medium text-slate-500 text-xs">
                          {producto ? `$${producto.precio.toLocaleString()}` : '$0'}
                        </td>

                        {/* Input de Cantidad - CORREGIDO LLAMANDO A manejarCambioCantidad */}
                        <td className="p-2.5">
                          <input
                            type="number"
                            min="1"
                            value={item.cantidad}
                            onChange={(e) => manejarCambioCantidad(index, e.target.value)}
                            className="border border-slate-200 focus:border-blue-500 outline-none p-1.5 text-center text-xs rounded-lg w-full"
                          />
                        </td>

                        {/* Total Línea */}
                        <td className="p-2.5 text-right font-bold text-slate-800 text-xs">
                          ${totalLinea.toLocaleString()}
                        </td>

                        {/* Botón Eliminar Fila */}
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => eliminarLineaProducto(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer text-sm"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* CONDICIONES DE PAGO */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm text-slate-800 mb-4 uppercase tracking-wider">
              Condiciones de Crédito / Pago
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Cuota Inicial</label>
                <input
                  type="number"
                  value={cuotaInicial}
                  onChange={(e) => manejarCuotaInicial(e.target.value)}
                  onFocus={() => cuotaInicial === 0 && setCuotaInicial('')}
                  className="w-full border border-slate-200 focus:border-blue-500 outline-none rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Número de Cuotas</label>
                <input
                  type="number"
                  min="1"
                  value={numeroCuotas}
                  onChange={(e) => setNumeroCuotas(Number(e.target.value))}
                  className="w-full border border-slate-200 focus:border-blue-500 outline-none rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Frecuencia de Pago</label>
                <select
                  value={frecuenciaPago}
                  onChange={(e) => setFrecuenciaPago(e.target.value)}
                  className="w-full border border-slate-200 focus:border-blue-500 outline-none rounded-xl p-2.5 text-sm bg-slate-50 focus:bg-white transition-all"
                >
                  <option value="mensual">Mensual</option>
                  <option value="quincenal">Quincenal</option>
                  <option value="semanal">Semanal</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA DERECHA: RESUMEN DE COBRO FIJO */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between min-h-[400px] sticky top-6">
          <div>
            <h2 className="text-base font-bold tracking-wide text-slate-400 uppercase mb-4">Resumen de Cargo</h2>
            
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3 mb-4">
              <span className="text-xs text-slate-400">Items totales:</span>
              <span className="text-sm font-semibold text-slate-200">{productosVenta.filter(p => p.productoId !== '').length} ref.</span>
            </div>
            
            <div className="my-5">
              <span className="text-xs text-slate-400 block mb-1">SUBTOTAL DEL VALOR</span>
              <p className="text-3xl font-black text-slate-100 tracking-tight">
                ${subtotal.toLocaleString()}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Cuota inicial:</span>
                <span className="font-medium text-slate-200">${cuotaInicial.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Saldo pendiente:</span>
                <span className="font-medium text-amber-400">${saldoPendiente.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Distribución:</span>
                <span className="font-medium text-slate-200">{numeroCuotas} cuotas ({frecuenciaPago})</span>
              </div>

              <div className="flex justify-between font-bold text-cyan-400 text-sm pt-2 border-t border-dashed border-slate-800">
                <span>Valor por Cuota:</span>
                <span className="text-base font-black">${valorCuota.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between font-bold text-violet-400 text-sm pt-2 border-t border-dashed border-slate-800">

            <span>
              Primera Cuota
            </span>

            <span> 
              {fechaPrimeraCuota
                  .toLocaleDateString()
                  }
            </span>
          </div>

          <button
            onClick={procesarVenta}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-500/10 transition-all cursor-pointer transform active:scale-[0.98]"
          >
            Confirmar y Facturar Venta ⚡
          </button>
        </div>

      </div>
    </div>
  )
}

export default Ventas