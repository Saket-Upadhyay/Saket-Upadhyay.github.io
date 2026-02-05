// Variables
const content = document.getElementById('content');
// const navbar = document.getElementById('navbardiv')
const trailer = document.getElementById("mousefollow");

function LightMode() {

    localStorage.setItem("vision", "light");
    document.body.style.backgroundColor = "white";
    document.body.style.transition = ".3s linear";
    content.style.color = "black";
    content.style.transition = ".3s linear";
    // navbar.style.color = "black";
    trailer.style.backgroundColor = "black";
}

function DarkMode() {
    localStorage.setItem("vision", "dark");

    document.body.style.backgroundColor = "black";
    document.body.style.transition = ".3s linear";
    content.style.color = "white";
    content.style.transition = ".3s linear";
    // navbar.style.color = "white";
    trailer.style.backgroundColor = "deepskyblue";
}

function checkVision() {
    if (localStorage.getItem("vision") === 'dark') {
        DarkMode();
    } else if (localStorage.getItem("vision") === 'light') {
        LightMode();
    }
}

document.addEventListener("load", checkVision());

// Mouse shadow thing

const animateTrailer = (e, interacting) => {
    const x = e.clientX - trailer.offsetWidth / 2,
        y = e.clientY - trailer.offsetHeight / 2;


    let keyframes = {
        transform: `translate(${x}px, ${y}px) scale(${interacting ? 3 : 1})`
    }


    trailer.animate(keyframes, {
        duration: 800,
        fill: "forwards"
    });
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

// const handleOnMove = e => {
const handleOnMove = e => {

    // Mouse shadow movement
    const icon = document.getElementById("mouseshadow-icon");

    const interactable = e.target.closest(".interactive"),
        interacting = interactable !== null;

    animateTrailer(e, interacting);

    trailer.dataset.type = interacting ? interactable.dataset.type : "";
    icon.className = getTrailerClass(interactable.dataset.type);

    switch (interactable.dataset.type) {
        case "credits":
            icon.style.color = "#f5ec00";
            break;
        default:
            icon.style.color = "#FFFFFF";
    }

}

const disableselect = (e) => {
    return false
}


/* -- Had to add extra lines for touch events -- */


window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);



// BibTeX Modal Viewer
(function () {
  function ensureBibModal() {
    if (document.getElementById('bib-modal')) return;

    const style = document.createElement('style');
    style.textContent = `
      #bib-modal.hidden { display: none; }
      #bib-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; }
      #bib-modal .backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
      #bib-modal .dialog { position: relative; max-width: 90vw; max-height: 80vh; width: 760px; background: #fff; color: #000; border-radius: 6px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); overflow: hidden; display: flex; flex-direction: column; }
      #bib-modal .header { display:flex; gap:8px; align-items:center; padding:8px 12px; border-bottom: 1px solid #eee; background:#f7f7f7; }
      #bib-modal .title { flex:1; font-weight:600; font-size:14px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
      #bib-modal pre { margin:0; padding:12px; font-family: monospace; font-size:13px; overflow:auto; white-space:pre-wrap; background: #fff; }
      .btn { padding:6px 10px; border:1px solid #ccc; background:#fff; border-radius:4px; cursor:pointer; }
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
        <div class="footer" style="padding:8px 12px; border-top:1px solid #eee; text-align:right; background:#f7f7f7;">
          <small style="color:#666">Click outside or press Esc to close</small>
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


// Disable Selection
// document.onselectstart = disableselect;