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

// Disable Selection
// document.onselectstart = disableselect;