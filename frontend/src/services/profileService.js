const BASE_URL = import.meta.env.VITE_BACKEND_URL

export async function getAdminProfile() {
  const response = await fetch(`${BASE_URL}/api/admin/profile`)
  if (!response.ok) throw new Error('Gagal memuat profil admin')
  return response.json()
}

export async function updateAdminProfile({ name, email }) {
  const response = await fetch(`${BASE_URL}/api/admin/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email }),
  })
  if (!response.ok) throw new Error('Gagal menyimpan profil admin')
  return response.json()
}

export async function changePassword({ currentPassword, newPassword }) {
  const response = await fetch(`${BASE_URL}/api/admin/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Gagal mengubah password')
  }
  return response.json()
}