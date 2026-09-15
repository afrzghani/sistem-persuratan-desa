from io import BytesIO
from PIL import Image, ImageOps, UnidentifiedImageError
import numpy as np

MAX_IMAGE_PIXELS = 16_000_000

class ImageValidationError(Exception):
    def __init__(self, message: str, status_code: int):
        super().__init__(message)
        self.status_code = status_code
    
def validate_image(contents: bytes) -> dict:
    try:
        with Image.open(BytesIO(contents)) as image:
            image_format = image.format
            width, height = image.size

            if image_format not in {"JPG", "JPEG", "PNG"}:
                raise ImageValidationError(
                "Format gambar harus JPG atau PNG", 415
            )

        if width * height > MAX_IMAGE_PIXELS:
            raise ImageValidationError(
                "Resolusi gambar terlalu besar", 413
            )

        if getattr(image, "n_frames", 1) != 1:
            raise ImageValidationError(
                "File tidak didukung", 415
            )

        image.verify()

    except Image.DecompressionBombError:
        raise ImageValidationError(
        "Resolusi gambar terlalu besar", 413
        ) from None

    except (UnidentifiedImageError, OSError, SyntaxError, ValueError):
        raise ImageValidationError(
        "File tidak valid", 422
        ) from None

    return {
        "format": image_format,
        "width": width,
        "height": height
    }

def prepare_image(contents: bytes) -> np.ndarray:
    validate_image(contents)

    try:
        with Image.open(BytesIO(contents)) as image:
            image.load()
            oriented = ImageOps.exif_transpose(image)

            rgba = oriented.convert("RGBA")
            background = Image.new("RGBA", rgba.size, "white")
            background.alpha_composite(rgba)

            rgb = background.convert("RGB")
            rgb_array = np.array(rgb)

            bgr_array = rgb_array[:, :, ::-1].copy()

            return bgr_array

    except (OSError, SyntaxError, ValueError):
        raise ImageValidationError(
            "Gambar gagal diproses", 422
        ) from None