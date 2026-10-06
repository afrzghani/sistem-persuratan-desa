const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getDashboard(year) {
  const response = await fetch(`${BASE_URL}/api/dashboard?year=${year}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message || "Gagal mengambil data dashboard"
    );
  }

  return response.json();
}