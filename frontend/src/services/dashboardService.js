import { request } from "./api";

export function getDashboard(year) {
  return request(`/api/dashboard?year=${encodeURIComponent(year)}`);
}
