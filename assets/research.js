// For mouse shadow

const trailer = document.getElementById("mouseshadow");

// Theme colours live in research.css as CSS variables keyed on <html data-theme>.
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

// The trailer is hidden by CSS on touch screens; reduced motion also makes the platter jump instead of glide.
const trailerOff = window.matchMedia("(hover: none), (prefers-reduced-motion: reduce)");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const getTrailerClass = type => {
    switch (type) {
        case "paper":
            return "fa-solid fa-arrow-up-right-from-square";
        case "pdf":
            return "fa-solid fa-file-pdf";
        case "remanime":
            return "fa-solid fa-circle-xmark";
        case "aboutbutton":
            return "fa-solid fa-user-graduate";
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
            return "fa-solid fa-key";
        case "catbutton":
            return "fa-solid fa-cat";
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
            return "fa-solid fa-link";
    }
}


// RESEARCH TAB THIGNS
const track = document.getElementById("platter");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    // A click without a drag never sets percentage; keep the last position.
    track.dataset.predPer = track.dataset.percentage ?? track.dataset.predPer;
}

const handleOnMove = e => {

    // Mouse shadow movement
    const icon = document.getElementById("mouseshadow-icon");
    const imageinteractable = e.target.closest(".image"),
        imageinteracting = imageinteractable !== null;

    const interactable = e.target.closest(".interactive"),
        interacting = interactable !== null;

    if (!trailerOff.matches) animateTrailer(e, imageinteracting);


    trailer.dataset.type = imageinteracting ? imageinteractable.dataset.type : "";

    if (imageinteracting) {
        icon.className = getTrailerClass(imageinteractable.dataset.type);
    }
    if (interacting) {
        trailer.dataset.type = interacting ? interactable.dataset.type : "";
        icon.className = getTrailerClass(interactable.dataset.type);
    }

    // Pallet movement

    if (track.dataset.mouseDownAt === "0") return;

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

    const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.predPer) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;

    glide.tp = nextPercentage;
    glide.to = 100 + nextPercentage;
    startGlide();
}

const disableselect = (e) => {
    return false
}

// Everything glides toward its target: each frame closes ~45% of the remaining distance per
// `halfStep` ms (62 for the cursor, 93 for the strip), independent of frame rate.
const glide = {
    x: 0, y: 0, s: 1, tx: 0, ty: 0, ts: 1, placed: false,   // cursor trailer
    p: -15, tp: -15,                                        // strip position (%), CSS starts at -15
    o: 50, to: 50,                                          // image object-position (%)
    running: false, last: 0
};

const stepGlide = now => {
    const g = glide,
        dt = Math.min(now - g.last, 100),
        quick = reduceMotion.matches ? 1 : 1 - Math.pow(0.55, dt / 62),
        slow = reduceMotion.matches ? 1 : 1 - Math.pow(0.55, dt / 93);
    g.last = now;
    g.x += (g.tx - g.x) * quick;
    g.y += (g.ty - g.y) * quick;
    g.s += (g.ts - g.s) * quick;
    g.p += (g.tp - g.p) * slow;
    g.o += (g.to - g.o) * slow;
    const settled = Math.abs(g.tx - g.x) < 0.05 && Math.abs(g.ty - g.y) < 0.05 && Math.abs(g.ts - g.s) < 0.005
        && Math.abs(g.tp - g.p) < 0.01 && Math.abs(g.to - g.o) < 0.01;
    if (settled) {
        Object.assign(g, {x: g.tx, y: g.ty, s: g.ts, p: g.tp, o: g.to});
    }
    trailer.style.transform = `translate(${g.x}px, ${g.y}px) scale(${g.s})`;
    track.style.transform = `translate(${g.p}%, -50%)`;
    for (const image of track.getElementsByClassName("image")) {
        image.style.objectPosition = `${g.o}% center`;
    }
    if (settled) g.running = false; else requestAnimationFrame(stepGlide);
}

const startGlide = () => {
    if (glide.running) return;
    glide.running = true;
    glide.last = performance.now();
    requestAnimationFrame(stepGlide);
}

const animateTrailer = (e, interacting) => {
    const g = glide;
    g.tx = e.clientX - trailer.offsetWidth / 2;
    g.ty = e.clientY - trailer.offsetHeight / 2;
    g.ts = interacting ? 8 : 1;
    if (!g.placed) {
        g.x = g.tx;
        g.y = g.ty;
        g.s = g.ts;
        g.placed = true;
    }
    startGlide();
}

// Click functions for papers

function fireflyredirect() {
    window.open("/rpapers/pdfs/saketfirefly.pdf", "_blank");
}


function nicsandroredirect() {
    window.open("https://link.springer.com/chapter/10.1007/978-3-030-90708-2_5", "_blank");
}

function pacerredirect() {
    window.open("/rpapers/pdfs/saketpacer.pdf", "_blank");
}

function paceieeeredirect() {
    window.open("https://ieeexplore.ieee.org/abstract/document/9006557", "_blank");
}

function aitestbedredirect() {
    window.open("https://www.sciencedirect.com/science/article/abs/pii/S0167739X21003642", "_blank");
}


/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = () => handleOnUp();

window.ontouchend = () => handleOnUp();

// One update per frame, however fast events arrive.
let pendingMove = null;
const queueMove = e => {
    if (!e) return;
    const first = pendingMove === null;
    pendingMove = {clientX: e.clientX, clientY: e.clientY, target: e.target};
    if (first) requestAnimationFrame(() => {
        handleOnMove(pendingMove);
        pendingMove = null;
    });
}

window.onmousemove = e => queueMove(e);

window.ontouchmove = e => queueMove(e.touches[0]);

// Disable Selection
document.onselectstart = disableselect;