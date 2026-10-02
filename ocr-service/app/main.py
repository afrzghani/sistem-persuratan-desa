from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, HTTPException, Request, Depends
from starlette.concurrency import run_in_threadpool

from app.schemas import OCRResponse
from app.engine import create_ocr, read_text
from app.imaging import prepare_image, ImageValidationError
from app.parser import parse_ktp
from app.security import verify_api

MAX_FILE_SIZE = 5 * 1024 * 1024

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.ocr = create_ocr()
    try:
        yield
    finally:
        del app.state.ocr

app = FastAPI(lifespan=lifespan)

def process_image(app: FastAPI, contents: bytes) -> dict:
    image = prepare_image(contents)
    items = read_text(app.state.ocr, image)
    fields = parse_ktp(items)

    return {
        "fields": fields,
        "perlu_review": True,
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post(
    "/ocr/ktp",
    response_model=OCRResponse,
    dependencies=[Depends(verify_api)],
)
async def upload_ktp(request: Request, file: UploadFile):
    try:
        contents = await file.read(MAX_FILE_SIZE + 1)
    finally:
        await file.close()

    if not contents:
        raise HTTPException(status_code=400, detail="File kosong")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Ukuran file maksimal 5 MB",
        )

    try:
        return await run_in_threadpool(
            process_image, request.app, contents
        )
    except ImageValidationError as error:
        raise HTTPException(
            status_code=error.status_code,
            detail=str(error),
        ) from None