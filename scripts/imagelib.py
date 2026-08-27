"""Non-generative photo-finishing helpers for the Oasis Construction site.

Every operation here is grounded in the original photograph: letterbox removal,
levelling, white balance, tonal grading, artefact reduction and Lanczos
resampling. Nothing is invented, painted in or outpainted.
"""

from __future__ import annotations

import subprocess
import shutil
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

Image.MAX_IMAGE_PIXELS = None


# --------------------------------------------------------------------------
# Letterbox / phone-UI removal
# --------------------------------------------------------------------------


def content_box(im: Image.Image, threshold: float = 26.0) -> tuple[int, int, int, int]:
    """Return the largest contiguous non-letterbox region of a screen capture.

    WhatsApp/phone screenshots pad video frames with pure black bars and can
    carry a status-bar dot or a home indicator inside those bars. Rows whose
    99th-percentile luminance is essentially black are treated as padding; the
    longest run of real rows wins, which discards the indicator artefacts.
    """
    lum = np.asarray(im.convert("RGB"), dtype=np.float32).mean(axis=2)

    def longest_run(profile: np.ndarray) -> tuple[int, int]:
        keep = np.where(profile >= threshold)[0]
        if keep.size == 0:
            return 0, profile.size - 1
        best = start = prev = int(keep[0])
        best_end = prev
        cur_start = start
        for idx in keep[1:]:
            idx = int(idx)
            if idx != prev + 1:
                if prev - cur_start > best_end - best:
                    best, best_end = cur_start, prev
                cur_start = idx
            prev = idx
        if prev - cur_start > best_end - best:
            best, best_end = cur_start, prev
        return best, best_end

    top, bottom = longest_run(np.percentile(lum, 99, axis=1))
    left, right = longest_run(np.percentile(lum, 99, axis=0))
    return left, top, right + 1, bottom + 1


# --------------------------------------------------------------------------
# Tone pipeline
# --------------------------------------------------------------------------


@dataclass
class Tone:
    """Per-photo finishing parameters. Defaults suit sunny phone captures."""

    chroma_denoise: float = 1.1  # radius, px — removes JPEG chroma mottling
    white_balance: float = 0.55  # 0 = untouched, 1 = full grey-world neutral
    black_pct: float = 0.35  # percentile mapped to black
    white_pct: float = 99.72  # percentile mapped to white
    black_headroom: float = 0.012  # keep a little density in the deepest tones
    shadow_lift: float = 0.10  # opens dense shadows
    highlight_recover: float = 0.10  # rolls off blown skies / concrete
    contrast: float = 0.12  # gentle S-curve
    vibrance: float = 0.16  # saturates muted colour only
    saturation: float = 1.0  # global multiplier applied after vibrance
    warmth: float = 0.0  # + warms, - cools (after white balance)
    clarity: float = 0.30  # large-radius local contrast
    clarity_radius: float = 0.0  # 0 = auto (width / 110)
    output_sharpen: float = 0.55
    exposure: float = 0.0  # stops


def _srgb_to_linear(x: np.ndarray) -> np.ndarray:
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def _linear_to_srgb(x: np.ndarray) -> np.ndarray:
    x = np.clip(x, 0.0, 1.0)
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * x ** (1 / 2.4) - 0.055)


def _luma(rgb: np.ndarray) -> np.ndarray:
    return rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722


def chroma_denoise(im: Image.Image, radius: float) -> Image.Image:
    """Blur only the chroma planes: kills WhatsApp colour noise, keeps detail."""
    if radius <= 0:
        return im
    ycbcr = im.convert("YCbCr")
    y, cb, cr = ycbcr.split()
    blur = ImageFilter.GaussianBlur(radius)
    return Image.merge("YCbCr", (y, cb.filter(blur), cr.filter(blur))).convert("RGB")


def grade(im: Image.Image, t: Tone) -> Image.Image:
    rgb = np.asarray(im.convert("RGB"), dtype=np.float32) / 255.0

    # --- white balance (grey-world over mid-tones only, damped) -------------
    if t.white_balance > 0:
        lum = _luma(rgb)
        mid = (lum > 0.15) & (lum < 0.92)
        if mid.sum() > 512:
            means = np.array([rgb[..., c][mid].mean() for c in range(3)])
            target = float(means.mean())
            gains = np.clip(target / np.maximum(means, 1e-4), 0.82, 1.22)
            gains = 1.0 + (gains - 1.0) * t.white_balance
            rgb = rgb * gains

    if t.warmth:
        rgb = rgb * np.array([1.0 + t.warmth * 0.06, 1.0, 1.0 - t.warmth * 0.06], dtype=np.float32)

    if t.exposure:
        rgb = _linear_to_srgb(_srgb_to_linear(np.clip(rgb, 0, 1)) * (2.0**t.exposure))

    rgb = np.clip(rgb, 0.0, 1.0)

    # --- levels -------------------------------------------------------------
    lum = _luma(rgb)
    lo = float(np.percentile(lum, t.black_pct))
    hi = float(np.percentile(lum, t.white_pct))
    lo = max(0.0, lo - t.black_headroom)
    if hi - lo > 0.08:
        rgb = np.clip((rgb - lo) / (hi - lo), 0.0, 1.0)

    # --- shadow lift / highlight roll-off ----------------------------------
    lum = _luma(rgb)
    if t.shadow_lift:
        mask = np.clip(1.0 - lum / 0.55, 0.0, 1.0) ** 1.6
        rgb = rgb + t.shadow_lift * mask[..., None] * (1.0 - rgb) * 0.55
    if t.highlight_recover:
        lum = _luma(rgb)
        mask = np.clip((lum - 0.68) / 0.32, 0.0, 1.0) ** 1.4
        rgb = rgb - t.highlight_recover * mask[..., None] * rgb * 0.42

    rgb = np.clip(rgb, 0.0, 1.0)

    # --- contrast (pivoted S-curve on luma, colour preserved) --------------
    if t.contrast:
        lum = _luma(rgb)
        pivot = 0.46
        curved = np.clip(pivot + (lum - pivot) * (1.0 + t.contrast), 0.0, 1.0)
        curved = curved + t.contrast * 0.35 * np.sin(np.pi * np.clip(lum, 0, 1)) * (curved - lum)
        ratio = np.where(lum > 1e-3, curved / np.maximum(lum, 1e-3), 1.0)
        rgb = np.clip(rgb * ratio[..., None], 0.0, 1.0)

    # --- vibrance then saturation ------------------------------------------
    lum = _luma(rgb)[..., None]
    if t.vibrance:
        chroma = rgb - lum
        current = np.abs(chroma).max(axis=2, keepdims=True) * 2.0
        boost = 1.0 + t.vibrance * np.clip(1.0 - current, 0.0, 1.0)
        rgb = np.clip(lum + chroma * boost, 0.0, 1.0)
    if t.saturation != 1.0:
        lum = _luma(rgb)[..., None]
        rgb = np.clip(lum + (rgb - lum) * t.saturation, 0.0, 1.0)

    out = Image.fromarray((rgb * 255.0 + 0.5).astype(np.uint8), "RGB")

    # --- clarity: unsharp mask with a large radius on luminance ------------
    if t.clarity:
        radius = t.clarity_radius or max(6.0, out.width / 110.0)
        blurred = out.filter(ImageFilter.GaussianBlur(radius))
        base = np.asarray(out, dtype=np.float32)
        soft = np.asarray(blurred, dtype=np.float32)
        detail = _luma(base) - _luma(soft)
        strength = np.clip(1.0 - np.abs(_luma(base) / 255.0 - 0.5) * 1.15, 0.25, 1.0)
        out = Image.fromarray(
            np.clip(base + (detail * strength * t.clarity)[..., None], 0, 255).astype(
                np.uint8
            ),
            "RGB",
        )

    return out


def finish(im: Image.Image, amount: float) -> Image.Image:
    """Output sharpening, applied after the final resample."""
    if amount <= 0:
        return im
    return im.filter(
        ImageFilter.UnsharpMask(radius=0.9, percent=int(round(amount * 100)), threshold=3)
    )


# --------------------------------------------------------------------------
# Cropping
# --------------------------------------------------------------------------


def crop_ratio(
    im: Image.Image,
    ratio: float,
    focus: tuple[float, float] = (0.5, 0.5),
    zoom: float = 1.0,
) -> Image.Image:
    """Crop to `ratio` (w/h), keeping `focus` (0-1 relative) centred where possible."""
    w, h = im.size
    if w / h > ratio:
        ch = h
        cw = ch * ratio
    else:
        cw = w
        ch = cw / ratio
    cw, ch = cw / zoom, ch / zoom
    cx, cy = focus[0] * w, focus[1] * h
    x0 = min(max(cx - cw / 2.0, 0.0), w - cw)
    y0 = min(max(cy - ch / 2.0, 0.0), h - ch)
    return im.crop(
        (int(round(x0)), int(round(y0)), int(round(x0 + cw)), int(round(y0 + ch)))
    )


def straighten(im: Image.Image, degrees: float) -> Image.Image:
    """Rotate then trim the wedge-shaped empty corners the rotation creates."""
    if not degrees:
        return im
    rotated = im.rotate(degrees, resample=Image.BICUBIC, expand=False)
    rad = abs(np.deg2rad(degrees))
    w, h = im.size
    scale = 1.0 / (abs(np.cos(rad)) + abs(np.sin(rad)) * max(w / h, h / w))
    nw, nh = int(w * scale), int(h * scale)
    return rotated.crop(((w - nw) // 2, (h - nh) // 2, (w + nw) // 2, (h + nh) // 2))


# --------------------------------------------------------------------------
# Encoding
# --------------------------------------------------------------------------

AVIFENC = shutil.which("avifenc")
CWEBP = shutil.which("cwebp")


def encode(im: Image.Image, out_base: Path, jpeg_quality: int = 82) -> list[Path]:
    out_base.parent.mkdir(parents=True, exist_ok=True)
    written: list[Path] = []

    jpg = out_base.with_suffix(".jpg")
    im.save(jpg, "JPEG", quality=jpeg_quality, optimize=True, progressive=True, subsampling=1)
    written.append(jpg)

    if CWEBP:
        webp = out_base.with_suffix(".webp")
        subprocess.run(
            [CWEBP, "-quiet", "-q", "76", "-m", "6", "-sharp_yuv", str(jpg), "-o", str(webp)],
            check=True,
        )
        written.append(webp)

    if AVIFENC:
        avif = out_base.with_suffix(".avif")
        subprocess.run(
            [
                AVIFENC, "--speed", "4", "--jobs", "all", "--min", "20", "--max", "36",
                "--yuv", "420", "--depth", "8", str(jpg), str(avif),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        written.append(avif)

    return written

