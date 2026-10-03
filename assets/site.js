/**
 * @fileoverview Notebook site behaviour: theme toggle, Date box, sketched
 * navigation graph, rule snapping, margin-note pairing, ink cursor, BibTeX
 * dialog, and a note for whoever opens devtools.
 */

(() => {
  'use strict';

  /**
   * Wide landscape screens get the fixed sidebar. Must match the media query
   * of the sidebar block in site.css.
   */
  const SIDEBAR_QUERY = '(min-width: 1200px) and (orientation: landscape)';

  /** The ink cursor and hover tilts are off for touch and reduced motion. */
  const NO_TRAIL_QUERY = '(hover: none), (prefers-reduced-motion: reduce)';

  /** Key the inline <head> snippet reads the saved theme from. */
  const THEME_STORAGE_KEY = 'vision';

  /**
   * One drawing of the nav graph. Box coordinates live on each link
   * (data-box / data-box-side, written by tools/build.py) in viewBox units.
   * @typedef {{
   *   viewBox: {x: number, y: number, w: number, h: number},
   *   boxAttr: string,
   *   phi: !Array<number>,
   *   loopLabel: !Array<number>,
   * }}
   */
  let NavLayout;

  /** @const {!Object<string, !NavLayout>} */
  const NAV_LAYOUTS = {
    wide: {
      viewBox: {x: -40, y: 0, w: 700, h: 210},
      boxAttr: 'box',
      phi: [320, 146],
      loopLabel: [-36, 58],
    },
    side: {
      viewBox: {x: -40, y: 0, w: 420, h: 220},
      boxAttr: 'boxSide',
      phi: [180, 150],
      loopLabel: [-2, 64],
    },
  };

  /** Sections that branch from About and merge again at the φ node. */
  const NAV_SECTIONS = ['research', 'teaching', 'talks', 'leadership'];

  /** Pages that follow the φ node. */
  const NAV_EXITS = ['cv', 'key'];

  /** Seed for the wobble, so the graph is drawn the same on every load. */
  const SKETCH_SEED = 7;

  /** Fraction of the remaining distance the ink cursor keeps per interval. */
  const TRAIL_EASE = 0.55;

  /** Easing interval in ms; makes the cursor speed frame-rate independent. */
  const TRAIL_INTERVAL_MS = 62;

  /** Applies the theme toggle buttons. */
  function initTheme() {
    const root = document.documentElement;
    const isDark = () => root.dataset.theme === 'dark';
    for (const button of document.querySelectorAll('[data-theme-toggle]')) {
      button.addEventListener('click', () => {
        root.dataset.theme = isDark() ? 'light' : 'dark';
        try {
          localStorage.setItem(THEME_STORAGE_KEY, root.dataset.theme);
        } catch (e) {
          // Storage can be blocked; the toggle still works for this page.
        }
      });
    }
  }

  /** Writes today's date into the Date box as dd.mm.yy, like a school copy. */
  function fillDate() {
    const box = document.querySelector('[data-today]');
    if (!box) return;
    const now = new Date();
    box.textContent = [now.getDate(), now.getMonth() + 1, now.getFullYear()]
                          .map((n) => String(n % 100).padStart(2, '0'))
                          .join('.');
  }

  /**
   * Returns a function giving random offsets in [-amount, amount] from a
   * seeded generator (mulberry32).
   * @param {number} seed
   * @return {function(number=): number}
   */
  function createJitter(seed) {
    let state = seed;
    const random = () => {
      state = (state + 0x6D2B79F5) | 0;
      let t = Math.imul(state ^ (state >>> 15), 1 | state);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return (amount = 1.6) => (random() - 0.5) * 2 * amount;
  }

  /**
   * Builds SVG path data for sketchy shapes. Every shape takes its wobble
   * from the same jitter, so drawing order matters for reproducibility.
   */
  class Sketch {
    /** @param {function(number=): number} jitter */
    constructor(jitter) {
      /** @private @const */
      this.jitter_ = jitter;
    }

    /**
     * A slightly bowed line.
     * @return {string}
     */
    line(x1, y1, x2, y2) {
      const j = this.jitter_;
      const midX = (x1 + x2) / 2 + j(1.2);
      const midY = (y1 + y2) / 2 + j(1.2);
      return `M${x1 + j()} ${y1 + j()} Q${midX} ${midY} ` +
          `${x2 + j()} ${y2 + j()}`;
    }

    /**
     * A box whose sides overshoot the corners a little.
     * @return {string}
     */
    rect(x, y, w, h) {
      return [
        this.line(x - 2, y, x + w + 2, y),
        this.line(x + w, y - 2, x + w, y + h + 2),
        this.line(x + w + 2, y + h, x - 2, y + h),
        this.line(x, y + h + 2, x, y - 2),
      ].join(' ');
    }

    /**
     * Diagonal hatching filling a box, like a highlighter.
     * @return {string}
     */
    hatch(x, y, w, h) {
      const strokes = [];
      for (let i = 6; i < w + h; i += 7) {
        const x1 = x + Math.max(0, i - h);
        const y1 = y + Math.min(i, h);
        const x2 = x + Math.min(i, w);
        const y2 = y + Math.max(0, i - w);
        strokes.push(this.line(x1 + 2, y1 - 2, x2 - 2, y2 + 2));
      }
      return strokes.join(' ');
    }

    /**
     * A cubic curve from `start` to `end`, optionally with an arrowhead.
     * @param {!Array<number>} start
     * @param {!Array<number>} control1
     * @param {!Array<number>} control2
     * @param {!Array<number>} end
     * @param {boolean=} arrow
     * @return {string}
     */
    curve(start, control1, control2, end, arrow = true) {
      const j = this.jitter_;
      let path = `M${start[0] + j(1)} ${start[1] + j(1)} ` +
          `C${control1[0] + j(3)} ${control1[1] + j(3)} ` +
          `${control2[0] + j(3)} ${control2[1] + j(3)} ${end[0]} ${end[1]}`;
      if (arrow) {
        const angle =
            Math.atan2(end[1] - control2[1], end[0] - control2[0]) + Math.PI;
        for (const side of [-1, 1]) {
          const barb = angle + side * 0.45;
          path += ` M${end[0]} ${end[1]} ` +
              `L${end[0] + Math.cos(barb) * 8 + j(0.8)} ` +
              `${end[1] + Math.sin(barb) * 8 + j(0.8)}`;
        }
      }
      return path;
    }
  }

  /**
   * Places the nav links and draws the graph behind them: About is the entry
   * block, the sections branch from it and merge at a φ node before CV and
   * the key, and Research loops back to the entry (while (phd)).
   * @param {!Element} nav
   * @param {!NavLayout} layout
   */
  function drawNav(nav, layout) {
    const {viewBox, boxAttr, phi, loopLabel} = layout;
    const sketch = new Sketch(createJitter(SKETCH_SEED));
    const percent = (value, size) => `${value / size * 100}%`;

    const boxes = {};
    for (const link of nav.querySelectorAll('a[data-box]')) {
      const [x, y, w, h] = link.dataset[boxAttr].split(',').map(Number);
      boxes[link.dataset.id] = {x, y, w, h, link};
      // Read by the drawn-graph rules in site.css; the flat boxes ignore them.
      link.style.setProperty('--box-left', percent(x - viewBox.x, viewBox.w));
      link.style.setProperty('--box-top', percent(y - viewBox.y, viewBox.h));
      link.style.setProperty('--box-width', percent(w, viewBox.w));
      link.style.setProperty('--box-height', percent(h, viewBox.h));
    }
    const topOf = (box) => [box.x + box.w / 2, box.y];
    const bottomOf = (box) => [box.x + box.w / 2, box.y + box.h];

    const outlines = [];
    const fills = [];
    for (const {x, y, w, h, link} of Object.values(boxes)) {
      outlines.push(sketch.rect(x, y, w, h), sketch.rect(x, y, w, h));
      if (link.getAttribute('aria-current') === 'page') {
        fills.push(sketch.hatch(x, y, w, h));
      }
    }

    const edges = [];
    const entry = bottomOf(boxes.about);
    for (const id of NAV_SECTIONS) {
      const top = topOf(boxes[id]);
      edges.push(sketch.curve(
          entry, [entry[0], entry[1] + 22], [top[0], top[1] - 22], top));
      const bottom = bottomOf(boxes[id]);
      edges.push(sketch.curve(
          bottom, [bottom[0], bottom[1] + 14], [phi[0], phi[1] - 12], phi,
          false));
    }
    for (const id of NAV_EXITS) {
      const top = topOf(boxes[id]);
      edges.push(
          sketch.curve(phi, [phi[0], phi[1] + 8], [top[0], top[1] - 10], top));
    }
    const aboutBox = boxes.about;
    const researchBox = boxes.research;
    const loopStart = [researchBox.x, researchBox.y + researchBox.h / 2];
    const loopEnd = [aboutBox.x, aboutBox.y + aboutBox.h / 2];
    edges.push(sketch.curve(
        loopStart, [loopStart[0] - 44, loopStart[1]],
        [loopEnd[0] - 150, loopEnd[1]], loopEnd));

    nav.querySelector('.cfg-ink')?.remove();
    nav.insertAdjacentHTML('afterbegin', `
      <svg class="cfg-ink" aria-hidden="true"
          viewBox="${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}">
        <path class="cfg-fill" d="${fills.join(' ')}"/>
        <path class="cfg-edge" d="${edges.join(' ')}"/>
        <path class="cfg-box" d="${outlines.join(' ')}"/>
        <circle class="cfg-phi-dot" cx="${phi[0]}" cy="${phi[1]}" r="3"/>
        <text class="cfg-phi" x="${phi[0] + 8}" y="${phi[1] + 2}">φ</text>
        <text x="${loopLabel[0]}" y="${loopLabel[1]}">while (phd)</text>
        <text x="${aboutBox.x - 4}" y="${aboutBox.y - 2}"
            text-anchor="end">entry:</text>
      </svg>`);
    nav.style.setProperty('--ar', `${viewBox.w} / ${viewBox.h}`);
    nav.classList.add('cfg-ready');
  }

  /**
   * Draws the nav graph, switching drawings when the sidebar comes and goes.
   */
  function initNav() {
    const nav = document.querySelector('.cfg');
    if (!nav) return;
    const sidebar = matchMedia(SIDEBAR_QUERY);
    const draw = () =>
        drawNav(nav, NAV_LAYOUTS[sidebar.matches ? 'side' : 'wide']);
    draw();
    sidebar.addEventListener('change', draw);
  }

  /**
   * Pads each .snap element (pictures, boxes: anything of arbitrary height)
   * so that the next line of text lands back on a ruled line.
   */
  function initRuleSnap() {
    const root = document.documentElement;
    const snap = () => {
      const line = parseFloat(getComputedStyle(root).getPropertyValue('--l'));
      for (const el of document.querySelectorAll('.snap')) {
        el.style.marginBottom = '';
        const margin = parseFloat(getComputedStyle(el).marginBottom) || 0;
        const height = el.getBoundingClientRect().height;
        const padding = Math.ceil(height / line - 0.01) * line - height;
        el.style.marginBottom = `${margin + padding}px`;
      }
    };
    let queued = false;
    const queueSnap = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        snap();
      });
    };
    snap();
    addEventListener('resize', queueSnap);
    addEventListener('load', queueSnap);
    document.fonts?.ready.then(queueSnap);
  }

  /** Pointing at (or tabbing to) a numeral lights it and its note together. */
  function initNotePairing() {
    for (const el of document.querySelectorAll('[data-g]')) {
      const pair = () =>
          document.querySelectorAll(`[data-g="${el.dataset.g}"]`);
      const light = (on) => () => {
        for (const p of pair()) p.classList.toggle('lit', on);
      };
      el.addEventListener('pointerenter', light(true));
      el.addEventListener('pointerleave', light(false));
      el.addEventListener('focusin', light(true));
      el.addEventListener('focusout', light(false));
    }
  }

  /**
   * Returns what the ink cursor writes over `target`: the link's data-ink,
   * an external link's host, "link", or '' for nothing.
   * @param {?Element} target
   * @return {string}
   */
  function cursorLabel(target) {
    const control = target?.closest('a, button');
    if (!control || control.matches('[data-theme-toggle]')) return '';
    if (control.dataset.ink) return control.dataset.ink;
    if (control.host && control.host !== location.host) {
      return control.host.replace(/^www\./, '');
    }
    return 'link';
  }

  /** A drop of ink follows the pointer and, over a link, writes what it is. */
  function initInkTrailer() {
    const ink = document.createElement('div');
    ink.id = 'ink';
    ink.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    ink.append(label);
    document.body.append(ink);

    const disabled = matchMedia(NO_TRAIL_QUERY);
    const trail =
        {x: 0, y: 0, targetX: 0, targetY: 0, running: false, lastTime: 0};
    let placed = false;

    const step = (now) => {
      const elapsed = Math.min(now - trail.lastTime, 100);
      const progress = 1 - Math.pow(TRAIL_EASE, elapsed / TRAIL_INTERVAL_MS);
      trail.lastTime = now;
      trail.x += (trail.targetX - trail.x) * progress;
      trail.y += (trail.targetY - trail.y) * progress;
      ink.style.transform = `translate(${trail.x}px, ${trail.y}px)`;
      const settled = Math.abs(trail.targetX - trail.x) < 0.1 &&
          Math.abs(trail.targetY - trail.y) < 0.1;
      if (settled) {
        trail.running = false;
      } else {
        requestAnimationFrame(step);
      }
    };

    addEventListener('pointermove', (event) => {
      if (disabled.matches || event.pointerType !== 'mouse') return;
      trail.targetX = event.clientX;
      trail.targetY = event.clientY;
      if (!placed) {
        trail.x = trail.targetX;
        trail.y = trail.targetY;
        placed = true;
      }
      ink.classList.add('on');
      const text = cursorLabel(/** @type {?Element} */ (event.target));
      ink.classList.toggle('open', Boolean(text));
      if (text && label.textContent !== text) label.textContent = text;
      if (!trail.running) {
        trail.running = true;
        trail.lastTime = performance.now();
        requestAnimationFrame(step);
      }
    });
    document.documentElement.addEventListener(
        'mouseleave', () => ink.classList.remove('on'));
  }

  /**
   * Links with data-bib="key" open that entry from assets/bibtex-db.js in a
   * dialog with a copy button.
   */
  function initBibtexDialog() {
    let dialog = null;

    const createDialog = () => {
      const el = document.createElement('dialog');
      el.className = 'bib';
      el.setAttribute('aria-labelledby', 'bib-title');
      el.innerHTML = `
        <header>
          <h2 id="bib-title"></h2>
          <button type="button" data-action="copy">copy</button>
          <button type="button" data-action="close">close</button>
        </header>
        <pre></pre>`;
      el.addEventListener('click', async (event) => {
        const action = event.target.dataset?.action;
        if (event.target === el || action === 'close') el.close();
        if (action !== 'copy') return;
        const bibtex = el.querySelector('pre');
        try {
          await navigator.clipboard.writeText(bibtex.textContent);
          event.target.textContent = 'copied';
          setTimeout(() => {
            event.target.textContent = 'copy';
          }, 1500);
        } catch (e) {
          getSelection().selectAllChildren(bibtex);  // Let the reader copy.
        }
      });
      document.body.append(el);
      return el;
    };

    document.addEventListener('click', (event) => {
      const link = event.target.closest('[data-bib]');
      if (!link) return;
      event.preventDefault();
      const key = link.dataset.bib;
      const entry = window.BIBTEX_DATABASE?.[key];
      dialog ??= createDialog();
      dialog.querySelector('h2').textContent =
          entry ? entry.title : 'Citation not found';
      dialog.querySelector('pre').textContent =
          entry ? entry.bibtex : `No BibTeX entry for "${key}".`;
      dialog.showModal();
    });
  }

  /**
   * Easter egg: clicking the profile photo swaps it for the one in its
   * data-swap-src (and back). The second photo only loads on the first click.
   */
  function initPhotoSwap() {
    for (const img of document.querySelectorAll('img[data-swap-src]')) {
      img.addEventListener('click', () => {
        [img.src, img.dataset.swapSrc] = [img.dataset.swapSrc, img.src];
        [img.alt, img.dataset.swapAlt] = [img.dataset.swapAlt, img.alt];
        img.closest('.photo')?.classList.toggle('swapped');
      });
    }
  }

  /** Leaves a note in the console for whoever opens devtools. */
  function greetConsole() {
    console.log(
        '%cनमस्ते, devtools reader.',
        'font: 24px Caveat, Kalam, cursive; color: #2b4fb3');
    console.log(
        'Plain HTML, a little JS, no trackers.\n' +
        'View source for a note.\n' +
        'PGP: 1742 06DB 710F 9E4A 06F5  9DF1 7473 B3A4 59BA 0808');
  }

  initTheme();
  fillDate();
  initNav();
  initRuleSnap();
  initNotePairing();
  initInkTrailer();
  initBibtexDialog();
  initPhotoSwap();
  greetConsole();
})();
