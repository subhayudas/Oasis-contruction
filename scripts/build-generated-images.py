#!/usr/bin/env python3
"""Build web derivatives for the site's *illustrative* photography.

These frames are AI-generated (OpenArt / GPT Image 2) and live in
assets/generated. They illustrate the trades Oasis Construction performs —
paver work, retaining walls, drainage, pressure washing — and they carry the
site everywhere EXCEPT the project sections.

They are deliberately kept apart from scripts/build-images.py, which handles
the client's own jobsite photographs. That separation is the point: every
photograph of a real Oasis project is processed there and shown only in the
project galleries; nothing generated is ever presented as a completed job.
Each manifest entry records its generated origin.

Processing here is intentionally minimal — art-directed cropping, Lanczos
resampling, output sharpening and AVIF/WebP/JPEG encoding. No tonal grading:
the frames are already finished.

Usage:  python3 scripts/build-generated-images.py [--only ID ...]
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from imagelib import Tone, crop_ratio, encode, finish  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "generated"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "content" / "image-manifest.json"

RATIOS = {
    "21x9": 21 / 9,
    "16x9": 16 / 9,
    "16x10": 16 / 10,
    "3x2": 3 / 2,
    "4x3": 4 / 3,
    "1x1": 1.0,
    "4x5": 4 / 5,
    "3x4": 3 / 4,
}

# The frames arrive finished; only sharpen what the resample softened.
FLAT = Tone(
    chroma_denoise=0.0,
    white_balance=0.0,
    black_pct=0.02,
    white_pct=99.99,
    black_headroom=0.02,
    shadow_lift=0.0,
    highlight_recover=0.0,
    contrast=0.0,
    vibrance=0.0,
    clarity=0.0,
    output_sharpen=0.42,
)


@dataclass
class Variant:
    name: str
    ratio: str
    focus: tuple[float, float] = (0.5, 0.5)
    zoom: float = 1.0
    widths: tuple[int, ...] = (640, 960, 1280)


@dataclass
class Frame:
    id: str
    src: str
    prompt: str
    variants: tuple[Variant, ...]


# ---------------------------------------------------------------------------
# Art direction
# ---------------------------------------------------------------------------

FRAMES: list[Frame] = [
    # --- Home hero: full-bleed dusk establishing shot behind the headline ---
    Frame(
        id="scene-entree-crepuscule",
        src="hero-oasis-driveway-dusk.jpg",
        prompt="Paver driveway, retaining wall and lit entrance at dusk, suburban Quebec",
        variants=(
            Variant("wide", "21x9", focus=(0.5, 0.5), widths=(1280, 1920, 2560)),
            # Keep the maple and the retaining wall in frame — they are the
            # landscaping in the shot; the lit door alone is just a house.
            Variant("landscape", "16x9", focus=(0.44, 0.5), widths=(960, 1280, 1600)),
            Variant("mobile", "4x5", focus=(0.55, 0.54), widths=(640, 900, 1200)),
        ),
    ),
    # --- Service: pavé uni ---------------------------------------------------
    Frame(
        id="scene-pave-uni-allee",
        src="service-pave-uni-hero.jpg",
        prompt="Herringbone paver driveway with soldier-course border, golden hour",
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.55), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.45, 0.55), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.46, 0.55), widths=(480, 720, 960)),
        ),
    ),
    Frame(
        id="scene-pave-uni-pose",
        src="service-pave-uni-detail.jpg",
        prompt="Paver set by hand on screeded bedding sand, string line and mallet",
        variants=(
            Variant("portrait", "4x5", focus=(0.5, 0.55), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.55), widths=(480, 720, 960)),
        ),
    ),
    # --- Service: murets -----------------------------------------------------
    Frame(
        id="scene-muret-talus",
        src="service-muret-hero.jpg",
        prompt="Segmental block retaining wall along a driveway with stone steps",
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.5), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.55, 0.5), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.55, 0.5), widths=(480, 720, 960)),
        ),
    ),
    Frame(
        id="scene-muret-assise",
        src="service-muret-detail.jpg",
        prompt="Top course of a block wall levelled, drainage stone and geotextile behind",
        variants=(
            Variant("portrait", "4x5", focus=(0.5, 0.48), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.48), widths=(480, 720, 960)),
        ),
    ),
    # --- Service: drainage ---------------------------------------------------
    Frame(
        id="scene-drainage-tranchee",
        src="service-drainage-hero.jpg",
        prompt="French drain trench along a foundation: perforated pipe, stone, geotextile",
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.5), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.55, 0.5), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.55, 0.5), widths=(480, 720, 960)),
        ),
    ),
    Frame(
        id="scene-drainage-drain",
        src="service-drainage-detail.jpg",
        prompt="Perforated pipe wrapped in geotextile and bedded in washed stone, catch basin",
        variants=(
            Variant("portrait", "4x5", focus=(0.5, 0.5), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.5), widths=(480, 720, 960)),
        ),
    ),
    # --- Service: nettoyage à pression ---------------------------------------
    Frame(
        id="scene-nettoyage-allee",
        src="service-nettoyage-hero.jpg",
        prompt="Pressure washing a paver driveway, clean/dirty demarcation line",
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.55), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.42, 0.58), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.44, 0.58), widths=(480, 720, 960)),
        ),
    ),
    Frame(
        id="scene-nettoyage-jet",
        src="service-nettoyage-detail.jpg",
        prompt="High-pressure fan striking flagstone joints, clean strip appearing",
        variants=(
            Variant("portrait", "4x5", focus=(0.5, 0.5), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.5), widths=(480, 720, 960)),
        ),
    ),
    # --- Crew at work, used on the about page --------------------------------
    Frame(
        id="scene-equipe-chantier",
        src="about-crew-laying-pavers.jpg",
        prompt="Two-person crew laying pavers, plate compactor and screed rails, golden hour",
        variants=(
            Variant("portrait", "3x4", focus=(0.5, 0.52), widths=(560, 760, 1040)),
            Variant("wide", "4x3", focus=(0.5, 0.55), widths=(760, 1040, 1280)),
            Variant("square", "1x1", focus=(0.5, 0.54), widths=(480, 720, 960)),
        ),
    ),
    # --- Finished terrace, the "what it becomes" frame ------------------------
    Frame(
        id="scene-terrasse-finie",
        src="about-terrasse-finie.jpg",
        prompt="Large-format slab terrace with a seat wall at golden hour",
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.5), widths=(960, 1280, 1600)),
            Variant("banner", "21x9", focus=(0.5, 0.52), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.5, 0.5), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.52), widths=(480, 720, 960)),
        ),
    ),
    # --- Craft detail for the dark band on the home page ---------------------
    Frame(
        id="scene-cordeau-sable",
        src="craft-cordeau-sable.jpg",
        prompt="String line over screeded bedding sand at dusk, screed rail and mallet",
        variants=(
            Variant("portrait", "4x5", focus=(0.5, 0.5), widths=(560, 760, 1040)),
            Variant("wide", "4x3", focus=(0.5, 0.5), widths=(760, 1040, 1280)),
            Variant("square", "1x1", focus=(0.5, 0.5), widths=(480, 720, 960)),
        ),
    ),
    # --- Survey / measuring, opens the process section ------------------------
    Frame(
        id="scene-releve-niveau",
        src="process-releve-niveau.jpg",
        prompt="Rotary laser level on a settled paver driveway during a site survey",
        variants=(
            Variant("banner", "21x9", focus=(0.5, 0.55), widths=(960, 1280, 1600)),
            Variant("wide", "16x9", focus=(0.5, 0.5), widths=(960, 1280, 1600)),
            Variant("square", "1x1", focus=(0.5, 0.55), widths=(480, 720, 960)),
        ),
    ),
    # --- Natural stone entrance, used on the services and contact pages ------
    Frame(
        id="scene-entree-pierre",
        src="entree-pierre-naturelle.jpg",
        prompt="Flagstone walkway curving to a covered entrance, planting bed alongside",
        variants=(
            Variant("wide", "16x9", focus=(0.5, 0.5), widths=(960, 1280, 1600)),
            Variant("banner", "21x9", focus=(0.5, 0.52), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.55, 0.5), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.52, 0.52), widths=(480, 720, 960)),
        ),
    ),
]


# ---------------------------------------------------------------------------


def build_frame(frame: Frame, records: dict) -> None:
    base = Image.open(SRC / frame.src).convert("RGB")
    print(f"  {frame.id}: source {base.width}x{base.height}")
    entry = {
        "origin": f"AI-generated illustrative photography (OpenArt, GPT Image 2) — {frame.prompt}. "
        f"Source file assets/generated/{frame.src}. Not a photograph of an Oasis Construction project.",
        "generated": True,
        "variants": {},
    }

    for variant in frame.variants:
        ratio = RATIOS[variant.ratio]
        cropped = crop_ratio(base, ratio, variant.focus, variant.zoom)
        native = cropped.width
        widths = sorted({w for w in variant.widths if w <= native * 1.6})
        if not widths:
            widths = [min(variant.widths)]
        sizes = []
        for w in widths:
            h = int(round(w / ratio))
            resized = cropped.resize((w, h), Image.LANCZOS)
            resized = finish(resized, FLAT.output_sharpen)
            encode(resized, OUT / f"{frame.id}-{variant.name}-{w}")
            sizes.append({"w": w, "h": h})
        entry["variants"][variant.name] = {
            "ratio": variant.ratio,
            "aspect": round(ratio, 6),
            "sizes": sizes,
            "path": f"/images/{frame.id}-{variant.name}",
        }
        print(
            f"     {variant.name:10s} {variant.ratio:6s} native {native}px "
            f"-> {', '.join(str(s['w']) for s in sizes)}"
        )
    records[frame.id] = entry


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", nargs="*", default=None)
    args = parser.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    records: dict = {}
    if MANIFEST.exists():
        records = json.loads(MANIFEST.read_text())

    print("Building generated-image derivatives…")
    for frame in FRAMES:
        if args.only and frame.id not in args.only:
            continue
        build_frame(frame, records)

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print(f"\nManifest -> {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
