// Variables
const content = document.getElementById('content');


// For mouse shadow

const trailer = document.getElementById("mouseshadow");


function LightMode() {

    localStorage.setItem("vision", "light")
    document.body.style.backgroundColor = "white";
    document.body.style.transition = ".3s linear";
    content.style.color = "black";
    content.style.transition = ".3s linear";

    trailer.style.backgroundColor = "black";


}

function DarkMode() {
    localStorage.setItem("vision", "dark")
    document.body.style.backgroundColor = "black";
    document.body.style.transition = ".3s linear";
    content.style.color = "white";
    content.style.transition = ".3s linear";

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
    track.dataset.predPer = track.dataset.percentage;
}

const handleOnMove = e => {

    // Mouse shadow movement
    const icon = document.getElementById("mouseshadow-icon");
    const imageinteractable = e.target.closest(".image"),
        imageinteracting = imageinteractable !== null;

    const interactable = e.target.closest(".interactive"),
        interacting = interactable !== null;

    animateTrailer(e, imageinteracting);


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

    track.animate({
        transform: `translate(${nextPercentage}%, -50%)`
    }, {duration: 1200, fill: "forwards"});

    for (const image of track.getElementsByClassName("image")) {
        image.animate({
            objectPosition: `${100 + nextPercentage}% center`
        }, {duration: 1200, fill: "forwards"});
    }


}

const disableselect = (e) => {
    return false
}

const animateTrailer = (e, interacting) => {
    const x = e.clientX - trailer.offsetWidth / 2,
        y = e.clientY - trailer.offsetHeight / 2;

    const keyframes = {
        transform: `translate(${x}px, ${y}px) scale(${interacting ? 8 : 1})`
    }

    trailer.animate(keyframes, {
        duration: 800,
        fill: "forwards"
    });
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

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);

// Disable Selection
document.onselectstart = disableselect;