from pydantic import BaseModel, Field

class KTPFields(BaseModel):
    provinsi: str | None
    kota_kab: str | None
    nik: str | None
    nama: str | None
    tempat_lahir: str | None
    tanggal_lahir: str | None
    jenis_kelamin: str | None
    gol_darah: str | None
    alamat: str | None
    rt: str | None
    rw: str | None
    kel_desa: str | None
    kecamatan: str | None
    agama: str | None
    perkawinan: str | None
    pekerjaan: str | None
    kewarganegaraan: str | None
    berlaku: str | None

class OCRItem(BaseModel):
    text: str
    confidence: float = Field(ge=0, le=1)
    polygon: list[tuple[float, float]] = Field(
        min_length=4,
        max_length=4,
    )

class OCRResponse(BaseModel):
    fields: KTPFields
    perlu_review: bool