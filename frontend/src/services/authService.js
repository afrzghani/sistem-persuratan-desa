const BASE_URL = import.meta.env.VITE_BACKEND_URL

export async function registerAdmin({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Registrasi gagal')
  }

  return response.json()
}