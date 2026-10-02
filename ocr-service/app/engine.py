from pathlib import Path
from threading import Lock
import numpy as np
from ultralytics import YOLO
from paddleocr import TextRecognition

MODEL_DIR = Path(__file__).resolve().parent.parent / "models"

def create_ocr():
    detector_dir = MODEL_DIR / "detector" / "best.pt"
    recognizer_dir = MODEL_DIR / "recognizer"

    for path in [
        detector_dir,
        *(recognizer_dir / name for name in (
            "inference.json", "inference.pdiparams", "inference.yml"
        )),
    ]:
        if not path.is_file():
            raise FileNotFoundError(f"Model tidak ditemukan: {path}")

    return {
        "detector": YOLO(str(detector_dir)),
        "recognizer": TextRecognition(
            model_name="latin_PP-OCRv5_mobile_rec",
            model_dir=str(recognizer_dir),
            device="cpu",
            enable_mkldnn=False,
        ),
        "lock": Lock(),
    }

def read_text(ocr, image: np.ndarray) -> list[dict]:
    if (
        not isinstance(image, np.ndarray)
        or image.dtype != np.uint8
        or image.ndim != 3
        or image.shape[2] != 3
        or image.size == 0
    ):
        raise ValueError("Error")

    height, width = image.shape[:2]
    items = []

    with ocr["lock"]:
        result = ocr["detector"].predict(
            source=image, device="cpu", imgsz=960,
            conf=0.10, verbose=False, save=False,
        )[0]

        if result.boxes is None:
            return []
        for box in result.boxes:
            coords = box.xyxy[0].cpu().numpy()
            if not np.isfinite(coords).all():
                raise RuntimeError("Koordinat tidak valid.")
            x1, y1 = np.maximum(
                np.floor(coords[:2]).astype(int) - 1, 0
            )
            x2, y2 = np.minimum(
                np.ceil(coords[2:]).astype(int) + 1, [width, height]
            )
            if x2 <= x1 or y2 <= y1:
                continue

            crop = np.ascontiguousarray(image[y1:y2, x1:x2])
            predictions = list(
                ocr["recognizer"].predict(input=crop, batch_size=1)
            )
            if len(predictions) != 1:
                raise RuntimeError("Hasil recognizer tidak sesuai jumlah crop.")

            rec = predictions[0]
            items.append({
                "field": result.names[int(box.cls.item())],
                "text": str(rec["rec_text"]),
                "confidence": float(rec["rec_score"]),
                "detection_confidence": float(box.conf.item()),
                "polygon": [
                    [int(x1), int(y1)], [int(x2), int(y1)],
                    [int(x2), int(y2)], [int(x1), int(y2)],
                ],
            })

    return sorted(items, key=lambda item: (
        item["polygon"][0][1], item["polygon"][0][0]
    ))