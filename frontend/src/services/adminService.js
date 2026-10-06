const BASE_URL = import.meta.env.VITE_BACKEND_URL

export async function getAdmins() {
  const response = await fetch(`${BASE_URL}/api/admins`)

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Gagal mengambil data admin'
    )
  }

  return response.json()
}

export async function createAdmin({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/api/admins`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Gagal menambahkan admin'
    )
  }

  return response.json()
}

export async function updateAdmin(id, { name, email }) {
  const response = await fetch(`${BASE_URL}/api/admins/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Gagal mengubah data admin'
    )
  }

  return response.json()
}

export async function deactivateAdmin(id) {
  const response = await fetch(`${BASE_URL}/api/admins/${id}/deactivate`, {
    method: 'PATCH',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)

    throw new Error(
      errorData?.message || 'Gagal menonaktifkan admin'
    )
  }

  return response.json()
}