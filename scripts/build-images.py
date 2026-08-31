#!/usr/bin/env python3
"""Build every web image derivative for the Oasis Construction site.

Sources are the originals supplied by the client (assets/originals) and the
higher-resolution copies embedded in the intake PDF (assets/source, extracted
by scripts/extract-intake-assets.py). Originals are never written to.

The pipeline is entirely non-generative: letterbox / phone-UI removal,
levelling, white balance, tonal grading, chroma-noise reduction, art-directed
cropping, Lanczos resampling and AVIF/WebP/JPEG encoding. No part of any
photograph is invented, replaced or outpainted.

Usage:  python3 scripts/build-images.py [--only ID ...]
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parent))
from imagelib import (  # noqa: E402
    Tone,
    chroma_denoise,
    content_box,
    crop_ratio,
    encode,
    finish,
    grade,
    straighten,
)

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "source"
OUT = ROOT / "public" / "images"
MANIFEST = ROOT / "src" / "content" / "image-manifest.json"

RATIOS = {
    "16x10": 16 / 10,
    "3x2": 3 / 2,
    "4x3": 4 / 3,
    "1x1": 1.0,
    "4x5": 4 / 5,
    "3x4": 3 / 4,
}


@dataclass
class Variant:
    name: str
    ratio: str
    focus: tuple[float, float] = (0.5, 0.5)
    zoom: float = 1.0
    widths: tuple[int, ...] = (640, 960, 1280)


@dataclass
class Photo:
    id: str
    src: str
    origin: str
    straighten_deg: float = 0.0
    pre_crop: tuple[float, float, float, float] | None = None  # relative l,t,r,b
    half: str | None = None  # "left" | "right" for combined before/after frames
    seam: int | None = None
    tone: Tone = field(default_factory=Tone)
    variants: tuple[Variant, ...] = ()


# ---------------------------------------------------------------------------
# Art direction
# ---------------------------------------------------------------------------

PHOTOS: list[Photo] = [
    # --- Hero: front walkway in interlocking pavers with a cut-stone border ---
    Photo(
        id="allee-pave-uni-entree",
        src="obj10_887x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (3).jpeg (intake PDF, Photo 2)",
        straighten_deg=-0.4,
        tone=Tone(clarity=0.34, contrast=0.13, vibrance=0.14, shadow_lift=0.13, warmth=0.05),
        variants=(
            Variant("wide", "16x10", focus=(0.5, 0.40), widths=(960, 1280, 1600)),
            Variant("portrait", "3x4", focus=(0.5, 0.56), widths=(560, 760, 1040, 1400)),
            Variant("mobile", "4x5", focus=(0.5, 0.55), widths=(480, 720, 960)),
            Variant("square", "1x1", focus=(0.5, 0.56), widths=(480, 720, 960)),
        ),
    ),
    # --- Entrance landing + steps, new paver landing beside fresh asphalt ---
    Photo(
        id="palier-pave-uni-entree",
        src="obj09_1080x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (2).jpeg (intake PDF, Photo 1)",
        pre_crop=(0.0, 0.0, 1.0, 0.80),
        tone=Tone(clarity=0.30, contrast=0.11, vibrance=0.15, shadow_lift=0.14, warmth=0.04),
        variants=(
            Variant("wide", "3x2", focus=(0.50, 0.60), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.50, 0.55), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.50, 0.56), widths=(480, 720, 960)),
        ),
    ),
    # --- Cut-stone stairway built into a slope, retaining wall behind --------
    Photo(
        id="escalier-pierre-talus",
        src="obj14_887x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (4).jpeg (intake PDF, Photo 4)",
        tone=Tone(clarity=0.22, contrast=0.14, vibrance=0.18, shadow_lift=0.10, warmth=0.06, output_sharpen=0.38),
        variants=(
            Variant("wide", "4x3", focus=(0.5, 0.42), widths=(760, 1040, 1280)),
            Variant("portrait", "4x5", focus=(0.5, 0.50), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.48), widths=(480, 720, 960)),
        ),
    ),
    # --- Natural flagstone side walkway, freshly rinsed ---------------------
    Photo(
        id="allee-pierre-naturelle",
        src="obj17_887x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (5).jpeg (intake PDF, Photo 5)",
        tone=Tone(clarity=0.32, contrast=0.12, vibrance=0.16, shadow_lift=0.12, warmth=0.03),
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.56), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.5, 0.56), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.58), widths=(480, 720, 960)),
        ),
    ),
    # --- Retaining wall along a paver driveway ------------------------------
    Photo(
        id="muret-stationnement-pave",
        src="obj18_887x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (7).jpeg (intake PDF, Photo 7)",
        straighten_deg=-0.8,
        tone=Tone(clarity=0.30, contrast=0.10, vibrance=0.12, shadow_lift=0.14, highlight_recover=0.14),
        variants=(
            Variant("wide", "16x10", focus=(0.5, 0.5), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.52, 0.5), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.52, 0.5), widths=(480, 720, 960)),
        ),
    ),
    # --- Paver walkway with a cut edge against a planting bed ---------------
    Photo(
        id="allee-pave-bordure-jardin",
        src="obj21_887x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (9).jpeg (intake PDF, Photo 9)",
        pre_crop=(0.0, 0.0, 1.0, 0.90),
        tone=Tone(clarity=0.34, contrast=0.13, vibrance=0.18, shadow_lift=0.18, highlight_recover=0.12),
        variants=(
            Variant("wide", "3x2", focus=(0.45, 0.55), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.48, 0.55), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.48, 0.58), widths=(480, 720, 960)),
        ),
    ),
    # --- Large-format concrete slabs, side courtyard -------------------------
    Photo(
        id="dalles-beton-cour-laterale",
        src="obj22_887x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (10).jpeg (intake PDF, Photo 10)",
        tone=Tone(clarity=0.32, contrast=0.13, vibrance=0.14, shadow_lift=0.20, highlight_recover=0.10),
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.55), widths=(960, 1280, 1440)),
            Variant("portrait", "4x5", focus=(0.5, 0.55), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.55), widths=(480, 720, 960)),
        ),
    ),
    # --- Stamped-concrete pool surround (surfaces only, not pool building) ---
    Photo(
        id="contour-piscine-beton",
        src="obj26_887x1920.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46.jpeg (intake PDF, Photo 8)",
        tone=Tone(clarity=0.26, contrast=0.11, vibrance=0.10, shadow_lift=0.10, highlight_recover=0.16, warmth=-0.35, white_balance=0.75),
        variants=(
            Variant("wide", "3x2", focus=(0.5, 0.46), widths=(960, 1280, 1600)),
            Variant("portrait", "4x5", focus=(0.5, 0.48), widths=(560, 760, 1040)),
            Variant("square", "1x1", focus=(0.5, 0.48), widths=(480, 720, 960)),
        ),
    ),
    # --- Confirmed before/after #1: driveway approach, walls and steps -------
    Photo(
        id="avant-apres-entree-avant",
        src="obj13_1561x1170.jpg",
        origin="Intake PDF, Photo 3 (left half of the client's combined before/after frame)",
        half="left",
        tone=Tone(clarity=0.28, contrast=0.12, vibrance=0.14, shadow_lift=0.14),
        variants=(Variant("still", "4x5", focus=(0.51, 0.61), zoom=1.12, widths=(560, 760, 1040)),),
    ),
    Photo(
        id="avant-apres-entree-apres",
        src="obj13_1561x1170.jpg",
        origin="Intake PDF, Photo 3 (right half of the client's combined before/after frame)",
        half="right",
        tone=Tone(clarity=0.28, contrast=0.12, vibrance=0.14, shadow_lift=0.14),
        variants=(Variant("still", "4x5", focus=(0.47, 0.58), zoom=1.06, widths=(560, 760, 1040)),),
    ),
    # --- Confirmed before/after #2: side-yard flagstone walkway --------------
    Photo(
        id="avant-apres-allee-avant",
        src="obj25_1170x802.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (11).jpeg (left half of the combined frame)",
        half="left",
        tone=Tone(clarity=0.28, contrast=0.12, vibrance=0.15, shadow_lift=0.12),
        variants=(Variant("still", "4x5", focus=(0.50, 0.52), widths=(480, 720, 960)),),
    ),
    Photo(
        id="avant-apres-allee-apres",
        src="obj25_1170x802.jpg",
        origin="WhatsApp Image 2026-08-25 at 23.07.46 (11).jpeg (right half of the combined frame)",
        half="right",
        tone=Tone(clarity=0.28, contrast=0.12, vibrance=0.15, shadow_lift=0.12),
        variants=(Variant("still", "4x5", focus=(0.42, 0.52), widths=(480, 720, 960)),),
    ),
]

SEAMS = {"obj13_1561x1170.jpg": 782, "obj25_1170x802.jpg": 535}


# ---------------------------------------------------------------------------


def load_base(photo: Photo) -> Image.Image:
    im = Image.open(SRC / photo.src).convert("RGB")

    if photo.half:
        seam = SEAMS[photo.src]
        gap = 3
        im = (
            im.crop((0, 0, seam - gap, im.height))
            if photo.half == "left"
            else im.crop((seam + gap, 0, im.width, im.height))
        )
    else:
        im = im.crop(content_box(im))

    if photo.pre_crop:
        l, t, r, b = photo.pre_crop
        im = im.crop(
            (
                int(l * im.width),
                int(t * im.height),
                int(r * im.width),
                int(b * im.height),
            )
        )

    im = straighten(im, photo.straighten_deg)
    im = chroma_denoise(im, photo.tone.chroma_denoise)
    return grade(im, photo.tone)


def build_photo(photo: Photo, records: dict) -> None:
    base = load_base(photo)
    print(f"  {photo.id}: graded base {base.width}x{base.height}")
    entry = {"origin": photo.origin, "variants": {}}

    for variant in photo.variants:
        cropped = crop_ratio(base, RATIOS[variant.ratio], variant.focus, variant.zoom)
        native = cropped.width
        ratio = RATIOS[variant.ratio]
        widths = sorted({w for w in variant.widths if w <= native * 2.0})
        if not widths:
            widths = [min(variant.widths)]
        sizes = []
        for w in widths:
            h = int(round(w / ratio))
            resized = cropped.resize((w, h), Image.LANCZOS)
            resized = finish(resized, photo.tone.output_sharpen)
            encode(resized, OUT / f"{photo.id}-{variant.name}-{w}")
            sizes.append({"w": w, "h": h})
        entry["variants"][variant.name] = {
            "ratio": variant.ratio,
            "aspect": round(ratio, 6),
            "sizes": sizes,
            "path": f"/images/{photo.id}-{variant.name}",
        }
        print(
            f"     {variant.name:9s} {variant.ratio:6s} native {native}px "
            f"-> {', '.join(str(s['w']) for s in sizes)}"
        )
    records[photo.id] = entry


# ---------------------------------------------------------------------------
# Logo isolation
# ---------------------------------------------------------------------------


def build_logo(records: dict) -> None:
    src = Image.open(SRC / "obj08_500x500.jpg").convert("RGB")
    arr = np.asarray(src, dtype=np.float32)
    lum = arr.mean(axis=2)
    mask = lum > 45
    ys, xs = np.nonzero(mask)
    cx, cy = xs.mean(), ys.mean()
    radius = float(np.sqrt(mask.sum() / np.pi))

    # Pull in slightly so the JPEG fringe around the disc is discarded, then
    # flood the outermost ring with the logo's own cream so no dark halo remains.
    radius -= 2.5
    cream = np.array([245, 245, 219], dtype=np.float32)
    yy, xx = np.mgrid[0 : src.height, 0 : src.width]
    dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
    ring = np.clip((dist - (radius - 4.0)) / 4.0, 0.0, 1.0)[..., None]
    cleaned = arr * (1 - ring) + cream * ring

    ss = 4  # supersample the alpha edge
    yy2, xx2 = np.mgrid[0 : src.height * ss, 0 : src.width * ss]
    dist2 = np.sqrt(((xx2 + 0.5) / ss - cx) ** 2 + ((yy2 + 0.5) / ss - cy) ** 2)
    alpha_ss = (dist2 <= radius).astype(np.float32)
    alpha = alpha_ss.reshape(src.height, ss, src.width, ss).mean(axis=(1, 3))

    rgba = np.dstack([cleaned, alpha * 255.0]).astype(np.uint8)
    disc = Image.fromarray(rgba, "RGBA")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    brand = ROOT / "public" / "brand"
    brand.mkdir(parents=True, exist_ok=True)

    for size in (192, 512, 1024):
        up = disc.resize((size, size), Image.LANCZOS)
        up.save(brand / f"oasis-logo-{size}.png", optimize=True)
    disc.resize((512, 512), Image.LANCZOS).save(
        brand / "oasis-logo-512.webp", "WEBP", quality=92, method=6
    )

    # Favicon / touch icons: the disc, edge to edge, on the brand cream so the
    # roundel still reads at 16 px. The mark itself is untouched.
    app_dir = ROOT / "src" / "app"
    for name, size in (("icon.png", 512), ("apple-icon.png", 180)):
        canvas = Image.new("RGBA", (size, size), (245, 241, 226, 255))
        canvas.alpha_composite(disc.resize((size, size), Image.LANCZOS))
        canvas.save(app_dir / name, optimize=True)

    ico = Image.new("RGBA", (256, 256), (245, 241, 226, 255))
    ico.alpha_composite(disc.resize((256, 256), Image.LANCZOS))
    ico.save(app_dir / "favicon.ico", format="ICO", sizes=[(16, 16), (32, 32), (48, 48)])

    records["logo"] = {
        "origin": "logo.jpeg (intake PDF, Logo) - circular mark isolated from the black JPEG corners",
        "variants": {
            "mark": {
                "ratio": "1x1",
                "aspect": 1.0,
                "path": "/brand/oasis-logo",
                "sizes": [{"w": 192, "h": 192}, {"w": 512, "h": 512}, {"w": 1024, "h": 1024}],
            }
        },
    }
    print(f"  logo: disc r={radius:.1f}px centre=({cx:.1f},{cy:.1f}) -> PNG/WebP/ICO")


# ---------------------------------------------------------------------------
# Open Graph cards
# ---------------------------------------------------------------------------

OG_COPY = {
    "fr": {
        "eyebrow": "AMÉNAGEMENT EXTÉRIEUR · LAVAL & RIVE-NORD",
        "title": "Un extérieur\nfait pour durer.",
        "tagline": "Pour un oasis à votre image.",
        "foot": "Pavé uni · Murets · Drainage · Nettoyage à pression",
    },
    "en": {
        "eyebrow": "EXTERIOR CONSTRUCTION · LAVAL & NORTH SHORE",
        "title": "Outdoor spaces,\nbuilt to last.",
        "tagline": "An oasis made for you.",
        "foot": "Pavers · Retaining walls · Drainage · Pressure washing",
    },
}


def build_og(records: dict) -> None:
    fonts = Path(__file__).resolve().parent / "fonts"
    sans = fonts / "Geist-Variable.ttf"
    italic = fonts / "InstrumentSerif-Italic.ttf"

    photo = next(p for p in PHOTOS if p.id == "allee-pave-uni-entree")
    base = load_base(photo)

    W, H = 1200, 630
    for locale, copy in OG_COPY.items():
        card = Image.new("RGB", (W, H), (244, 240, 225))
        panel_w = 660

        art = crop_ratio(base, (W - panel_w) / H, (0.5, 0.55))
        art = art.resize((W - panel_w, H), Image.LANCZOS)
        card.paste(art, (panel_w, 0))

        d = ImageDraw.Draw(card)
        d.rectangle([panel_w - 1, 0, panel_w, H], fill=(36, 30, 24))

        try:
            f_eyebrow = ImageFont.truetype(str(sans), 17)
            f_eyebrow.set_variation_by_axes([600])
            f_title = ImageFont.truetype(str(sans), 68)
            f_title.set_variation_by_axes([560])
            f_tag = ImageFont.truetype(str(italic), 40)
            f_foot = ImageFont.truetype(str(sans), 19)
            f_foot.set_variation_by_axes([500])
        except Exception as exc:  # pragma: no cover - font tooling guard
            print(f"  ! OG fonts unavailable ({exc}); skipping card", file=sys.stderr)
            return

        x, y = 64, 74
        d.text((x, y), copy["eyebrow"], font=f_eyebrow, fill=(131, 90, 2))
        y += 30
        d.line([(x, y + 12), (x + 92, y + 12)], fill=(20, 187, 182), width=3)
        y += 46
        for line in copy["title"].split("\n"):
            d.text((x, y), line, font=f_title, fill=(36, 30, 24))
            y += 72
        y += 8
        d.text((x, y), copy["tagline"], font=f_tag, fill=(10, 110, 108))

        logo = Image.open(ROOT / "public" / "brand" / "oasis-logo-512.png").convert("RGBA")
        logo = logo.resize((96, 96), Image.LANCZOS)
        card.paste(logo, (x, H - 96 - 64), logo)
        d.ellipse([x, H - 96 - 64, x + 95, H - 65], outline=(131, 90, 2, 90), width=2)
        d.text((x + 118, H - 64 - 60), "OASIS CONSTRUCTION", font=f_foot, fill=(36, 30, 24))
        d.text((x + 118, H - 64 - 32), copy["foot"], font=f_foot, fill=(90, 78, 66))

        out = ROOT / "public" / "brand" / f"og-{locale}.jpg"
        card.save(out, "JPEG", quality=88, optimize=True, progressive=True)
        print(f"  og-{locale}: {out.relative_to(ROOT)}")

    records["og"] = {
        "origin": "Composed from allee-pave-uni-entree + the isolated logo mark",
        "variants": {
            "card": {
                "ratio": "1200x630",
                "aspect": round(1200 / 630, 6),
                "path": "/brand/og",
                "sizes": [{"w": 1200, "h": 630}],
            }
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", nargs="*", default=None)
    parser.add_argument("--skip-logo", action="store_true")
    args = parser.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)
    records: dict = {}
    if MANIFEST.exists():
        records = json.loads(MANIFEST.read_text())

    print("Building image derivatives…")
    if not args.skip_logo:
        build_logo(records)

    for photo in PHOTOS:
        if args.only and photo.id not in args.only:
            continue
        build_photo(photo, records)

    if not args.only:
        build_og(records)

    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(records, indent=2, ensure_ascii=False) + "\n")
    print(f"\nManifest -> {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
