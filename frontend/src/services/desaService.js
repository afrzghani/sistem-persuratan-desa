const BASE_URL = import.meta.env.VITE_BACKEND_URL

export async function getDesaSettings() {
  const response = await fetch(`${BASE_URL}/api/desa/settings`)
  if (!response.ok) throw new Error('Gagal memuat data desa')
  return response.json()
}

export async function updateDesaSettings(data) {
  const response = await fetch(`${BASE_URL}/api/desa/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Gagal menyimpan data desa')
  return response.json()
}

export async function uploadLogoDesa(file) {
  const formData = new FormData()
  formData.append('logo', file)

  const response = await fetch(`${BASE_URL}/api/desa/logo`, {
    method: 'POST',
    body: formData, // catatan: jangan set Content-Type manual buat FormData, browser yang atur otomatis
  })
  if (!response.ok) throw new Error('Gagal mengunggah logo')
  return response.json()
}