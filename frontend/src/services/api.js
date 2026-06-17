import Swal from 'sweetalert2'

export const apiFetch = async (
  url,
  options = {}
) => {

  const token =
    localStorage.getItem('token')

  const response =
    await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`
      }
    })

  if (response.status === 401) {

    localStorage.removeItem('token')

    await Swal.fire({
      icon: 'warning',
      title: 'Sesión expirada',
      text: 'Debes iniciar sesión nuevamente'
    })

    window.location.reload()

    throw new Error(
      'Sesión expirada'
    )
  }

  return response
}