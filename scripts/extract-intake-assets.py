#!/usr/bin/env python3
"""Extract the full-resolution photographs embedded in the client intake PDF.

The loose WhatsApp exports the client sent are downscaled copies (739x1600);
the same photographs are embedded in assets/oasis-construction-website-intake.pdf
at 887x1920 / 1080x1920, and the PDF additionally carries one before/after frame
that has no loose counterpart. This script writes those JPEG streams verbatim to
assets/source/ - no re-encoding, no modification of the originals.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "assets" / "oasis-construction-website-intake.pdf"
OUT = ROOT / "assets" / "source"


def main() -> None:
    data = PDF.read_bytes()
    OUT.mkdir(parents=True, exist_ok=True)
    count = 0
    for num, body in re.findall(rb"(\d+) 0 obj(.*?)endobj", data, re.S):
        if b"/DCTDecode" not in body:
            continue
        stream = re.search(rb"stream\r?\n(.*?)\r?\nendstream", body, re.S)
        width = re.search(rb"/Width (\d+)", body)
        height = re.search(rb"/Height (\d+)", body)
        if not (stream and width and height):
            continue
        name = f"obj{int(num):02d}_{width.group(1).decode()}x{height.group(1).decode()}.jpg"
        (OUT / name).write_bytes(stream.group(1))
        print(f"  {name}  ({len(stream.group(1)) / 1024:.0f} KB)")
        count += 1
    print(f"{count} JPEG streams extracted to {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
