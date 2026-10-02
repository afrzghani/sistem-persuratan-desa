import re
from datetime import date

FIELD_NAMES = (
    "provinsi", "kota_kab", "nik", "nama", "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "gol_darah", "alamat", "rt", "rw", "kel_desa", "kecamatan", "agama", "perkawinan", "pekerjaan", "kewarganegaraan", "berlaku",
)

def clean_value(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip().lstrip(":").strip()

def parse_date(text: str, reject_future: bool = False):
    match = re.fullmatch(
        r"([0-9]{1,2})\s*[-/.]\s*([0-9]{1,2})\s*[-/.]\s*([0-9]{4})",
        text.strip(),
    )
    if not match:
        return None

    day, month, year = map(int, match.groups())
    try:
        result = date(year, month, day)
    except ValueError:
        return None
    if reject_future and result > date.today():
        return None

    return result.isoformat()

def collect_values(items: list[dict]) -> dict:
    groups = {}

    for item in items:
        text = clean_value(item["text"])
        if text:
            groups.setdefault(item["field"], []).append((item, text))

    values = {}

    for field, rows in groups.items():
        rows.sort(key=lambda row: (
            min(p[1] for p in row[0]["polygon"]),
            min(p[0] for p in row[0]["polygon"]),
        ))

        if field in {"nama", "alamat"} and len(rows) > 1:
            separated = all(
                max(p[1] for p in first[0]["polygon"])
                <= min(p[1] for p in second[0]["polygon"])
                for first, second in zip(rows, rows[1:])
            )

            if separated:
                values[field] = " ".join(text for _, text in rows)
                continue
        _, text = max(
            rows,
            key=lambda row: row[0]["detection_confidence"]
        )
        values[field] = text
    return values


def parse_ktp(items: list[dict]) -> dict:
    values = collect_values(items)
    fields = {name: values.get(name) for name in FIELD_NAMES}

    nik = values.get("nik", "")
    nik = re.sub(r"\s+", "", values.get("nik", ""))
    fields["nik"] = nik if re.fullmatch(r"[0-9]{16}", nik) else None

    provinsi = values.get("provinsi", "")
    fields["provinsi"] = re.sub(
        r"^PROVINSI\s+", "", provinsi, flags=re.IGNORECASE
    ).strip().upper() or None

    ttl = re.fullmatch(
        r"(.*?)\s*([0-9]{1,2}\s*[-/.]\s*[0-9]{1,2}\s*[-/.]\s*[0-9]{4})",
        values.get("ttl", ""),
    )
    if ttl:
        fields["tempat_lahir"] = ttl[1].strip(" ,;:") or None
        fields["tanggal_lahir"] = parse_date(
            ttl[2], reject_future=True
        )

    jenis_kelamin = re.sub(
        r"[\s-]+", "", values.get("jenis_kelamin", "").upper()
    )
    fields["jenis_kelamin"] = {
        "LAKILAKI": "LAKI-LAKI",
        "PEREMPUAN": "PEREMPUAN",
    }.get(jenis_kelamin)

    gol_darah = values.get("gol_darah", "").upper().replace(" ", "")
    fields["gol_darah"] = (
        gol_darah if gol_darah in {"A", "B", "AB", "O", "-"} else None
    )

    rt_rw = re.fullmatch(
        r"([0-9]{1,3})\s*/\s*([0-9]{1,3})",
        values.get("rt_rw", ""),
    )
    if rt_rw:
        fields["rt"], fields["rw"] = rt_rw.groups()

    for field in (
        "kota_kab", "agama", "perkawinan",
        "pekerjaan", "kewarganegaraan",
    ):
        if fields[field]:
            fields[field] = fields[field].upper()

    berlaku = values.get("berlaku", "")
    fields["berlaku"] = (
        "SEUMUR HIDUP"
        if re.sub(r"\s+", "", berlaku).upper() == "SEUMURHIDUP"
        else parse_date(berlaku)
    )
    return fields