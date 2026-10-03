// Variables
const trailer = document.getElementById("mousefollow");

// Theme colours live in style.css as CSS variables keyed on <html data-theme>.
// The inline snippet in each page's <head> applies the saved choice before paint.
function setVision(mode) {
    document.documentElement.dataset.theme = mode;
    try {
        localStorage.setItem("vision", mode);
    } catch (_) {
    }
}

function LightMode() {
    setVision("light");
}

function DarkMode() {
    setVision("dark");
}

// Mouse shadow thing

// The trailer closes ~45% of its remaining distance every 62ms (same feel as the old
// 800ms animations stacked on each other), independent of frame rate.
const trailerState = {x: 0, y: 0, s: 1, tx: 0, ty: 0, ts: 1, running: false, last: 0, placed: false};

const stepTrailer = now => {
    const t = trailerState,
        f = 1 - Math.pow(0.55, Math.min(now - t.last, 100) / 62);
    t.last = now;
    t.x += (t.tx - t.x) * f;
    t.y += (t.ty - t.y) * f;
    t.s += (t.ts - t.s) * f;
    const settled = Math.abs(t.tx - t.x) < 0.05 && Math.abs(t.ty - t.y) < 0.05 && Math.abs(t.ts - t.s) < 0.005;
    if (settled) {
        t.x = t.tx;
        t.y = t.ty;
        t.s = t.ts;
    }
    trailer.style.transform = `translate(${t.x}px, ${t.y}px) scale(${t.s})`;
    if (settled) t.running = false; else requestAnimationFrame(stepTrailer);
}

const animateTrailer = (e, interacting) => {
    const t = trailerState;
    t.tx = e.clientX - trailer.offsetWidth / 2;
    t.ty = e.clientY - trailer.offsetHeight / 2;
    t.ts = interacting ? 3 : 1;
    if (!t.placed) {
        t.x = t.tx;
        t.y = t.ty;
        t.s = t.ts;
        t.placed = true;
    }
    if (!t.running) {
        t.running = true;
        t.last = performance.now();
        requestAnimationFrame(stepTrailer);
    }
}
const getTrailerClass = type => {
    switch (type) {
        case "aboutbutton":
            return "fa-solid fa-user-graduate";
        case "weblink":
            return "fa-solid fa-link";
        case "researchbutton":
            return "fa-solid fa-book-open-reader";
        case "blogbutton":
            return "fa-solid fa-pen-nib";
        case "teachingbutton":
            return "fa fa-chalkboard-user";
        case "leaderbutton":
            return "fa fa-line-chart";
        case "talkbutton":
            return "fa-solid fa-bullhorn";
        case "cvbutton":
            return "fa-solid fa-newspaper";
        case "keybutton":
            return "fa-solid fa-key fa-shake";
        case "catbutton":
            return "fa-solid fa-cat fa-bounce";
        case "nightbutton":
            return "fa-solid fa-moon";
        case "morningbutton":
            return "fa-solid fa-sun";
        case "linkedin":
            return "fa-brands fa-linkedin";
        case "twitter":
            return "fa-brands fa-twitter";
        case "gscholar":
            return "fa-brands fa-google";
        case "extrabutton":
            return "fa-solid fa-image fa-beat";
        case "orcid":
            return "fa-brands fa-orcid";
        case "download":
            return "fa-solid fa-download";
        case "gpgsig":
            return "fa-solid fa-signature";
        case "youtube":
            return "fa-brands fa-youtube";
        case "github":
            return "fa-brands fa-github";
        case "credits":
            return "fa-solid fa-lightbulb";
        default:
            return "fa-solid fa-arrow-up-right-from-square";
    }
}

const handleOnMove = e => {

    // Mouse shadow movement
    const icon = document.getElementById("mouseshadow-icon");

    const interactable = e.target.closest(".interactive"),
        interacting = interactable !== null;

    animateTrailer(e, interacting);

    trailer.dataset.type = interacting ? interactable.dataset.type : "";
    if (!interacting) return;

    icon.className = getTrailerClass(interactable.dataset.type);
    icon.style.color = interactable.dataset.type === "credits" ? "#f5ec00" : "#FFFFFF";
}

// One trailer update per frame, however fast events arrive.
// The trailer is hidden by CSS on touch screens and for reduced motion.
const trailerOff = window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)");
let pendingMove = null;
const queueMove = e => {
    if (!e || !trailer || trailerOff.matches) return;
    const first = pendingMove === null;
    pendingMove = {clientX: e.clientX, clientY: e.clientY, target: e.target};
    if (first) requestAnimationFrame(() => {
        handleOnMove(pendingMove);
        pendingMove = null;
    });
}

window.onmousemove = e => queueMove(e);

window.ontouchmove = e => queueMove(e.touches[0]);


// BibTeX Modal Viewer
(function () {
  function ensureBibModal() {
    if (document.getElementById('bib-modal')) return;

    const style = document.createElement('style');
    style.textContent = `
      #bib-modal.hidden { display: none; }
      #bib-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; }
      #bib-modal .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
      #bib-modal .dialog { position: relative; max-width: 90vw; max-height: 80vh; width: 760px; background: var(--modal-bg); color: var(--fg); border-radius: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; }
      #bib-modal .header { display:flex; gap:8px; align-items:center; padding:8px 12px; border-bottom: 1px solid var(--modal-rule); background: var(--modal-bar); }
      #bib-modal .title { flex:1; font-weight:600; font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      #bib-modal pre { margin:0; padding:12px; font-family: monospace; font-size:13px; overflow:auto; white-space:pre-wrap; background: var(--modal-bg); }
      #bib-modal .footer { padding:8px 12px; border-top:1px solid var(--modal-rule); text-align:right; background: var(--modal-bar); }
      #bib-modal .footer small { color: var(--muted); }
      .btn { padding:6px 10px; border:1px solid var(--modal-rule); background: var(--modal-bg); color: var(--fg); border-radius:4px; cursor:pointer; }
    `;
    document.head.appendChild(style);

    const modal = document.createElement('div');
    modal.id = 'bib-modal';
    modal.className = 'hidden';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="backdrop" data-role="backdrop"></div>
      <div class="dialog" role="dialog" aria-modal="true" aria-labelledby="bib-title">
        <div class="header">
          <div id="bib-title" class="title">BibTeX</div>
          <div class="controls">
            <button id="bib-copy" class="btn" type="button">Copy</button>
            <button id="bib-close" class="btn" type="button">Close</button>
          </div>
        </div>
        <pre id="bib-content">Loading...</pre>
        <div class="footer">
          <small>Click outside or press Esc to close</small>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const contentEl = document.getElementById('bib-content');
    const titleEl = document.getElementById('bib-title');
    const closeBtn = document.getElementById('bib-close');
    const copyBtn = document.getElementById('bib-copy');
    const backdrop = modal.querySelector('[data-role="backdrop"]');

    function openModal() {
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function closeModal() {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    copyBtn.addEventListener('click', async function () {
      const text = contentEl.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied';
        setTimeout(() => { copyBtn.textContent = prev; }, 1500);
      } catch (_) {
        try {
          const range = document.createRange();
          range.selectNodeContents(contentEl);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } catch (_) {}
      }
    });

    modal._open = openModal;
    modal._close = closeModal;
    modal._contentEl = contentEl;
    modal._titleEl = titleEl;
  }

  // Show BibTeX by key lookup
  function showBibTeX(key) {
    const citation = BIBTEX_DATABASE[key];
    if (!citation) {
      console.error(`BibTeX key "${key}" not found in database`);
      showBibText('Error: Citation not found', 'Error');
      return;
    }
    showBibText(citation.bibtex, citation.title);
  }

  // Show BibTeX from raw string
  function showBibText(bibString, title) {
    ensureBibModal();
    const modal = document.getElementById('bib-modal');
    const contentEl = modal._contentEl;
    const titleEl = modal._titleEl;

    titleEl.textContent = title || 'BibTeX';
    contentEl.textContent = (bibString && bibString.length) ? bibString : '(empty)';
    modal._open();
  }

  window.showBibTeX = showBibTeX;
  window.showBibText = showBibText;
})();
