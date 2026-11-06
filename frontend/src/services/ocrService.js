import { request } from "./api";

export function extractKtp(file) {
  const formData = new FormData();
  formData.append("file", file);

  return request("/api/ocr/ktp", {
    method: "POST",
    body: formData,
  });
}
