#!/usr/bin/env python3
"""Builds the site's root *.html pages from the sources in src/.

Usage:
    python3 tools/build.py

Standard library only. Each file in src/pages/ becomes the root page of the
same name. A page starts with a front-matter comment:

    <!--
    title: Research
    description: Publications, patents and copyrights.
    -->

Optional front-matter keys:
    redirect: <url>   Adds a meta refresh to the full page (used by blog.html).
    layout: redirect  Renders the bare redirect stub in src/redirect.html.

Every top-level element of a page becomes one notebook row: the element goes
in the main column and its margin notes go in the margin beside it.

    <note>text</note>           Numbered note, keyed by a Devanagari numeral.
    <note unmarked>text</note>  Margin note without a numeral (dates, labels).

{{include:path}} inserts a repo file, HTML-escaped (used for the PGP key).
"""

from __future__ import annotations

import datetime
import html
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from typing import NamedTuple

# ---------------------------------------------------------------------------
# Site settings: edit these, then rebuild.
# ---------------------------------------------------------------------------

Box = tuple[int, int, int, int]


class NavItem(NamedTuple):
    """A page in the nav graph. Nav order is page order: About is page 01.

    Attributes:
        id: Node id that assets/site.js uses to draw the graph's edges.
        file: Output file name.
        label: Text inside the nav box.
        cursor_label: What the ink cursor writes when hovering the box.
        wide_box: x, y, w, h in the wide drawing (NAV_LAYOUTS in site.js).
        side_box: x, y, w, h in the sidebar drawing.
    """

    id: str
    file: str
    label: str
    cursor_label: str
    wide_box: Box
    side_box: Box


# fmt: off
NAV = (
    #       id            file                 label         cursor label
    #       wide box                side box
    NavItem("about",      "index.html",        "About",      "about me",
            (255, 14, 130, 38),     (115, 12, 130, 36)),
    NavItem("research",   "researchlist.html", "Research",   "papers",
            (15, 88, 130, 36),      (0, 88, 80, 34)),
    NavItem("teaching",   "teaching.html",     "Teaching",   "classes",
            (175, 88, 130, 36),     (93, 88, 80, 34)),
    NavItem("talks",      "talks.html",        "Talks",      "slides + video",
            (335, 88, 130, 36),     (186, 88, 80, 34)),
    NavItem("leadership", "leadership.html",   "Leadership", "service",
            (495, 88, 130, 36),     (279, 88, 82, 34)),
    NavItem("cv",         "cv.html",           "CV",         "pdf",
            (205, 168, 110, 36),    (92, 172, 82, 34)),
    NavItem("key",        "pubkey.html",       "PGP Key",    "0x59BA0808",
            (335, 168, 110, 36),    (186, 172, 82, 34)),
)
# fmt: on

# Line spacing: the gap between the ruled lines. All vertical spacing follows.
LINE = "32px"

# Font sizes, written into every page as CSS variables (--fs-<name>) that
# assets/site.css reads. Any CSS length works: px, rem (16px), em, clamp(...).
FONT_SIZES = {
    # Body text (Google Sans).
    "body": "18px",  # Paragraphs and lists.
    "entry-title": "1em",  # Paper / course / talk titles, relative to body.
    "mono": ".85em",  # Inline monospace (email, fingerprint).
    "links": ".85rem",  # pdf / cite / web link rows.
    "key-block": ".72rem",  # The PGP key block.
    "date-label": ".8rem",  # The words "Date" and "Page".
    "label-key": ".78rem",  # Name / Class / School... in the name label.
    # Handwriting (Caveat).
    "title": "2.5rem",  # Page title (h1).
    "heading": "1.85rem",  # Section heading (h2).
    "notes": "1.2rem",  # Margin notes.
    "label-name": "2.3rem",  # The name in the label.
    "label-name-small": "2.1rem",  # ...on phones and in the sidebar.
    "label-value": "1.3rem",  # The filled-in values in the label.
    "label-key-deva": "1rem",  # नाम in the label.
    "who": "2.4rem",  # One-line name at the top of inner pages.
    "who-deva": "1.75rem",  # ...and its Devanagari.
    "date": "1.3rem",  # The filled-in date and page number.
    "toggle": "1.3rem",  # Dark mode / Light mode.
    "footer": "1.2rem",  # Copyright line.
    "footer-shloka": "1.3rem",  # The shloka (About only).
    "cursor": "1.3rem",  # Words written by the ink cursor.
    "nav": "clamp(1rem, 2.3vw, 1.22rem)",  # Nav box labels, top of page.
    "nav-sidebar": "1.0rem",  # Nav box labels in the sidebar.
    "nav-doodle": "18px",  # "entry:" and "while (phd)", drawing units.
    "nav-phi": "12px",  # The φ, drawing units.
    "bib-title": "1.4rem",  # Citation popup title.
    "bib-button": "1.2rem",  # Citation popup buttons.
    # Devanagari numerals keying the margin notes (Tiro Devanagari).
    "note-numeral": "1.05rem",  # In the margin.
    "note-ref": ".9rem",  # Superscript in the text.
    # Other monospace.
    "bib-code": ".9rem",  # BibTeX in the citation popup.
}

# ---------------------------------------------------------------------------
# Build.
# ---------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PARTIALS = ("compact", "contacts", "label", "shloka")
SITE_NAME = "Saket Upadhyay"

_DEVANAGARI_DIGITS = "०१२३४५६७८९"
_VOID_ELEMENTS = frozenset(
    {
        "area",
        "base",
        "br",
        "col",
        "embed",
        "hr",
        "img",
        "input",
        "link",
        "meta",
        "source",
        "track",
        "wbr",
    }
)
_NOTE_RE = re.compile(r"<note(\s+unmarked)?\s*>(.*?)</note>", re.S)
_FRONT_MATTER_RE = re.compile(r"\A\s*<!--(.*?)-->", re.S)
_INCLUDE_RE = re.compile(r"\{\{include:([^}]+)\}\}")
# A placeholder alone on its line is filled as an indented block; anywhere
# else it is filled inline.
_PLACEHOLDER_RE = re.compile(
    r"^(?P<indent>[ \t]*)\{\{(?P<block>\w+)\}\}[ \t]*\n"
    r"|\{\{(?P<inline>\w+)\}\}",
    re.M,
)


class BuildError(Exception):
    """A source file is malformed or refers to something that does not exist."""


def to_devanagari(number: int) -> str:
    """Returns `number` written in Devanagari digits."""
    return "".join(_DEVANAGARI_DIGITS[int(digit)] for digit in str(number))


class _TopLevelSplitter(HTMLParser):
    """Collects the source text of each top-level element of a fragment."""

    def __init__(self, source: str, name: str):
        super().__init__(convert_charrefs=False)
        self.elements: list[str] = []
        self._source = source
        self._name = name
        self._line_offsets = [0] + [m.end() for m in re.finditer("\n", source)]
        self._depth = 0
        self._element_start = 0

    def _offset(self) -> int:
        line, column = self.getpos()
        return self._line_offsets[line - 1] + column

    def _tag_end(self) -> int:
        return self._source.index(">", self._offset()) + 1

    def _close_element(self) -> None:
        self.elements.append(
            self._source[self._element_start : self._tag_end()]
        )

    def _error(self, message: str) -> BuildError:
        return BuildError(f"{self._name}, line {self.getpos()[0]}: {message}")

    def handle_starttag(self, tag, attrs):
        if self._depth == 0:
            self._element_start = self._offset()
        if tag not in _VOID_ELEMENTS:
            self._depth += 1
        elif self._depth == 0:
            self._close_element()

    def handle_startendtag(self, tag, attrs):
        if self._depth == 0:
            self._element_start = self._offset()
            self._close_element()

    def handle_endtag(self, tag):
        if tag in _VOID_ELEMENTS:
            return
        self._depth -= 1
        if self._depth < 0:
            raise self._error(f"stray </{tag}>")
        if self._depth == 0:
            self._close_element()

    def handle_data(self, data):
        if self._depth == 0 and data.strip():
            raise self._error(
                f"text outside any element: {data.strip()[:40]!r}"
            )

    def close(self):
        super().close()
        if self._depth:
            raise BuildError(f"{self._name}: unclosed element at end of file")


def split_top_level(source: str, name: str) -> list[str]:
    """Splits an HTML fragment into the source text of its top-level elements.

    Args:
        source: The HTML fragment.
        name: File name, for error messages.

    Returns:
        One string per top-level element, comments and whitespace dropped.

    Raises:
        BuildError: The fragment has stray text or unbalanced tags.
    """
    splitter = _TopLevelSplitter(source, name)
    splitter.feed(source)
    splitter.close()
    return splitter.elements


class _NoteCollector:
    """Replaces the <note> tags of one row and collects their margin notes."""

    def __init__(self, last_number: int):
        self.last_number = last_number
        self.notes: list[str] = []
        self.has_numbered = False

    def replace(self, match: re.Match[str]) -> str:
        """Returns what a <note> leaves in the text, and records the note."""
        unmarked, body = match.group(1), match.group(2).strip()
        if unmarked:
            self.notes.append(f'<p class="note">{body}</p>')
            return ""
        self.has_numbered = True
        self.last_number += 1
        n = self.last_number
        numeral = to_devanagari(n)
        self.notes.append(
            f'<p class="note" id="note-{n}" data-g="{n}">'
            f'<a class="n" href="#ref-{n}" aria-label="Back to text"'
            f' data-ink="back">{numeral}</a> {body}</p>'
        )
        return (
            f'<sup><a class="nref" id="ref-{n}" href="#note-{n}" data-g="{n}"'
            f' aria-label="Note {n}" data-ink="note">{numeral}</a></sup>'
        )


def render_rows(content: str, name: str) -> str:
    """Wraps each top-level element in a notebook row with its margin notes.

    Numbered notes count up across the whole page.

    Args:
        content: Page body from src/pages/, after front matter.
        name: File name, for error messages.

    Returns:
        The rows' HTML.
    """
    rows = []
    last_number = 0
    for element in split_top_level(content, name):
        notes = _NoteCollector(last_number)
        element = _NOTE_RE.sub(notes.replace, element)
        last_number = notes.last_number
        margin = ""
        if notes.notes:
            # Dates and labels (unmarked only) lead their entry on phones.
            css_class = "margin" if notes.has_numbered else "margin lead"
            margin = (
                f'\n  <div class="{css_class}">{"".join(notes.notes)}</div>'
            )
        rows.append(
            f'<div class="row">\n  <div class="main">{element}</div>{margin}\n'
            "</div>"
        )
    return "\n".join(rows)


def render_nav(current_id: str | None) -> str:
    """Returns the nav graph's links, with the current page marked."""
    links = []
    for item in NAV:
        is_current = item.id == current_id
        cursor_label = "you are here" if is_current else item.cursor_label
        current = ' aria-current="page"' if is_current else ""
        links.append(
            f'<a data-id="{item.id}"'
            f' data-box="{",".join(map(str, item.wide_box))}"'
            f' data-box-side="{",".join(map(str, item.side_box))}"'
            f' href="{item.file}" data-ink="{cursor_label}"{current}>'
            f"{item.label}</a>"
        )
    return "\n".join(links)


def parse_front_matter(text: str, name: str) -> tuple[dict[str, str], str]:
    """Splits a page source into its front-matter keys and its body.

    Raises:
        BuildError: The page does not start with a front-matter comment.
    """
    match = _FRONT_MATTER_RE.match(text)
    if not match:
        raise BuildError(f"{name}: missing front-matter comment")
    meta = {}
    for line in match.group(1).strip().splitlines():
        key, _, value = line.partition(":")
        meta[key.strip()] = value.strip()
    return meta, text[match.end() :]


def fill(template: str, values: dict[str, str], name: str) -> str:
    """Fills {{placeholders}} in one pass, so filled-in text is never rescanned.

    A placeholder alone on its line is replaced by its value indented to the
    placeholder's column (or by nothing, if the value is empty).

    Raises:
        BuildError: The template has a placeholder `values` doesn't define.
    """

    def lookup(key: str) -> str:
        if key not in values:
            raise BuildError(f"{name}: unknown placeholder {{{{{key}}}}}")
        return values[key]

    def replace(match: re.Match[str]) -> str:
        if match.group("inline"):
            return lookup(match.group("inline"))
        indent = match.group("indent")
        lines = lookup(match.group("block")).strip("\n").splitlines()
        return "".join(
            f"{indent}{line}\n" if line.strip() else "\n" for line in lines
        )

    return _PLACEHOLDER_RE.sub(replace, template)


def _include(match: re.Match[str]) -> str:
    return html.escape((ROOT / match.group(1).strip()).read_text().strip())


def render_page(
    source: Path, templates: dict[str, str], today: datetime.date
) -> str:
    """Renders one page from src/pages/.

    Args:
        source: The page source.
        templates: "layout", "redirect" and the partials, by name.
        today: Build date (the Date box's fallback when JS is off).

    Returns:
        The page's final HTML.
    """
    meta, body = parse_front_matter(source.read_text(), source.name)
    title = meta.get("title", "")

    if meta.get("layout") == "redirect":
        return fill(
            templates["redirect"],
            {
                "title": html.escape(title),
                "redirect": html.escape(meta["redirect"]),
            },
            source.name,
        )

    numbers = {item.file: (item.id, i) for i, item in enumerate(NAV, start=1)}
    nav_id, page_number = numbers.get(source.name, (None, None))
    is_about = nav_id == "about"
    body = _INCLUDE_RE.sub(_include, body)

    head = []
    if "redirect" in meta:
        url = html.escape(meta["redirect"])
        head.append(f'<meta http-equiv="refresh" content="0; url={url}">')
        head.append(f'<link rel="canonical" href="{url}">')
    if "data-bib" in body:
        head.append('<script defer src="assets/bibtex-db.js"></script>')
    sizes = "".join(f"--fs-{key}:{value};" for key, value in FONT_SIZES.items())

    return fill(
        templates["layout"],
        {
            "title": SITE_NAME if is_about else f"{title} | {SITE_NAME}",
            "description": html.escape(meta.get("description", "")),
            "font_sizes": f"<style>:root{{--l:{LINE};{sizes}}}</style>",
            "head": "\n".join(head),
            "body_class": "is-about" if is_about else "",
            "compact": templates["compact"],
            "date": f"{today:%d.%m.%y}",
            "page": f"{page_number:02d}" if page_number else "",
            "label": fill(
                templates["label"],
                {"name_tag": "h1" if is_about else "p"},
                "label.html",
            ),
            "nav": render_nav(nav_id),
            "contacts": templates["contacts"],
            "content": render_rows(body, source.name),
            "shloka": templates["shloka"] if is_about else "",
            "year": str(today.year),
        },
        source.name,
    )


def build() -> None:
    """Renders every page in src/pages/ into the repo root."""
    templates = {
        "layout": (SRC / "layout.html").read_text(),
        "redirect": (SRC / "redirect.html").read_text(),
    }
    for partial in PARTIALS:
        templates[partial] = (SRC / "partials" / f"{partial}.html").read_text()
    today = datetime.date.today()
    for source in sorted((SRC / "pages").glob("*.html")):
        (ROOT / source.name).write_text(render_page(source, templates, today))
        print(f"built {source.name}")


def main() -> int:
    try:
        build()
    except BuildError as error:
        print(f"build failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
