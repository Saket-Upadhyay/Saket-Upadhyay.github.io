# Saket Upadhyay


### What The Fermium?
Well, this might be a little awkward if you are here unintentionally. You have just landed on my website's GitHub repo and might come across some scary backend files, like the unmanaged wires behind shining neon lights.

> By the way, Fermium (**Fm**) is a radioactive element in periodic table with atomic number **100** (actinide series), and **1.3** Electronegativity. Just in case you actually wanted to know and don't give a Fermium about my website.

### Now?
Well, you can roam around if you want, see the raw code and all, if you are into that kind of stuff (<\_<) ... or see the better, well-laid-out version online @ [saket-upadhyay.github.io](https://saket-upadhyay.github.io)

---


> Feel free to suggest any corrections or modifications you’d like. I always appreciate different perspectives. (^\_^)

---

### Editing the site

Pages are written in `src/pages/` and built into the `*.html` files at the repo root (commit both):

```sh
python3 tools/build.py
```

- `src/layout.html` is the notebook template; `src/partials/` holds the name label, the one-line header,
  the contact icons and the shloka (About only).
- Old or external URLs are bare redirect pages: a `src/pages/*.html` whose front matter has
  `layout: redirect` and `redirect: <url>` (see `research.html`, `extras.html`).
- Nav order (and the Page number in the corner) lives in `NAV` at the top of `tools/build.py`.
- Font sizes live in `FONT_SIZES` (and the ruled-line spacing in `LINE`) in `tools/build.py`; change them and rebuild.
- The Date in the corner is filled in with the visitor's date by `assets/site.js` (the build date shows without JS).

**Margin notes.** Every top-level element in a page is one notebook row. Put a note anywhere inside it:

```html
<p>Some sentence.<note>appears in the margin, keyed by a Devanagari numeral</note></p>
<article class="entry"><note unmarked>2026</note> ... </article>   <!-- margin note without a numeral -->
```

**Fonts** are self-hosted and subset to the characters the site uses. If you add text in a new script or new
Devanagari words, refresh them (source TTFs from github.com/google/fonts go in `tools/font-src/`):

```sh
pip install fonttools brotli
python3 tools/fonts.py            # or --source DIR for fonts kept elsewhere
```
