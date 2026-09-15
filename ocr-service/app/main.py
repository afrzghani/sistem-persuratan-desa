from fastapi import FastAPI, UploadFile, HTTPException
from app.imaging import prepare_image, ImageValidationError

app = FastAPI()

MAX_FILE_SIZE = 5 * 1024 * 1024

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/ocr/ktp")
async def upload_ktp(file: UploadFile):
    try:
        contents = await file.read(MAX_FILE_SIZE + 1)
    finally:
        await file.close()

    if not contents:
        raise HTTPException(status_code=400, detail="File kosong")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Ukuran file maksimal 5 MB"
        )

    try:
        image_array = prepare_image(contents)
    except ImageValidationError as error:
        raise HTTPException(
            status_code=error.status_code,
            detail=str(error)
        ) from None

    height, width, channels = image_array.shape

    return {
        "message": "Gambar siap diproses",
        "width": width,
        "height": height,
        "channels": channels,
        "color_order": "BGR"
    }