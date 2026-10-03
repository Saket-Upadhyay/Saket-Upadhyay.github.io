#!/usr/bin/env python3
"""Subsets the self-hosted fonts in assets/fonts/ to the characters in use.

Usage:
    pip install fonttools brotli
    python3 tools/fonts.py [--source DIR]

Run after tools/build.py whenever the pages gain characters the fonts don't
cover yet (a new Devanagari word, say); missing characters fall back to
system fonts. Source fonts default to tools/font-src/ (git-ignored), from
github.com/google/fonts:

    ofl/caveat/Caveat[wght].ttf
    ofl/kalam/Kalam-Regular.ttf, ofl/kalam/Kalam-Bold.ttf
    ofl/googlesans/GoogleSans[GRAD,opsz,wght].ttf
    ofl/googlesans/GoogleSans-Italic[GRAD,opsz,wght].ttf
    ofl/tirodevanagarisanskrit/TiroDevanagariSanskrit-Regular.ttf
"""

from __future__ import annotations

import argparse
from collections.abc import Callable, Sequence
import html
import io
from pathlib import Path
import re
from typing import NamedTuple

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "fonts"

# Printable ASCII and the typographic marks the templates and JS use.
BASE_CHARS = "".join(map(chr, range(0x20, 0x7F))) + "–—‘’“”…×→←↑↗•©°φ·"
DEVANAGARI_NUMERALS = "०१२३४५६७८९"
# Elements set in bold Caveat: headings and the one-line name.
BOLD_HAND_RE = r"<h[12]\b.*?</h[12]>|<p class=\"who\">.*?</p>"
# Layout features kept for Latin text. calt swaps in alternate letterforms so
# repeated letters don't look stamped; it costs ~20 KB but is most of what
# makes Caveat read as handwriting.
LATIN_FEATURES = ("kern", "liga", "calt", "locl")
ALL_FEATURES = ("*",)

_JOINERS = "‌‍◌"  # ZWNJ, ZWJ and the dotted circle.


def is_devanagari(char: str) -> bool:
    """Returns whether `char` is needed to shape Devanagari."""
    return "ऀ" <= char <= "ॿ" or char in _JOINERS


def is_extra_script(char: str) -> bool:
    """Returns whether `char` belongs in Google Sans's on-demand extra file.

    Cyrillic and Devanagari only appear in body text on the Name and Blog
    pages, so they live in a file the browser fetches only there (see the
    unicode-range rules in assets/site.css).
    """
    return "Ѐ" <= char <= "ӿ" or is_devanagari(char)


def site_text(only: str | None = None) -> str:
    """Returns the visible text of every built page using site.css.

    Args:
        only: If set, a regex; only text inside matching elements is returned.
    """
    text = []
    for page in ROOT.glob("*.html"):
        source = page.read_text()
        if "assets/site.css" not in source:
            continue
        source = re.sub(
            r"<(script|style)\b.*?</\1>|<!--.*?-->", "", source, flags=re.S
        )
        if only:
            source = " ".join(re.findall(only, source, flags=re.S))
        text.append(html.unescape(re.sub(r"<[^>]+>", " ", source)))
    return "".join(text)


def _chars(text: str, keep: Callable[[str], bool] = lambda _: True) -> str:
    """Returns the distinct characters of `text` that `keep` accepts."""
    return "".join(sorted({c for c in text if keep(c)} - set("\n\t\r")))


class Output(NamedTuple):
    """One subset font file.

    Attributes:
        source: Source font file name, in the source directory.
        axes: Variable-font axes to pin; empty for static fonts.
        name: Output file name, in assets/fonts/.
        text: Characters to keep.
        features: OpenType layout features to keep.
        style_suffix: Appended to an instance's style name, so files sharing
            a weight (split by unicode-range) still get unique names.
    """

    source: str
    axes: dict[str, float]
    name: str
    text: str
    features: Sequence[str]
    style_suffix: str = ""


def outputs() -> list[Output]:
    """Returns every font file the site uses, with what each must contain."""
    used = site_text() + BASE_CHARS
    bold = site_text(BOLD_HAND_RE) + BASE_CHARS
    latin = _chars(used, lambda c: not is_extra_script(c))
    sans = "GoogleSans[GRAD,opsz,wght].ttf"
    sans_italic = "GoogleSans-Italic[GRAD,opsz,wght].ttf"
    sans_axes = {"GRAD": 0, "opsz": 18}
    # fmt: off
    return [
        # Handwriting. Kalam only fills in Caveat's missing Devanagari.
        Output("Caveat[wght].ttf", {"wght": 400}, "caveat-400.woff2",
               _chars(used), LATIN_FEATURES),
        Output("Caveat[wght].ttf", {"wght": 700}, "caveat-700.woff2",
               _chars(bold), LATIN_FEATURES),
        Output("Kalam-Regular.ttf", {}, "kalam-400.woff2",
               _chars(used, is_devanagari), ALL_FEATURES),
        Output("Kalam-Bold.ttf", {}, "kalam-700.woff2",
               _chars(bold, is_devanagari) or "क", ALL_FEATURES),
        # Body text.
        Output(sans, {**sans_axes, "wght": 400}, "google-sans-400.woff2",
               latin, LATIN_FEATURES),
        Output(sans, {**sans_axes, "wght": 400}, "google-sans-400-extra.woff2",
               _chars(used, is_extra_script) + " ", ALL_FEATURES, "Extra"),
        Output(sans, {**sans_axes, "wght": 600}, "google-sans-600.woff2",
               latin, LATIN_FEATURES),
        Output(sans_italic, {**sans_axes, "wght": 400},
               "google-sans-italic-400.woff2", latin, LATIN_FEATURES),
        # Numerals keying the margin notes.
        Output("TiroDevanagariSanskrit-Regular.ttf", {},
               "tiro-devanagari-numerals.woff2", DEVANAGARI_NUMERALS,
               ALL_FEATURES),
    ]
    # fmt: on


_WEIGHT_NAMES = {400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold"}


def _rename_instance(font: TTFont, weight: int, suffix: str = "") -> None:
    """Gives a pinned instance its own style name, e.g. "Google Sans SemiBold".

    The instancer leaves every instance named after the variable font's
    default ("Regular"). Safari caches web fonts by PostScript name, so
    same-named files for different weights can stand in for each other.
    """
    names = font["name"]
    family = names.getBestFamilyName()
    italic = "Italic" in (names.getBestSubFamilyName() or "")
    style = _WEIGHT_NAMES.get(weight, str(weight))
    if italic:
        style = "Italic" if style == "Regular" else f"{style} Italic"
    if suffix:
        style = f"{style} {suffix}"
    postscript = f"{family}-{style}".replace(" ", "")
    for name_id, value in (
        (2, style),
        (4, f"{family} {style}"),
        (6, postscript),
        (17, style),
    ):
        names.setName(value, name_id, 3, 1, 0x409)
    font["OS/2"].usWeightClass = weight


def load(path: Path, axes: dict[str, float]) -> TTFont:
    """Loads a font, pinning the given variable axes to static values."""
    font = TTFont(path)
    if not axes:
        return font
    font = instancer.instantiateVariableFont(font, axes)
    # Round-trip so the subsetter sees fully compiled tables.
    buffer = io.BytesIO()
    font.save(buffer)
    buffer.seek(0)
    return TTFont(buffer)


def write_subset(font: TTFont, output: Output) -> None:
    """Subsets `font` and saves it as WOFF2 in assets/fonts/."""
    options = subset.Options()
    options.layout_features = list(output.features)
    options.hinting = False
    options.desubroutinize = True
    options.name_IDs = ["*"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=output.text)
    subsetter.subset(font)
    path = OUT / output.name
    font.flavor = "woff2"
    font.save(path)
    print(f"{output.name}: {path.stat().st_size / 1024:.1f} KB")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--source",
        type=Path,
        default=ROOT / "tools" / "font-src",
        help="directory holding the source TTFs (default: tools/font-src)",
    )
    source_dir = parser.parse_args().source
    OUT.mkdir(parents=True, exist_ok=True)
    instances: dict[tuple[str, tuple], bytes] = {}
    for output in outputs():
        # Instancing is slow (~30 s for Google Sans), so reuse each instance.
        key = (output.source, tuple(sorted(output.axes.items())))
        if key not in instances:
            buffer = io.BytesIO()
            load(source_dir / output.source, output.axes).save(buffer)
            instances[key] = buffer.getvalue()
        font = TTFont(io.BytesIO(instances[key]))
        if output.axes:
            _rename_instance(
                font, int(output.axes.get("wght", 400)), output.style_suffix
            )
        write_subset(font, output)


if __name__ == "__main__":
    main()
